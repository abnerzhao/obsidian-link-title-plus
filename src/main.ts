import { Editor, MarkdownView, Notice, Plugin } from "obsidian";
import { fetchLinkMetadata } from "./metadata";
import { LinkTitlePlusSettingTab } from "./settings";
import { renderTemplate } from "./template";
import { DEFAULT_SETTINGS, LEGACY_DEFAULT_TEMPLATE, type LinkTitlePlusSettings } from "./types";

const URL_PATTERN = /^https?:\/\/[^\s<>]+$/i;
const PLACEHOLDER_PREFIX = "LinkTitlePlus-";

export default class LinkTitlePlusPlugin extends Plugin {
  settings: LinkTitlePlusSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new LinkTitlePlusSettingTab(this.app, this));
    this.registerEvent(this.app.workspace.on("editor-paste", (event: ClipboardEvent, editor: Editor) => {
      void this.handlePaste(event, editor);
    }));
  }

  async loadSettings(): Promise<void> {
    const storedSettings = await this.loadData() as Partial<LinkTitlePlusSettings> | null;
    this.settings = { ...DEFAULT_SETTINGS, ...storedSettings };
    if (this.settings.displayTemplate === LEGACY_DEFAULT_TEMPLATE) {
      this.settings.displayTemplate = DEFAULT_SETTINGS.displayTemplate;
      await this.saveSettings();
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  private async handlePaste(event: ClipboardEvent, editor: Editor): Promise<void> {
    if (!this.settings.enabled || !(this.app.workspace.getActiveViewOfType(MarkdownView))) return;
    const text = event.clipboardData?.getData("text/plain")?.trim();
    if (!text || !URL_PATTERN.test(text)) return;

    event.stopPropagation();
    event.preventDefault();
    const marker = `${PLACEHOLDER_PREFIX}${crypto.randomUUID()}`;
    editor.replaceSelection(marker);

    try {
      const metadata = await fetchLinkMetadata(text, this.settings.proxyUrl);
      const output = renderTemplate(this.settings.displayTemplate, metadata);
      this.replaceMarker(editor, marker, output);
    } catch (error) {
      this.replaceMarker(editor, marker, text);
      new Notice(`获取链接标题失败：${error instanceof Error ? error.message : "未知错误"}`);
    }
  }

  private replaceMarker(editor: Editor, marker: string, replacement: string): void {
    const offset = editor.getValue().indexOf(marker);
    if (offset < 0) return;
    const from = this.positionFromOffset(editor, offset);
    const to = this.positionFromOffset(editor, offset + marker.length);
    editor.replaceRange(replacement, from, to);
  }

  private positionFromOffset(editor: Editor, offset: number): { line: number; ch: number } {
    const before = editor.getValue().slice(0, offset);
    const line = before.split("\n").length - 1;
    return { line, ch: before.length - before.lastIndexOf("\n") - 1 };
  }
}
