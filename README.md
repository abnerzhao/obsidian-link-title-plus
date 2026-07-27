# Link Title Plus

[English README](README.en.md)

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
