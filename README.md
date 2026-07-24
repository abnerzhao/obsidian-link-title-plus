# obsidian-link-title-plus

粘贴 URL 时，自动抓取网页标题和站点图标，生成可配置的 Markdown 链接。

## 功能

- 粘贴单个 HTTP(S) URL 时自动转换。
- 优先读取 Open Graph / Twitter 标题，回退到页面 `<title>`。
- 读取网页 favicon；未声明时回退为站点 `/favicon.ico`。
- 使用模板决定链接中显示哪些信息。
- 支持 HTTP、HTTPS 和 SOCKS5 代理抓取网页元数据。

默认输出：

```md
[![图标|16](https://example.com/favicon.ico) Example Domain](https://example.com/)
```

在阅读视图或 Live Preview 中，它会显示为包含网站图标和标题的链接。

## 设置

| 设置项 | 说明 |
| --- | --- |
| 自动补全链接标题 | 关闭后保留 Obsidian 原生粘贴行为。 |
| 链接展示模板 | 定义生成的 Markdown 格式。 |
| 代理地址 | 仅用于抓取网页元数据；留空时使用 Obsidian 默认网络。 |

模板可使用以下占位符：

| 占位符 | 内容 |
| --- | --- |
| `{{title}}` | 网页标题 |
| `{{url}}` | 原始 URL |
| `{{hostname}}` | 域名 |
| `{{icon}}` | favicon URL |
| `{{description}}` | 网页描述 |
| `{{site}}` | 成功获取图标时显示 16px 图标；否则显示域名 |

例如，只保留标题：

```md
[{{title}}]({{url}})
```

例如，展示域名和标题：

```md
[{{hostname}}: {{title}}]({{url}})
```

代理示例：

```text
http://127.0.0.1:7890
socks5://127.0.0.1:1080
```

> favicon 会由 Obsidian 在渲染 Markdown 时单独加载，不经过此处的元数据抓取代理。

## 本地开发

```bash
npm install
npm run dev
```

开发时将 `main.js`、`manifest.json` 和 `styles.css` 链接或复制到测试 Vault：

```text
<Vault>/.obsidian/plugins/obsidian-link-title-plus/
```

生产构建：

```bash
npm run build
```

## 当前范围

这是第一版 MVP，仅处理编辑器中粘贴的单个 URL。暂不包含批量补全、拖拽处理、缓存和移动端支持。
