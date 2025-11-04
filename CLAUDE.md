# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple Astro blog site built with the minimal Astro template. It's a personal blog featuring static pages and Markdown-based blog posts.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on localhost:4321)
pnpm dev

# Build production site
pnpm build

# Preview production build locally
pnpm preview

# Run Astro CLI commands
pnpm astro [command]
```

## Architecture

### File Structure
- `src/pages/` - Astro pages and Markdown files that become site routes
- `src/components/` - Reusable Astro components (e.g., Navigation.astro)
- `src/styles/` - Global CSS styles
- `public/` - Static assets (images, favicon)

### Key Components
- **Navigation.astro** - Simple navigation component with links to Home, About, and Blog pages
- **Global CSS** - Basic styling with centered layout, max-width constraints, and consistent typography

### Content Management
- Blog posts are Markdown files in `src/pages/posts/` with frontmatter (title, pubDate, description, etc.)
- Static pages use `.astro` files with frontmatter for dynamic content
- Currently has 3 sample blog posts and 3 main pages (index, about, blog)

### TypeScript Configuration
- Uses strict Astro TypeScript configuration
- Type checking enabled for better development experience

## Development Notes

- This is a minimal Astro setup without additional frameworks (React, Vue, etc.)
- Pages are file-based routes - adding new `.astro` or `.md` files in `src/pages/` creates new routes
- Astro handles server-side rendering by default, generating static HTML
- The Navigation component is imported on each page for consistent navigation