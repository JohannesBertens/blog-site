# Master Plan — blog-site Codebase Analysis

Consolidated and de-duplicated findings from:
- `plans/recommendations.md` (34 issues)
- `plans/q36-recommendations.md` (26 findings)
- `plans/q36-recommendations-2.md` (37 findings)

**Total unique findings: 45**
**Critical: 3 | High: 13 | Medium: 16 | Low: 13**

---

## CRITICAL (3)

| # | Finding | Sources | Location(s) | Effort |
|---|---------|---------|-------------|--------|
| 1 | **No test framework or CI/CD pipeline** — Zero test coverage, no test scripts, no type-check automation, no workflow files | All 3 files | `package.json`, `.github/` | Major Refactor |
| 2 | **DOM XSS in TOC generation** — `heading.textContent` injected via `innerHTML` without sanitization; user markdown content executes as HTML | q36-1, q36-2, recommendations | `MarkdownPostLayout.astro:663-671` | Quick Win |
| 3 | **XSS in Metadata title** — Title prop rendered directly without escaping; malicious HTML/JS could execute | recommendations | `Metadata.astro:47` | Quick Win |

---

## HIGH (13)

| # | Finding | Sources | Location(s) | Effort |
|---|---------|---------|-------------|--------|
| 4 | **Homepage not prerendered** — `prerender = false` forces SSR on every visit for fully static content | All 3 files | `index.astro:2` | Quick Win |
| 5 | **`output: 'server'` instead of static** — Produces ~960KB worker bundle for a pure content blog with no dynamic endpoints | q36-1 | `astro.config.mjs:7` | Medium |
| 6 | **Dead navigation JS** — `.nav-toggle`, `.nav-menu`, `.hamburger` listeners added for elements that don't exist in the template | All 3 files | `Navigation.astro:18-44` | Quick Win |
| 7 | **Dead like-button JS + CSS** — `#like-button`, `#like-count` IDs never rendered; `.like-btn`, `.like-count` CSS defined with no HTML | q36-2, recommendations | `MarkdownPostLayout.astro:722-782`, CSS:344-379 | Quick Win |
| 8 | **Dead share button JS** — `setupShareButtons()` handles clicks but buttons only open new windows, no Web Share API fallback | q36-2 | `MarkdownPostLayout.astro:754-782` | Medium |
| 9 | **Unthrottled scroll handler** — `updateActiveTocLink()` fires on every scroll frame without throttle, causing layout thrashing | q36-2, recommendations | `MarkdownPostLayout.astro:791` | Quick Win |
| 10 | **O(n x m) tag count computation** — `sortedPosts.filter()` runs for every tag on every render | q36-2, recommendations | `index.astro:107-126` | Quick Win |
| 11 | **Duplicate post loading** — `import.meta.glob` called independently in both `index.astro` and `MarkdownPostLayout.astro` | q36-2, recommendations | `index.astro:9`, `MarkdownPostLayout.astro:49` | Medium |
| 12 | **Monolithic layout (SRP violation)** — 795-line `MarkdownPostLayout.astro` contains TOC, like, share, related posts, and 473 lines of scoped CSS | recommendations | `MarkdownPostLayout.astro` | Medium |
| 13 | **CSS circular dependencies & mass duplication** — `tokens.css` imported 5+ times; `.container`, `.pulse`, `.skip-link`, `.fade-in` duplicated across 5+ files; ~500+ duplicate rules | q36-1 | `main.css:7-22`, `components.css:7`, `animations.css`, `utilities.css:802` | Medium |
| 14 | **1,485 lines of inline `<style>` blocks** — BlogCard (239), MarkdownPostLayout (474), EnhancedCodeBlock (333), Metadata (229), index (210) — defeats global CSS caching | q36-1 | All major `.astro` files | Major Refactor |
| 15 | **Untested core business logic** — `calculateReadingTime()`, tag filtering, `getRelativeTime()`, `formatDate()` all pure functions with zero test coverage | q36-1, recommendations | Multiple files | Medium |

---

## MEDIUM (16)

