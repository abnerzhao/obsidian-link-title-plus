# Link Title Plus

[中文说明](README.zh-CN.md)

Link Title Plus converts a pasted HTTP(S) URL into a Markdown link with its page title and favicon.

## Installation

After the plugin is approved, install and enable `Link Title Plus` from **Settings -> Community plugins** in Obsidian.

For manual installation, copy `main.js`, `manifest.json`, and `styles.css` into:

```text
<Vault>/.obsidian/plugins/link-title-plus/
```

Then enable the plugin from Obsidian's Community plugins settings.

## Usage

Paste a single HTTP(S) URL in a Markdown editor. The plugin replaces it with a Markdown link containing the page title. Website icons are disabled by default and can be enabled in the plugin settings.

Configure the display template and optional proxy in the plugin settings.

## Features

- Fetches Open Graph, Twitter, or HTML page titles.
- Inlines favicons as data URLs to avoid hotlink-protection failures.
- Falls back to the website name when metadata cannot be fetched.
- Uses YouTube oEmbed instead of loading video watch pages.
- Supports configurable display templates and HTTP, HTTPS, or SOCKS5 proxies.

## Display Template

The default template is:

```md
[{{display}}]({{url}})
```

`{{display}}` renders the page title by default. When **Show website icons automatically** is enabled, it renders a 16px icon and title when a favicon is available, or a website name and title when it is not.

Available placeholders:

| Placeholder | Value |
| --- | --- |
| `{{title}}` | Page title |
| `{{url}}` | Original URL |
| `{{hostname}}` | Host name |
| `{{siteName}}` | Website name |
| `{{icon}}` | Inlined favicon data URL |
| `{{description}}` | Page description |
| `{{site}}` | Empty by default; when automatic icons are enabled, a 16px icon or website name |
| `{{display}}` | Page title by default; when automatic icons are enabled, icon or website name followed by the title |

Examples:

```md
[{{title}}]({{url}})
[{{siteName}} · {{title}}]({{url}})
```

## Proxy

The proxy is used only for fetching page metadata. Leave it empty to use Obsidian's default network settings.

```text
http://127.0.0.1:7890
socks5://127.0.0.1:1080
```
