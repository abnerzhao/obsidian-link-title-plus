export interface LinkMetadata {
  title: string;
  description: string;
  hostname: string;
  siteName: string;
  icon?: string;
  url: string;
}

export interface LinkTitlePlusSettings {
  enabled: boolean;
  showIcon: boolean;
  displayTemplate: string;
  proxyUrl: string;
}

export const DEFAULT_SETTINGS: LinkTitlePlusSettings = {
  enabled: true,
  showIcon: false,
  displayTemplate: "[{{display}}]({{url}})",
  proxyUrl: ""
};

export const LEGACY_DEFAULT_TEMPLATE = "[![{{hostname}} 图标|16]({{icon}}) {{title}}]({{url}})";
export const PREVIOUS_DEFAULT_TEMPLATE = "[{{site}} {{title}}]({{url}})";