| # | Finding | Sources | Location(s) | Effort |
|---|---------|---------|-------------|--------|
| 16 | **Broken code block IDs** — `Math.random()` generates non-deterministic IDs causing hydration mismatches | q36-2 | `EnhancedCodeBlock.astro:29` | Medium |
| 17 | **Code stored in data attributes** — `data-code={encodeURIComponent(code)}` exposes full source in DOM for extraction; potential XSS via `decodeURIComponent` | q36-2, q36-1 | `EnhancedCodeBlock.astro:68,112,464` | Quick Win |
| 18 | **Font loading blocking render** — 3 font families x 5 weights = 15 font files loaded synchronously via Google Fonts without `display=swap` | q36-2, recommendations | `Layout.astro:45` | Quick Win |
| 19 | **Missing Content Collections schema** — No `src/content/config.ts`; frontmatter typos cause silent failures | q36-2, recommendations | (missing file) | Medium |
| 20 | **Missing TypeScript types** — `post: any` in `index.astro:24` bypassing TypeScript checking; no shared `BlogPostFrontmatter` interface | q36-2, q36-1 | `index.astro:24` | Quick Win |
| 21 | **Missing security HTTP headers** — No CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, HSTS | q36-2, q36-1, recommendations | `Layout.astro`, `astro.config.mjs` | Quick Win |
| 22 | **Missing external link security** — No `rel="noopener noreferrer"` on external links in blog posts | recommendations | Blog post content | Quick Win |
| 23 | **Unvalidated LocalStorage keys** — Path used directly without validation in like button | recommendations | `MarkdownPostLayout.astro:729` | Quick Win |
| 24 | **Hardcoded file paths** — Tight coupling with `import.meta.glob` paths; moving posts directory breaks both consumers | recommendations | `index.astro:9`, `MarkdownPostLayout.astro:49` | Medium |
| 25 | **Over-engineered utility system** — `utilities.css` (897 lines) + `layout.css` (664 lines) = 1,561 lines of never-used utility classes | q36-1 | `utilities.css` (897 lines), `layout.css` (664 lines) | Quick Win |
| 26 | **Hardcoded values bypassing design tokens** — Colors, durations, spacing used inline instead of CSS custom properties throughout | q36-1 | Multiple CSS files & components | Medium |
| 27 | **Index.astro god object** — 386 lines: data fetching, business logic, rendering, component logic, and 210 lines of CSS all in one file | q36-1 | `index.astro:1-386` | Medium |
| 28 | **Unused Typography.astro** — 245 lines, never imported; uses deprecated `<astro:component>` syntax | q36-1, recommendations | `Typography.astro` | Quick Win |
| 29 | **No linting/formatting/pre-commit tooling** — No ESLint, Prettier, Stylelint, or git hooks | q36-1, recommendations | Root level | Quick Win |
| 30 | **No error pages** — No `404.astro`, `500.astro`; malformed markdown could crash SSR with raw stack traces | q36-1 | N/A | Quick Win |

---

## LOW (13)

| # | Finding | Sources | Location(s) | Effort |
|---|---------|---------|-------------|--------|
| 31 | **Duplicate `formatDate` function** — Identical implementation in 4 files: BlogCard, Metadata, MarkdownPostLayout, Navigation | q36-2, q36-1, recommendations | 4 component files | Quick Win |
| 32 | **Duplicate scrollbar CSS** — Identical styles in `main.css` and `scrollbars.css` (~55 lines) | q36-2 | `main.css:29-84`, `scrollbars.css` | Quick Win |
| 33 | **Duplicate animation CSS** — `.transition-all`, `.pulse`, `.fade-in` duplicated across `main.css`, `animations.css`, `utilities.css` | q36-2 | `animations.css`, `main.css:458`, `utilities.css` | Medium |
| 34 | **Double `.blog-layout` definition** — First `1fr` layout in `layout.css:205`, then `300px 1fr` overrides silently at `layout.css:441` | q36-2 | `layout.css:205-211, 441-449` | Quick Win |
| 35 | **CSS import chain duplication** — `.blog-layout` defined across 4 locations: components.css, layout.css, index.astro inline, MarkdownPostLayout.astro inline | q36-2 | 4 locations | Medium |
| 36 | **Wrong preload target** — `global.css` preloaded but `main.css` is the actual entry point | q36-2, q36-1 | `Layout.astro:48` | Quick Win |
| 37 | **Two conflicting CSS entry points** — `global.css` imports `main.css`; `Layout.astro` preloads both separately, loading duplicate styles | q36-1 | `Layout.astro:48-51`, `global.css`, `main.css` | Quick Win |
| 38 | **Duplicate `--reading-width` token** — Defined at `tokens.css:85` and `tokens.css:300` | q36-2 | `tokens.css:85,300` | Quick Win |
| 39 | **CSS conflict: `text-rendering`** — `optimizeLegibility` in `base.css:13` conflicts with `optimizeSpeed` in `reset.css:29` | q36-2 | `base.css:13`, `reset.css:29` | Quick Win |
| 40 | **Duplicate tokens.css import** — `tokens.css` imported in `components.css:7` | recommendations | `components.css:7` | Quick Win |
| 41 | **Overly expansive utility CSS** — 196 lines of padding/margin utilities for `space-0` through `space-24`, likely <10% used | q36-2 | `utilities.css:15-210` | Medium |
| 42 | **Missing HTML entity semicolon** — `'&nbsp'` should be `'&nbsp;'`, renders literal "&nbsp" text | q36-2 | `MarkdownPostLayout.astro:665` | Quick Win |
| 43 | **Generator fingerprint exposed** — `<meta name="generator" content={Astro.generator}>` aids attacker research | q36-2, q36-1 | `Layout.astro:21` | Quick Win |
| 44 | **Unsafe tag URLs** — `/?tag=${tag}` without `encodeURIComponent` | q36-2 | `index.astro:119` | Quick Win |
| 45 | **README Mismatch** — Claims static deployment but uses SSR/Cloudflare; references non-existent files | recommendations | `README.md` vs `astro.config.mjs` | Quick Win |

