import { arrayBufferToBase64, requestUrl } from "obsidian";
import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";
import * as http from "node:http";
import * as https from "node:https";
import type { LinkMetadata } from "./types";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const SITE_NAMES: Record<string, string> = {
  "douban.com": "豆瓣",
  "youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "github.com": "GitHub"
};
const MAX_ICON_SIZE = 32 * 1024;

interface ProxyResponse {
  body: Buffer;
  contentType?: string;
}

function getContentType(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(?:x([0-9a-f]+)|([0-9]+));/gi, (match: string, hex?: string, decimal?: string) => {
      const codePoint = Number.parseInt(hex ?? decimal ?? "", hex ? 16 : 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    });
}

function textFromHtml(value: string | undefined): string {
  return decodeHtml((value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function attribute(html: string, name: string, value: string): string | undefined {
  const tagPattern = /<meta\s+[^>]*>/gi;
  for (const tag of html.match(tagPattern) ?? []) {
    const namePattern = new RegExp(`\\b${name}\\s*=\\s*["']${value}["']`, "i");
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1];
    if (namePattern.test(tag) && content) return textFromHtml(content);
  }
  return undefined;
}

function resolveUrl(value: string | undefined, baseUrl: URL): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return undefined;
  }
}

function getSiteName(hostname: string, title = ""): string {
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, "");
  for (const [domain, siteName] of Object.entries(SITE_NAMES)) {
    if (normalizedHostname === domain || normalizedHostname.endsWith(`.${domain}`)) return siteName;
  }
  const titleSuffix = title.match(/\(([^()]+)\)\s*$/)?.[1]?.trim();
  if (titleSuffix) return titleSuffix;
  return normalizedHostname.split(".")[0];
}

async function fetchWithProxy(
  url: string,
  proxyUrl: string,
  redirects = 0,
  extraHeaders: Record<string, string> = {}
): Promise<ProxyResponse> {
  const proxy = new URL(proxyUrl);
  if (!/^(https?|socks4a?|socks5h?):$/.test(proxy.protocol)) {
    throw new Error("代理地址必须使用 HTTP、HTTPS 或 SOCKS 协议");
  }
  if (redirects > 5) {
    throw new Error("重定向次数过多");
  }

  return new Promise((resolve, reject) => {
    const transport = new URL(url).protocol === "https:" ? https : http;
    const agent = /^socks/.test(proxy.protocol)
      ? new SocksProxyAgent(proxy)
      : new HttpsProxyAgent(proxy);
    const request = transport.get(url, {
      agent,
      headers: { "User-Agent": USER_AGENT, ...extraHeaders },
      timeout: 12_000
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        void fetchWithProxy(new URL(response.headers.location, url).href, proxyUrl, redirects + 1, extraHeaders).then(resolve, reject);
        return;
      }
      if (response.statusCode && response.statusCode >= 400) {
        response.resume();
        reject(new Error(`请求失败 (${response.statusCode})`));
        return;
      }
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => { chunks.push(chunk); });
      response.on("end", () => resolve({
        body: Buffer.concat(chunks),
        contentType: getContentType(response.headers["content-type"])
      }));
    });
    request.on("timeout", () => request.destroy(new Error("请求超时")));
    request.on("error", reject);
  });
}

async function fetchHtml(url: string, proxyUrl: string): Promise<string> {
  if (proxyUrl.trim()) {
    const response = await fetchWithProxy(url, proxyUrl.trim(), 0, { Accept: "text/html,application/xhtml+xml" });
    return response.body.toString("utf8");
  }
  const response = await requestUrl({
    url,
    method: "GET",
    headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
    throw: false
  });
  if (response.status >= 400) throw new Error(`请求失败 (${response.status})`);
  return response.text;
}

async function fetchIconDataUrl(url: string, referer: string, proxyUrl: string): Promise<string | undefined> {
  try {
    if (proxyUrl.trim()) {
      const response = await fetchWithProxy(url, proxyUrl.trim(), 0, {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        Referer: referer
      });
      if (!response.contentType?.startsWith("image/") || response.body.length > MAX_ICON_SIZE) return undefined;
      return `data:${response.contentType.split(";", 1)[0]};base64,${response.body.toString("base64")}`;
    }
    const response = await requestUrl({
      url,
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        Referer: referer
      },
      throw: false
    });
    const contentType = response.headers["content-type"]?.split(";", 1)[0];
    if (response.status < 200 || response.status >= 400 || !contentType?.startsWith("image/") || response.arrayBuffer.byteLength > MAX_ICON_SIZE) {
      return undefined;
    }
    return `data:${contentType};base64,${arrayBufferToBase64(response.arrayBuffer)}`;
  } catch {
    return undefined;
  }
}

function fallbackMetadata(pageUrl: URL): LinkMetadata {
  const siteName = getSiteName(pageUrl.hostname);
  return { title: siteName, description: "", hostname: pageUrl.hostname, siteName, url: pageUrl.href };
}

function isYoutubeUrl(pageUrl: URL): boolean {
  const hostname = pageUrl.hostname.toLowerCase().replace(/^www\./, "");
  return hostname === "youtube.com" || hostname.endsWith(".youtube.com") || hostname === "youtu.be";
}

async function fetchYoutubeMetadata(pageUrl: URL, proxyUrl: string): Promise<LinkMetadata> {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(pageUrl.href)}&format=json`;
    const data = JSON.parse(await fetchHtml(endpoint, proxyUrl)) as { title?: string };
    const title = typeof data.title === "string" && data.title.trim() ? data.title.trim() : "YouTube";
    const icon = await fetchIconDataUrl("https://www.youtube.com/favicon.ico", pageUrl.href, proxyUrl);
    return { title, description: "", hostname: pageUrl.hostname, siteName: "YouTube", icon, url: pageUrl.href };
  } catch {
    return fallbackMetadata(pageUrl);
  }
}

export async function fetchLinkMetadata(url: string, proxyUrl: string): Promise<LinkMetadata> {
  const pageUrl = new URL(url);
  if (isYoutubeUrl(pageUrl)) return fetchYoutubeMetadata(pageUrl, proxyUrl);
  let html: string;
  try {
    html = await fetchHtml(pageUrl.href, proxyUrl);
  } catch {
    return fallbackMetadata(pageUrl);
  }
  const title = attribute(html, "property", "og:title")
    ?? attribute(html, "name", "twitter:title")
    ?? textFromHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1])
    ?? pageUrl.hostname;
  const description = attribute(html, "property", "og:description")
    ?? attribute(html, "name", "description")
    ?? "";
  const siteName = attribute(html, "property", "og:site_name")
    ?? attribute(html, "name", "application-name")
    ?? getSiteName(pageUrl.hostname, title);
  const iconCandidate = resolveUrl(
    html.match(/<link\s+[^>]*rel\s*=\s*["'][^"']*icon[^"']*["'][^>]*href\s*=\s*["']([^"']+)["']/i)?.[1]
      ?? html.match(/<link\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*rel\s*=\s*["'][^"']*icon[^"']*["']/i)?.[1],
    pageUrl
  ) ?? new URL("/favicon.ico", pageUrl).href;
  const icon = await fetchIconDataUrl(iconCandidate, pageUrl.href, proxyUrl);

  return { title, description, hostname: pageUrl.hostname, siteName, icon, url: pageUrl.href };
}
