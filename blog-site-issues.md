# Blog Site — Code Analysis Report

**Date:** 2026-06-09  
**Project:** blog-site (Astro static site)  
**Analysis dimensions:** Architecture, Performance, Security, Code Quality, Testing, DX  
**Files analyzed:** 5 components, 2 layouts, 1 page, 9 CSS files, config files

---

## Critical (must fix)

### C-1: Line numbers feature in EnhancedCodeBlock is broken
- **File:** `src/components/EnhancedCodeBlock.astro:370-395`
- **Detail:** CSS selector `.line-numbers .language-highlight > *` targets per-line child elements, but Shiki wraps output in a single `<code>`/`<pre>` — no per-line children exist. CSS never fires.
- **Fix:** Use `<pre>` with `<span>` per line, or JS-based line numbering.

### C-2: Dead JavaScript in Navigation.astro — references non-existent DOM nodes
- **File:** `src/components/Navigation.astro:119-135`
- **Detail:** Script queries `.nav-toggle` and `.nav-menu`, but the component template has neither. Corresponding CSS in `components.css:140-195` is also dead.
- **Fix:** Remove the orphan `<script>` block and mobile-nav CSS.

### C-3: Dead like-button JavaScript in MarkdownPostLayout
- **File:** `src/layouts/MarkdownPostLayout.astro:727-740`
- **Detail:** `setupLikeButton()` calls `document.getElementById('like-button')` and `like-count`, but no such elements exist in the HTML template. CSS for `.like-btn` is also dead.
- **Fix:** Either add the HTML or remove the dead JS/CSS.

### C-4: Massive CSS duplication — `main.css` vs `animations.css` + `scrollbars.css`
- **Files:** `public/styles/main.css`, `public/styles/animations.css`, `public/styles/scrollbars.css`
- **Detail:** Three files define overlapping transition/animation/scrollbar classes. ~515 lines in `animations.css` duplicate what's in `main.css`. Scrollbar styles in three places.
- **Fix:** Consolidate all animation classes into `animations.css` only. Keep scrollbars in `scrollbars.css` only.

### C-5: Three identical `formatDate` functions
- **Files:** `src/components/BlogCard.astro:16-21`, `src/components/Metadata.astro:29-34`, `src/layouts/MarkdownPostLayout.astro:43-48`
- **Detail:** Identical logic duplicated across three components.
- **Fix:** Extract to `src/utils/format.ts`.

### C-6: `calculateReadingTime` duplicated — Astro code vs index.astro
- **Files:** `src/pages/index.astro:35-50`, `MarkdownPostLayout.astro` (missing in related posts)
- **Detail:** `index.astro` defines reading time helper. `MarkdownPostLayout` related posts section doesn't show reading time at all.
- **Fix:** Extract to shared `src/utils/readingTime.ts`.

### C-7: `import.meta.glob` with `eager: true` loads all posts on every page
- **File:** `src/layouts/MarkdownPostLayout.astro:72-77`
- **Detail:** Every article page eagerly parses all 13+ `.md` files just to find 3 related posts. Blocks rendering at scale.
- **Fix:** Use `{ eager: false }` and call `glob()` on demand, or pre-build related-post index.

### C-8: 5,165 lines of CSS (~431 KB uncompressed) shipped on every page
- **File:** `public/styles/` (all 11 files)
- **Detail:** Every stylesheet loaded unconditionally — mostly utility/animation classes never referenced in any `.astro` file. ~70% unused.
- **Fix:** Move to Astro scoped `<style>` blocks where possible. Use `lightningcss` or PurgeCSS at build time.

### C-9: `tocNav.innerHTML` injection — fragile and unsafe
- **File:** `src/layouts/MarkdownPostLayout.astro:654,674`
- **Detail:** Builds TOC HTML from template literal concatenation of heading text. While content is author-controlled, `innerHTML` with dynamic content is a code smell.
- **Fix:** Use `document.createElement('a')` + `setAttribute('href')` for each TOC link.

