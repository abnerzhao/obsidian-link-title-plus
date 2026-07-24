export interface LinkMetadata {
  title: string;
  description: string;
  hostname: string;
  icon: string;
  url: string;
}

export interface LinkTitlePlusSettings {
  enabled: boolean;
  displayTemplate: string;
  proxyUrl: string;
}

export const DEFAULT_SETTINGS: LinkTitlePlusSettings = {
  enabled: true,
  displayTemplate: "[![{{hostname}} 图标|16]({{icon}}) {{title}}]({{url}})",
  proxyUrl: ""
};
