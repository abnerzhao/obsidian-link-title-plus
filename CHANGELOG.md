# Changelog

All notable changes to this project are documented in this file.

## 0.1.5 - 2026-08-14

- Show website icons by default, with an option to display the page title and website name instead.
- Avoid repeating a website name that is already present in the page title.

## 0.1.4 - 2026-08-14

- Add an option to show website icons automatically, disabled by default.
- Use a stable GitHub favicon and align rendered icons with link text.

## 0.1.3 - 2026-07-30

- Update the README with English installation and usage instructions.
- Move the Chinese documentation to a dedicated README.zh-CN.md file.

## 0.1.1 - 2026-07-27

- Respect already handled paste events and prevent the default paste after handling a URL.
- Add declarative setting definitions for Obsidian settings search.
- Improve metadata-fetching type safety.
- Make the Chinese README the default documentation and add a separate English README.

## 0.1.0 - 2026-07-25

Initial community release.

- Convert pasted HTTP(S) URLs into Markdown links with page titles.
- Fetch and inline favicons to avoid hotlink protection failures.
- Fall back to the website name when page metadata cannot be fetched.
- Use YouTube oEmbed for video titles without loading watch pages.
- Support configurable display templates and HTTP, HTTPS, or SOCKS5 proxy URLs.