---

## Consolidated Action Plan

### Immediate (1-2 hours) — Security + Quick Wins
1. **Fix XSS vulnerabilities** (#2, #3) — Sanitize TOC and Metadata title rendering
2. **Enable prerendering** on homepage (#4) — `export const prerender = true`
3. **Remove dead code** — Navigation JS (#6), like-button JS+CSS (#7), share button handler (#8), Typography.astro (#28)
4. **Add security headers** (#21, #22, #23) — CSP, X-Frame-Options, noopener on external links, validate LocalStorage keys
5. **Remove generator meta tag** (#43), fix entity semicolon (#42), fix tag URL encoding (#44)

### Short-term (1-2 days)
6. **Set up test framework + CI/CD** (#1) — Vitest + Playwright + `.github/workflows/ci.yml`
7. **Add linting + formatting** (#29) — Prettier + ESLint + pre-commit hooks
8. **Add error pages** (#30) — `404.astro`, `500.astro`
9. **Extract shared utilities** — `formatDate` (#31), `calculateReadingTime`, `getRelatedPosts`
10. **Add TypeScript types** (#20) — Shared `BlogPostFrontmatter` interface
11. **Consolidate CSS** — Remove duplicates (#32-#40), pick single entry point (#36-#38), fix conflicts (#39, #40)
12. **Optimize performance** — Throttle scroll handler (#9), pre-compute tag counts (#10), add `display=swap` to fonts (#18)
13. **Fix inline CSS** — Extract inline `<style>` blocks to global CSS files (#14)
14. **Update README** to match actual config (#45)

### Medium-term (1-2 weeks)
15. **Switch to static output** — Change `output: 'server'` to `'static'`, remove Cloudflare adapter (#5)
16. **Migrate to Content Collections** — Add schema, replace `import.meta.glob` (#19, #24)
17. **Pre-compute post data** — Shared module for glob loading, related posts map (#11, #15, #27)
18. **Replace data-attribute code storage** — Use Map or base64 encoding (#17)
19. **Fix code block IDs** — Deterministic IDs instead of `Math.random()` (#16)
20. **Audit hardcoded values** — Replace with CSS custom properties (#26)

### Major Refactor (sprint planning)
21. **Consolidate CSS architecture** — Remove circular imports, eliminate ~500 duplicate rules, pick single canonical location for every rule (#13)
22. **Eliminate dead utility CSS** — Delete unused `utilities.css` classes or reduce to only-used values (#13, #41)
23. **Split index.astro god object** — Extract TagFilter, PostGrid, data helpers into separate modules (#27)
24. **Break apart MarkdownPostLayout** — Extract TOC, ShareButtons, RelatedPosts into smaller components (#12)
25. **Replace over-engineered utility system** — Components already use semantic names; delete or drastically reduce utility classes (#25)

---

**Sources:** recommendations.md, q36-recommendations.md, q36-recommendations-2.md
