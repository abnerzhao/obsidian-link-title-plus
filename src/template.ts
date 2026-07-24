import type { LinkMetadata } from "./types";

const PLACEHOLDER = /{{(title|url|hostname|icon|description)}}/g;

function escapeMarkdownText(value: string): string {
  return value.replace(/[\\[\]]/g, "\\$&").replace(/\r?\n/g, " ").trim();
}

export function renderTemplate(template: string, metadata: LinkMetadata): string {
  const values: Record<string, string> = {
    title: escapeMarkdownText(metadata.title),
    url: metadata.url,
    hostname: escapeMarkdownText(metadata.hostname),
    icon: metadata.icon,
    description: escapeMarkdownText(metadata.description)
  };

  return template.replace(PLACEHOLDER, (_, key: string) => values[key]);
}
