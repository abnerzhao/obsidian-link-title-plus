import type { LinkMetadata } from "./types";

const PLACEHOLDER = /{{(title|url|hostname|siteName|icon|description|site|display)}}/g;

function escapeMarkdownText(value: string): string {
  return value.replace(/[\\[\]]/g, "\\$&").replace(/\r?\n/g, " ").trim();
}

export function renderTemplate(template: string, metadata: LinkMetadata): string {
  const site = metadata.icon
    ? `![图标|16](${metadata.icon})`
    : escapeMarkdownText(metadata.siteName);
  const title = escapeMarkdownText(metadata.title);
  const values: Record<string, string> = {
    title,
    url: metadata.url,
    hostname: escapeMarkdownText(metadata.hostname),
    siteName: escapeMarkdownText(metadata.siteName),
    icon: metadata.icon ?? "",
    description: escapeMarkdownText(metadata.description),
    site,
    display: title === metadata.siteName ? site : `${site} ${title}`
  };

  return template.replace(PLACEHOLDER, (_, key: string) => values[key]);
}
