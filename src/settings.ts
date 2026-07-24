import { App, PluginSettingTab, Setting } from "obsidian";
import type LinkTitlePlusPlugin from "./main";

export class LinkTitlePlusSettingTab extends PluginSettingTab {
  constructor(app: App, private plugin: LinkTitlePlusPlugin) {
    super(app, plugin);
  }

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
      .setName("链接展示模板")
      .setDesc("可用：{{title}}、{{url}}、{{hostname}}、{{icon}}、{{description}}")
      .addTextArea((text) => text
        .setPlaceholder("[{{title}}]({{url}})")
        .setValue(this.plugin.settings.displayTemplate)
        .onChange(async (value) => {
          this.plugin.settings.displayTemplate = value.trim() || "[{{title}}]({{url}})";
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