### C-10: `pubDate` parsing can produce `NaN` — breaks sort ordering
- **File:** `src/pages/index.astro:18`
- **Detail:** `new Date(b.frontmatter.pubDate).valueOf()` returns `NaN` for missing/invalid dates. Sorts silently break.
- **Fix:** Validate with `isNaN(dt.getTime())` guard.

### C-11: `.sort()` mutates the shared glob result array
- **File:** `src/pages/index.astro:15-18`
- **Detail:** `Object.values(allPosts).sort(...)` mutates in place. If glob result is shared, causes subtle bugs.
- **Fix:** Use `[...allPosts].sort(...)`.

### C-12: `any` types in `calculateReadingTime` and `postTagList`
- **File:** `src/pages/index.astro:23,43`
- **Detail:** Both functions use `post: any`, bypassing all TypeScript checking.
- **Fix:** Replace with `PostModule` type.

### C-13: No CI pipeline — no lint, format, type-check, or test steps
- **File:** `package.json`, GitHub Actions (missing)
- **Detail:** Zero quality checks configured. No scripts for `lint`, `format`, `typecheck`. No CI workflow.
- **Fix:** Add scripts and a GitHub Actions workflow on push/PR.

### C-14: Dead loading animation in EnhancedCodeBlock
- **File:** `src/components/EnhancedCodeBlock.astro:422-435`
- **Detail:** CSS defines `.enhanced-code-block.loading::after` shimmer, but no runtime logic ever applies `.loading` class.
- **Fix:** Implement loading state or remove CSS.

---

## High (should fix)

### H-1: Token CSS imported 5+ times
- **Files:** `main.css`, `base.css`, `layout.css`, `components.css`, `utilities.css`
- **Detail:** Each CSS sub-file imports `tokens.css` via `@import`, even though they're all chained through `main.css`.
- **Fix:** Only `main.css` should import `tokens.css`.

### H-2: `.skip-link` defined in both `reset.css` and `layout.css`
- **Files:** `public/styles/reset.css:303-318`, `public/styles/layout.css:365-380`
- **Detail:** Two different rule sets for same selector. `layout.css` version wins; reset version is dead.
- **Fix:** Consolidate in one location.

### H-3: Hardcoded `.token.*` CSS in EnhancedCodeBlock duplicates global Shiki styles
- **File:** `src/components/EnhancedCodeBlock.astro:400-418`
- **Detail:** Component defines `.token.comment`, `.token.keyword`, etc., duplicating `base.css:165-230`. Bloats every page using the component.
- **Fix:** Remove from component; rely on global definitions.

### H-4: `utilities.css` is ~620 lines — mostly unused
- **File:** `public/styles/utilities.css`
- **Detail:** 445+ grid/flex/utility classes, most never referenced. Duplicates grid classes already in `layout.css`.
- **Fix:** Use PurgeCSS. Remove duplicates from `layout.css`.

### H-5: 515 lines of `animations.css` — only 4 classes actually used
- **File:** `public/styles/animations.css`
- **Detail:** ~15 unused keyframes: `shake`, `bounce`, `bounceIn`, `slideInLeft/Right/Up/Down`, `notificationSlideIn/Out`, `scaleIn/Out`, `errorShake`, `successCheckmark`, `loadingSpinner`.
- **Fix:** Remove unused keyframes. Keep only `fadeIn`, `fadeInUp`, `pulse`, `blink`, `loading-shimmer`.

### H-6: Missized font loading — unused "Crimson Text" family
- **File:** `src/layouts/Layout.astro:66-70`
- **Detail:** Google Fonts loads Inter, JetBrains Mono, and Crimson Text — but Crimson Text is never used anywhere.
- **Fix:** Remove unused font family. Consider self-hosting with `@fontsource`.

### H-7: TOC is client-side only — empty in server HTML
- **File:** `src/layouts/MarkdownPostLayout.astro`
- **Detail:** TOC empty in server-rendered HTML, populated via JS. No TOC for JS-disabled users. Layout shift on paint.
- **Fix:** Generate TOC at build time by parsing markdown headings.

### H-8: `formatViews()` defined but `views` prop never passed
- **File:** `src/components/Metadata.astro:36-39`
- **Detail:** `formatViews` exists but no caller passes `views`. Speculative dead code.
- **Fix:** Remove until needed.

