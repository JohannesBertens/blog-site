# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **CI/CD Pipeline**
  - GitHub Actions workflow (`.github/workflows/ci.yml`)
  - ESLint configuration (`eslint.config.js`)
  - Prettier configuration (`.prettierrc`, `.prettierignore`)

- **New Components** (commit `a059e98`)
  - `PostGrid.astro` - Blog posts grid with tag filtering
  - `RelatedPosts.astro` - Related posts based on tag similarity
  - `ShareButtons.astro` - Social sharing (Twitter, LinkedIn, Reddit, native Web Share API)
  - `TableOfContents.astro` - Auto-generated table of contents
  - `TagFilter.astro` - Tag filter sidebar component
  - `404.astro` - 404 error page with terminal styling
  - `500.astro` - 500 error page with terminal styling

- **Library Utilities** (commits `71e5fea`, `a059e98`)
  - `src/lib/posts.ts` - Post loading, filtering (`getAllPosts`, `getAllTags`, `getTagCounts`, `getFilteredPosts`, `isValidTag`)
  - `src/lib/utils.ts` - Shared utilities (`formatDate`, `calculateReadingTime`, `formatCount`)
  - `src/lib/types.ts` - TypeScript definitions (`BlogPostFrontmatter`, `BlogPostModule`)
  - `vitest.config.ts` - Test configuration

- **Testing**
  - Unit tests with Vitest (`src/lib/__tests__/utils.test.ts`)

### Changed

- **Refactored Components** (commit `a059e98`)
  - `BlogCard.astro` - Improved card styling, removed duplicate props
  - `Metadata.astro` - Enhanced metadata display
  - `MarkdownPostLayout.astro` - Streamlined layout, uses shared `posts.ts`
  - `Layout.astro` - Enhanced with security headers
  - `index.astro` - Refactored to use PostGrid and TagFilter components

- **Centralized Imports** (commit `71e5fea`)
  - Removed 4 local `formatDate` implementations, now uses shared `lib/utils.ts`
  - Added TypeScript typing to all `import.meta.glob` calls

- **CSS Architecture** (commits `71e5fea`, `a059e98`)
  - Added `public/styles/components.css` for component-specific styles
  - Removed empty/unused CSS files (`base.css`, `layout.css`, `main.css`, `utilities.css`)
  - Fixed CSS preload target (`global.css` → `main.css`)

### Security

- **Security Hardening** (commit `906590e`)
  - Fixed XSS in TOC generation: replaced `innerHTML` with safe `textContent`
  - Fixed XSS in Metadata title: Astro auto-escapes in templates
  - Removed `generator` meta tag (information leakage)
  - Added security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`
  - Fixed tag URLs with `encodeURIComponent`
  - Replaced `Math.random()` IDs with deterministic hash in EnhancedCodeBlock
  - Removed sensitive `data-code` attribute

### Fixed

- **Bug Fixes** (commit `906590e`)
  - Removed dead `setupLikeButton()`, `setupShareButtons()`, scroll listener code
  - Removed dead Navigation JavaScript (`.nav-toggle`, `.nav-menu`, `.hamburger`)
  - Removed like button CSS

### Removed

- **Deleted Components** (commit `906590e`)
  - `src/components/Typography.astro` - 245 lines of unused code
  - `src/components/Navigation.astro` - Dead JavaScript code

## [0.0.1] - Initial Release

### Added
- Astro v5 blog with Cloudflare adapter
- Terminal-inspired design system
- Blog post support with Markdown frontmatter
- Navigation with keyboard shortcuts
- Metadata display and reading time calculation
- Related posts by tag similarity
- Table of contents generation
- Social sharing buttons
- 404 and 500 error pages
