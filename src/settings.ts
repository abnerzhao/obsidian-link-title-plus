import { App, PluginSettingTab, Setting, type SettingDefinitionItem } from "obsidian";
import type LinkTitlePlusPlugin from "./main";
import { DEFAULT_SETTINGS, type LinkTitlePlusSettings } from "./types";

const TEMPLATE_DESCRIPTION = "默认模板通常只需保留即可。\n默认：[{{display}}]({{url}})\n仅标题：[{{title}}]({{url}})\n网站名 + 标题：[{{siteName}} · {{title}}]({{url}})\n高级占位符：{{site}}、{{hostname}}、{{icon}}、{{description}}。{{display}} = 图标或网站名称 + 标题。";

export class LinkTitlePlusSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: LinkTitlePlusPlugin) {
    super(app, plugin);
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        name: "自动补全链接标题",
        desc: "粘贴单个 HTTP(S) URL 时，自动抓取网页信息并生成链接。",
        control: { type: "toggle", key: "enabled", defaultValue: DEFAULT_SETTINGS.enabled }
      },
      {
        name: "自动展示网站图标",
        desc: "默认开启；关闭后显示网站名称和网页标题。图标获取失败时也会显示网站名称。",
        control: { type: "toggle", key: "showIcon", defaultValue: DEFAULT_SETTINGS.showIcon }
      },
      {
        name: "链接展示模板",
        desc: TEMPLATE_DESCRIPTION,
        control: { type: "textarea", key: "displayTemplate", placeholder: "[{{display}}]({{url}})", rows: 3 }
      },
      {
        name: "代理地址",
        desc: "仅用于抓取网页元数据，支持 HTTP、HTTPS 和 SOCKS5，例如 socks5://127.0.0.1:1080；留空则使用 Obsidian 默认网络。",
        control: { type: "text", key: "proxyUrl", placeholder: "http://127.0.0.1:7890" }
      }
    ];
  }

  getControlValue(key: string): unknown {
    return this.plugin.settings[key as keyof LinkTitlePlusSettings];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key === "enabled" && typeof value === "boolean") {
      this.plugin.settings.enabled = value;
    } else if (key === "showIcon" && typeof value === "boolean") {
      this.plugin.settings.showIcon = value;
    } else if (key === "displayTemplate" && typeof value === "string") {
      this.plugin.settings.displayTemplate = value.trim() || DEFAULT_SETTINGS.displayTemplate;
    } else if (key === "proxyUrl" && typeof value === "string") {
      this.plugin.settings.proxyUrl = value.trim();
    } else {
      return;
    }
    await this.plugin.saveSettings();
  }

  // Obsidian 1.12 and earlier render this imperative fallback.
  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("自动补全链接标题")
      .setDesc("粘贴单个 HTTP(S) URL 时，自动抓取网页信息并生成链接。")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("自动展示网站图标")
      .setDesc("默认开启；关闭后显示网站名称和网页标题。图标获取失败时也会显示网站名称。")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.showIcon)
        .onChange(async (value) => {
          this.plugin.settings.showIcon = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("链接展示模板")
      .setDesc(TEMPLATE_DESCRIPTION)
      .addTextArea((text) => text
        .setPlaceholder("[{{display}}]({{url}})")
        .setValue(this.plugin.settings.displayTemplate)
        .onChange(async (value) => {
          this.plugin.settings.displayTemplate = value.trim() || DEFAULT_SETTINGS.displayTemplate;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName("代理地址")
      .setDesc("仅用于抓取网页元数据，支持 HTTP、HTTPS 和 SOCKS5，例如 socks5://127.0.0.1:1080；留空则使用 Obsidian 默认网络。")
      .addText((text) => text
        .setPlaceholder("http://127.0.0.1:7890")
        .setValue(this.plugin.settings.proxyUrl)
        .onChange(async (value) => {
          this.plugin.settings.proxyUrl = value.trim();
          await this.plugin.saveSettings();
        }));
  }
}