### H-9: Two copy buttons in EnhancedCodeBlock
- **File:** `src/components/EnhancedCodeBlock.astro`
- **Detail:** Copy button appears in both header (when `title` is set) and footer (always). Duplicates when `title` + `copyable` are both true.
- **Fix:** Consolidate to one copy button.

### H-10: Smooth-scroll JS double-fires with TOC handler
- **File:** `src/layouts/Layout.astro:105-114`
- **Detail:** Layout adds click handlers to all `a[href^="#"]`, which conflicts with TOC's own `scrollIntoView` calls in `MarkdownPostLayout`.
- **Fix:** Remove from Layout; use CSS `scroll-behavior: smooth`.

### H-11: `codeId` uses `Math.random()` — breaks hydration, potential duplicate IDs
- **File:** `src/components/EnhancedCodeBlock.astro:15`
- **Detail:** `Math.random().toString(36).slice(2)` generates non-deterministic IDs.
- **Fix:** Use stable counter-based ID or `Astro.generator`.

### H-12: `prefers-reduced-motion` duplicated in 4 CSS files
- **Files:** `reset.css`, `animations.css`, `main.css`, `scrollbars.css`
- **Detail:** Same reduced-motion media query block in four places.
- **Fix:** Define in exactly one place.

### H-13: Duplicate `html`/`body` rules in `reset.css` and `base.css`
- **Files:** `public/styles/reset.css:31-53`, `public/styles/base.css:31-53`
- **Detail:** Both define `font-smoothing`, `text-rendering`, `font-family` for `html` and `body`.
- **Fix:** Keep only in `base.css`.

### H-14: `EnhancedCodeBlock` embeds full code in `data-code` attribute
- **File:** `src/components/EnhancedCodeBlock.astro:345-346`
- **Detail:** `encodeURIComponent(code)` stores entire code snippet in DOM attribute — increases page size and exposes content.
- **Fix:** Use a reference ID and `<template>` element instead.

### H-15: No test setup — zero unit/integration/smoke tests
- **Detail:** No test framework configured. No smoke test verifying `astro build` succeeds.
- **Fix:** Add `vitest` with a build smoke test.

### H-16: Typography.astro uses fragile conditional chain for dynamic tags
- **File:** `src/components/Typography.astro:49-68`
- **Detail:** 9-branch `astro:component` conditional instead of Astro's built-in `<Component tag={...}>`.
- **Fix:** Use Astro's dynamic tag feature.

---

## Medium

### M-1: Theme tokens duplicated between media query and `[data-theme="light"]`
- **File:** `public/styles/tokens.css:130-230,233-330`
- **Detail:** Light-theme values repeated in both `@media (prefers-color-scheme: light)` and `:root[data-theme="light"]` blocks.
- **Fix:** Use a single source of truth; let JS handle the media query → `data-theme` mapping.

### M-2: `currentPage` prop in Navigation is unused
- **File:** `src/components/Navigation.astro:18`
- **Detail:** Prop is set as `data-current-page` but no CSS or JS uses it for active-page highlighting.
- **Fix:** Add CSS: `.nav-link[data-current-page="..."]`.

### M-3: Reading time uses 100 WPM (should be 200-250)
- **File:** `src/pages/index.astro:38`
- **Detail:** `wordsPerMinute = 100` produces inflated times (e.g., "4 min read" instead of "2 min").
- **Fix:** Use 200-225 WPM or check frontmatter `readingTime`.

### M-4: Theme toggle uses emoji (inconsistent rendering)
- **File:** `src/components/Navigation.astro:30`
- **Detail:** ☀/☾ emoji render differently across OS/browser.
- **Fix:** Use SVG icons or CSS-drawn elements.

### M-5: `post.url ?? '#'` — broken anchor for undefined URLs
- **File:** `src/pages/index.astro:72`
- **Detail:** Replaces `undefined` URL with `#`, creating non-functional links.
- **Fix:** Filter posts with `undefined` URLs before rendering.

