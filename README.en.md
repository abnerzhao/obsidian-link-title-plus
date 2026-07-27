# Link Title Plus

[中文说明](README.md)

Link Title Plus automatically converts pasted HTTP(S) URLs into Markdown links with page titles and favicons.

## Features

- Fetches Open Graph, Twitter, or HTML page titles.
- Embeds favicons as data URLs to avoid hotlink-protection failures.
- Falls back to the website name when metadata cannot be fetched.
- Uses YouTube oEmbed instead of loading video watch pages.
- Supports configurable display templates and HTTP, HTTPS, and SOCKS5 proxies.

## Installation

Install the plugin from Obsidian Community Plugins after it has been approved. For manual installation, copy `main.js`, `manifest.json`, and `styles.css` to:

```text
<Vault>/.obsidian/plugins/link-title-plus/
```

The default display template is:

```md
[{{display}}]({{url}})
```

`{{display}}` renders an icon and title when a favicon is available, or a website name and title when it is not.
