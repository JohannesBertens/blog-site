# Contributing

## Development Setup

```bash
# Install dependencies
pnpm install

# Start development server (localhost:4321)
pnpm dev

# Build for production
pnpm build
```

## Code Style

```bash
# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# Lint with ESLint
pnpm lint

# Type check with TypeScript
pnpm check
```

## Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

## Project Structure

```
src/
├── components/    # Reusable Astro components
├── layouts/       # Page layouts (Layout.astro, MarkdownPostLayout.astro)
└── pages/         # Routes and blog posts (posts/*.md)
```

### Adding a New Post

1. Create a Markdown file in `src/pages/posts/`
2. Add frontmatter:

```yaml
---
title: "Your Post Title"
pubDate: 2025-12-01
description: "Short summary"
author: "Johannes"
tags: ["tag1", "tag2"]
draft: false
---
```

## Pull Request Process

### Branch Naming

- `feat/<short-description>` — new features
- `fix/<short-description>` — bug fixes
- `chore/<short-description>` — maintenance

### PR Description

- Summary of changes
- Link to related issue (if applicable)
- Screenshots for UI changes

### Required Checks

Before merging, ensure:
- `pnpm check` passes (type checking)
- `pnpm lint` passes
- `pnpm format:check` passes
- `pnpm test` passes
- `pnpm test:e2e` passes (if applicable)
