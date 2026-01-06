## Purpose
Brief, actionable guidance for AI coding agents working on this Astro blog.

## Big picture
- Framework: Astro (v5) + TypeScript. See [astro.config.mjs](astro.config.mjs).
- Output: configured for Cloudflare adapter (`@astrojs/cloudflare`) with `output: 'server'` — changing post file paths or adapter requires updating imports and deploy targets.
- Content: Markdown posts live in `src/pages/posts/*.md` and are collected with `import.meta.glob('../pages/posts/*.md', { eager: true })` (see [src/layouts/MarkdownPostLayout.astro](src/layouts/MarkdownPostLayout.astro)).

## Key components & boundaries
- Pages: `src/pages/` — file-based routing; adding `.astro` or `.md` creates routes.
- Layouts: `src/layouts/` (main layout and blog post layout). Use `Layout.astro` for global structure and `MarkdownPostLayout.astro` for posts.
- Components: `src/components/` — small, focused UI units (e.g. `BlogCard.astro`, `Navigation.astro`, `Metadata.astro`). Keep behavior in components, presentation in CSS.
- Styles: global modular CSS in `public/styles/` (tokens, base, layout, components, utilities). Edit `public/styles/tokens.css` to change theme tokens.

## Project-specific patterns
- Post collection: use `import.meta.glob('../pages/posts/*.md', { eager: true })` and expect `frontmatter` fields (title, pubDate, description, tags, image, draft). Example frontmatter fields:

```yaml
title: "Your Post"
pubDate: 2025-12-01
description: "Short summary"
author: "Johannes"
tags: ["tag1","tag2"]
draft: false
```

- Reading time: calculated at render time (see `calculateReadingTime` pattern in `src/pages/blog.astro`). Follow that helper when adding derived metadata.
- Related posts: `MarkdownPostLayout.astro` builds related posts from all modules; it assumes `post.frontmatter.tags` is an array.

## Dev & build workflows
- Local dev: `pnpm install` then `pnpm dev` (server runs at localhost:4321). See [README.md](README.md).
- Build: `pnpm build`; preview: `pnpm preview`.
- Type check: `pnpm astro check` (project uses TypeScript).
- Node & package manager: Node.js >=18, pnpm recommended (see `package.json`).

## Integration & deployment notes
- Adapter: Cloudflare adapter in [astro.config.mjs](astro.config.mjs). For serverless/static-hosting changes, update adapter config.
- Static assets: placed in `public/` and referenced by absolute paths (e.g. `/styles/global.css`, `/og-image.png`).

## Conventions for AI edits
- Keep component changes small and localized; prefer editing `src/components/*` and corresponding styles in `public/styles/components.css`.
- When changing how posts are discovered or frontmatter names, update all uses of `import.meta.glob('../pages/posts/*.md'...)` and `post.frontmatter.*` (search for `import.meta.glob` across `src/`).
- Preserve accessibility helpers: skip links in `Layout.astro`, focus handling in CSS and `Navigation.astro`.

## Useful file references
- Homepage & listing: [src/pages/index.astro](src/pages/index.astro)
- Blog listing helper: [src/pages/blog.astro](src/pages/blog.astro)
- Post layout: [src/layouts/MarkdownPostLayout.astro](src/layouts/MarkdownPostLayout.astro)
- Main layout: [src/layouts/Layout.astro](src/layouts/Layout.astro)
- CSS tokens: [public/styles/tokens.css](public/styles/tokens.css)
- Navigation & keyboard shortcuts: [src/components/Navigation.astro](src/components/Navigation.astro)

## Small examples
- Add a new post: create `src/pages/posts/2025MMDD-title.md` with frontmatter shown above. The site will pick it up automatically.
- Adjust theme color: edit `--color-primary` and related tokens in [public/styles/tokens.css](public/styles/tokens.css).

## When to ask the repo owner
- Any change to publishing pipeline or adapter (Cloudflare) — ask before switching to static output.
- Adding server-side APIs or altering `output` in `astro.config.mjs`.

---
If anything here is unclear or you'd like more examples (tests, CI), tell me which area to expand.
