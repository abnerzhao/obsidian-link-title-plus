import type { LinkMetadata } from "./types";

const PLACEHOLDER = /{{(title|url|hostname|siteName|icon|description|site|display)}}/g;

function escapeMarkdownText(value: string): string {
  return value.replace(/[\\[\]]/g, "\\$&").replace(/\r?\n/g, " ").trim();
}

export function renderTemplate(template: string, metadata: LinkMetadata, showIcon: boolean): string {
  const site = showIcon && metadata.icon
    ? `<img class="link-title-plus-icon" src="${metadata.icon}" alt="" width="16" height="16">`
    : escapeMarkdownText(metadata.siteName);
  const title = escapeMarkdownText(metadata.title);
  const display = !showIcon
    ? title === metadata.siteName ? title : `${title} ${escapeMarkdownText(metadata.siteName)}`
    : title === metadata.siteName ? site : `${site} ${title}`;
  const values: Record<string, string> = {
    title,
    url: metadata.url,
    hostname: escapeMarkdownText(metadata.hostname),
    siteName: escapeMarkdownText(metadata.siteName),
    icon: metadata.icon ?? "",
    description: escapeMarkdownText(metadata.description),
    site,
    display
  };

  return template.replace(PLACEHOLDER, (_, key: string) => values[key]);
}
