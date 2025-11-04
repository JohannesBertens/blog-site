# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple Astro blog site built with the minimal Astro template. It's a personal blog featuring a homepage with blog post listings and Markdown-based blog posts with a terminal-inspired design system.

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
- `src/components/` - Reusable Astro components (Navigation, BlogCard, Metadata, etc.)
- `src/layouts/` - Layout components (Layout.astro, MarkdownPostLayout.astro)
- `public/styles/` - Modular CSS architecture with design tokens
- `public/` - Static assets (images, favicon)

### Key Components
- **Navigation.astro** - Terminal-inspired navigation with keyboard shortcuts
- **BlogCard.astro** - Blog post preview cards with metadata and tags
- **Metadata.astro** - Blog post metadata display (author, date, tags, reading time)
- **Typography.astro** - Typography utilities (available for future use)
- **Layout.astro** - Main layout with SEO meta tags and global functionality
- **MarkdownPostLayout.astro** - Specialized layout for blog posts with navigation and sharing

### CSS Architecture
- **tokens.css** - Design system variables (colors, spacing, typography)
- **reset.css** - CSS reset for consistent cross-browser styling
- **base.css** - Base HTML element styles
- **layout.css** - Grid system, containers, and layout utilities
- **components.css** - Reusable component styling (navigation, cards, buttons, badges)
- **utilities.css** - Single-purpose utility classes
- **main.css** - Main entry point that imports all CSS modules

### Content Management
- Blog posts are Markdown files in `src/pages/posts/` with frontmatter (title, pubDate, description, tags, etc.)
- Homepage (`index.astro`) displays blog post listings using BlogCard components
- Currently has 3 sample blog posts with terminal-inspired styling
- No separate About or Blog pages - homepage serves as the main content hub

### TypeScript Configuration
- Uses strict Astro TypeScript configuration
- Type checking enabled for better development experience

## Development Notes

- This is a minimal Astro setup without additional frameworks (React, Vue, etc.)
- Pages are file-based routes - adding new `.astro` or `.md` files in `src/pages/` creates new routes
- Astro handles server-side rendering by default, generating static HTML
- Features a terminal-inspired design system with custom CSS architecture
- Keyboard shortcuts: Alt+G+H goes to homepage
- Blog posts use native Astro markdown rendering with syntax highlighting
- EnhancedCodeBlock.astro is available for custom code block styling if needed
- CSS is modular and organized by purpose (tokens, reset, base, layout, components, utilities)
- Print styles are optimized for blog content
- Responsive design with mobile-first approach