# Link Title Plus

[English](#english) | [中文](#中文)

## English

Link Title Plus automatically converts pasted HTTP(S) URLs into Markdown links with page titles and favicons.

### Features

- Fetches Open Graph, Twitter, or HTML page titles.
- Embeds favicons as data URLs to avoid hotlink-protection failures.
- Falls back to the website name when metadata cannot be fetched.
- Uses YouTube oEmbed instead of loading video watch pages.
- Supports configurable display templates and HTTP, HTTPS, and SOCKS5 proxies.

### Installation

Install the plugin from Obsidian Community Plugins after it has been approved. For manual installation, copy `main.js`, `manifest.json`, and `styles.css` to:

```text
<Vault>/.obsidian/plugins/link-title-plus/
```

The default display template is:

```md
[{{display}}]({{url}})
```

`{{display}}` renders an icon and title when a favicon is available, or a website name and title when it is not.

## 中文

粘贴 URL 时，自动抓取网页标题和站点图标，生成可配置的 Markdown 链接。

## 功能

- 粘贴单个 HTTP(S) URL 时自动转换。
- 优先读取 Open Graph / Twitter 标题，回退到页面 `<title>`。
- 读取网页 favicon；图标以内联数据写入链接，避免网站 CDN 防盗链导致阅读时显示失败。
- YouTube 使用 oEmbed 获取标题，不请求或加载视频页面。
- 使用模板决定链接中显示哪些信息。
- 支持 HTTP、HTTPS 和 SOCKS5 代理抓取网页元数据。

默认输出：

```md
[{{display}}]({{url}})
```

`{{display}}` 是默认展示组合：有图标时为“图标 + 标题”，无法获取图标时为“网站名称 + 标题”。

例如：

```md
[![图标|16](data:image/x-icon;base64,...) Example Domain](https://example.com/)
[豆瓣 Python Cookbook（第3版）中文版](https://book.douban.com/subject/26381341/)
```

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
| `{{siteName}}` | 网站名称 |
| `{{icon}}` | 内联的 favicon 数据 URL |
| `{{description}}` | 网页描述 |
| `{{site}}` | 成功获取图标时显示 16px 图标；否则显示网站名称 |
| `{{display}}` | 默认展示：图标或网站名称，加网页标题 |

一般只需使用默认模板：

```md
[{{display}}]({{url}})
```

例如，只保留标题：

```md
[{{title}}]({{url}})
```

例如，始终展示网站名称和标题：

```md
[{{siteName}} · {{title}}]({{url}})
```

代理示例：

```text
http://127.0.0.1:7890
socks5://127.0.0.1:1080
```

> favicon 在生成链接时由插件获取并转为内联数据，避免远程图片防盗链导致图标显示失败。

## 本地开发

```bash
npm install
npm run dev
```

开发时将 `main.js`、`manifest.json` 和 `styles.css` 链接或复制到测试 Vault：

```text
<Vault>/.obsidian/plugins/link-title-plus/
```

生产构建：

```bash
npm run build
```

## 发布说明

发布记录见 [CHANGELOG.md](CHANGELOG.md)。首个社区版本为 `0.1.0`；创建 GitHub Release 时请使用相同的 Tag，并上传 `main.js`、`manifest.json` 和 `styles.css`。

## 当前范围

这是第一版 MVP，仅处理编辑器中粘贴的单个 URL。暂不包含批量补全、拖拽处理、缓存和移动端支持。