### M-6: Duplicate `@keyframes` across CSS files
- **Files:** `main.css`, `animations.css`, `utilities.css`, `components.css`
- **Detail:** `@keyframes pulse` defined in 3 files; `blink` in 3 files; `fadeIn`, `fadeInUp`, `slide*` in 2 files each.
- **Fix:** Consolidate all keyframes into `animations.css`.

### M-7: File comment says `blog.astro` but file is `index.astro`
- **File:** `src/pages/index.astro:1`
- **Detail:** `// src/pages/blog.astro` comment is wrong.
- **Fix:** Update or remove.

### M-8: No `.env.example` or secret-scanning config
- **Detail:** Placeholder token in a blog post; no pre-commit hooks or CI scanning.
- **Fix:** Add `docs/SECURITY.md` and pre-commit hook.

### M-9: No CSS optimization in build config
- **File:** `astro.config.mjs`
- **Detail:** Missing `compressHTML: true`, `build.inlineStylesheets: 'auto'`.
- **Fix:** Add both.

### M-10: `tsconfig.json` includes `dist/`, `.wrangler/`, `node_modules/`
- **File:** `tsconfig.json`
- **Detail:** `"include": ["**/*"]` covers build artifacts.
- **Fix:** Add `"exclude": ["dist", ".wrangler", "node_modules"]`.

### M-11: `children?: any` in Typography.astro discards type safety
- **File:** `src/components/Typography.astro:10`
- **Detail:** Slot content typed as `any`.
- **Fix:** Use `astroHTML.JSX.Element` or rely on Astro inference.

### M-12: `(document as any)['execCommand']` type escape
- **File:** `src/components/EnhancedCodeBlock.astro:490`
- **Detail:** `as any` cast for copy API.
- **Fix:** Use typed extension: `Document & { execCommand?(cmd: string): boolean }`.

### M-13: `postTagList` doesn't handle string tags
- **File:** `src/pages/index.astro:45`
- **Detail:** If `tags` is a string instead of `string[]`, returns `[]` silently.
- **Fix:** Add normalization: `typeof t === 'string' ? [t] : t`.

### M-14: `PostFrontmatter.pubDate` typed as `string | Date` but only `string` is produced
- **File:** `src/types.ts`
- **Detail:** Union type never produces `Date` from markdown frontmatter.
- **Fix:** Use `pubDate: string`.

### M-15: `MarkdownLayoutProps` generic missing full frontmatter type parameter
- **File:** `src/layouts/MarkdownPostLayout.astro:10`
- **Detail:** Generic doesn't use exported `PostFrontmatter` type.
- **Fix:** Parameterize with `PostFrontmatter`.

### M-16: No broken-link checker for 13 posts with external links
- **Detail:** External links in blog posts can rot without detection.
- **Fix:** Add monthly CI cron job with link checker.

### M-17: Smooth-scroll `<script>` is bundled separately (not `is:inline`)
- **File:** `src/layouts/Layout.astro`
- **Detail:** One-liner click handler gets its own bundle when it could be inline.
- **Fix:** Use `is:inline` or CSS `scroll-behavior`.

---

## Summary

| Severity | Count | Key Themes |
|----------|-------|------------|
| **Critical** | 14 | Broken features (line numbers, dead JS/CSS), massive CSS bloat (431KB, ~70% unused), duplicated code, no CI, injection risk |
| **High** | 16 | Redundant CSS imports, unused animations, TOC built client-side, type escapes, no tests |
| **Medium** | 17 | Theme duplication, accessibility, config gaps, edge cases |
| **Total** | **47** | |

**Overall:** The blog has a strong design-system foundation (tokens, fluid typography, theme switching) and well-structured Astro components. However, the CSS architecture is **the biggest problem** — 5,165 lines (431 KB) across 11 files with ~70% of classes and keyframes never referenced, plus extensive duplication across files. The critical broken-feature issues (line numbers not rendering, dead JS referencing missing DOM elements) suggest incomplete refactoring. The absence of any CI/lint/type-check pipeline means quality issues accumulate silently. Addressing the CSS consolidation and adding a CI workflow would provide the most value with the least risk.
