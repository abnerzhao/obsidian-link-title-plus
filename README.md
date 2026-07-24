# Link Title Plus

将粘贴的 URL 自动转换为带站点图标的 Markdown 链接。

## MVP 功能

- 粘贴单个 HTTP(S) URL 时，自动抓取页面标题。
- 默认输出包含 favicon 的 Markdown 链接。
- 可通过模板自定义显示标题、网址、域名、图标和描述。
- 支持为元数据抓取设置 HTTP/HTTPS/SOCKS5 代理（桌面端）。

## 开发

```bash
npm install
npm run dev
```

将 `main.js`、`manifest.json` 和 `styles.css` 链接或复制到测试库的 `.obsidian/plugins/link-title-plus/`。
