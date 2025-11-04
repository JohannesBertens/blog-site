# Phase 1: CSS Architecture Foundation

## Overview
This phase establishes the foundation for our developer-focused blog styling by creating a modular CSS architecture with terminal-inspired design tokens and responsive breakpoints.

## File Structure
```
src/styles/
├── global.css          # Main global styles entry point
├── variables.css       # CSS custom properties and design tokens
├── typography.css      # Typography system and font definitions
├── components.css      # Reusable component styles
├── layout.css          # Layout and grid systems
├── responsive.css      # Responsive design breakpoints
└── animations.css      # Keyframes and animation definitions
```

## CSS Custom Properties (variables.css)

### Color Palette - Terminal Inspired
```css
:root {
  /* Dark Terminal Background */
  --bg-primary: #0d1117;        /* GitHub Dark background */
  --bg-secondary: #161b22;      /* Slightly lighter for cards/sections */
  --bg-tertiary: #21262d;       /* Hover states, borders */
  --bg-overlay: #010409;        /* Deep overlay for modals */

  /* Terminal Accent Colors */
  --accent-green: #3fb950;      /* Success, links */
  --accent-blue: #58a6ff;       /* Primary actions */
  --accent-cyan: #39c5cf;       /* Secondary accents */
  --accent-yellow: #d29922;     /* Warnings, highlights */
  --accent-red: #f85149;        /* Errors, important */
  --accent-purple: #bc8cff;     /* Special elements */

  /* Text Colors */
  --text-primary: #f0f6fc;      /* Main text */
  --text-secondary: #8b949e;    /* Secondary text, metadata */
  --text-muted: #656d76;        /* Muted text, placeholders */
  --text-inverse: #0d1117;      /* Text on colored backgrounds */

  /* Border and UI Elements */
  --border-primary: #30363d;    /* Main borders */
  --border-secondary: #21262d;  /* Subtle borders */
  --border-accent: var(--accent-green);

  /* Code Block Specific */
  --code-bg: #0d1117;           /* Code background */
  --code-border: #30363d;       /* Code block borders */
  --code-comment: #8b949e;      /* Code comments */
  --code-keyword: #ff7b72;      /* Keywords */
  --code-string: #a5d6ff;       /* Strings */
  --code-number: #79c0ff;       /* Numbers */
  --code-function: #d2a8ff;     /* Function names */
}
```

### Typography Scale
```css
:root {
  /* Font Families */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Crimson Text', Georgia, serif;

  /* Fluid Typography Scale */
  --text-xs: clamp(0.75rem, 2vw, 0.875rem);     /* 12px - 14px */
  --text-sm: clamp(0.875rem, 2.5vw, 1rem);      /* 14px - 16px */
  --text-base: clamp(1rem, 3vw, 1.125rem);      /* 16px - 18px */
  --text-lg: clamp(1.125rem, 3.5vw, 1.25rem);   /* 18px - 20px */
  --text-xl: clamp(1.25rem, 4vw, 1.5rem);       /* 20px - 24px */
  --text-2xl: clamp(1.5rem, 5vw, 2rem);         /* 24px - 32px */
  --text-3xl: clamp(2rem, 6vw, 2.5rem);         /* 32px - 40px */
  --text-4xl: clamp(2.5rem, 7vw, 3rem);         /* 40px - 48px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing System
```css
:root {
  /* Spacing Scale (4px base unit) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */

  /* Component-specific spacing */
  --container-padding: var(--space-6);
  --section-gap: var(--space-16);
  --card-padding: var(--space-6);
  --nav-padding: var(--space-4);
}
```

### Responsive Breakpoints
```css
:root {
  /* Mobile-first breakpoints */
  --breakpoint-sm: 640px;   /* Small tablets */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */

  /* Container max-widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;
}
```

## Global Styles (global.css)

### Reset and Base Styles
```css
/* Import CSS variables */
@import './variables.css';

/* Modern CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 100%;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  min-height: 80vh;
  overflow-x: hidden;
}

/* Base typography improvements */
p {
  margin-bottom: var(--space-4);
  max-width: 65ch; /* Optimal reading length */
}

/* Links */
a {
  color: var(--accent-blue);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-cyan);
  text-decoration: underline;
}

a:focus {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
  color: var(--text-primary);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl); }
h5 { font-size: var(--text-lg); }
h6 { font-size: var(--text-base); }

/* Lists */
ul, ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
}

li {
  margin-bottom: var(--space-2);
}

/* Code */
code {
  font-family: var(--font-mono);
  background-color: var(--bg-tertiary);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: var(--accent-cyan);
}

pre {
  background-color: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 0.5rem;
  padding: var(--space-4);
  overflow-x: auto;
  margin-bottom: var(--space-6);
}

pre code {
  background: none;
  padding: 0;
  color: var(--text-primary);
}

/* Blockquotes */
blockquote {
  border-left: 4px solid var(--accent-green);
  padding-left: var(--space-4);
  margin: var(--space-6) 0;
  font-style: italic;
  color: var(--text-secondary);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-6);
}

th, td {
  border: 1px solid var(--border-primary);
  padding: var(--space-3);
  text-align: left;
}

th {
  background-color: var(--bg-secondary);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin-bottom: var(--space-4);
}

/* Selection */
::selection {
  background-color: var(--accent-green);
  color: var(--text-inverse);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 0.75rem;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--border-primary);
  border-radius: 0.375rem;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
```

## Container System (layout.css)

```css
/* Container utility classes */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}

/* Responsive container */
@media (min-width: 640px) {
  .container {
    max-width: var(--container-sm);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-md);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--container-lg);
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: var(--container-xl);
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: var(--container-2xl);
  }
}

/* Section spacing */
.section {
  padding: var(--section-gap) 0;
}

/* Grid system */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }

@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
```

## Implementation Steps

1. **Create the styles directory structure**
2. **Set up variables.css** with all design tokens
3. **Create global.css** with base styles and reset
4. **Set up layout.css** with container and grid systems
5. **Update existing Astro components** to use the new styles
6. **Import the new CSS files** in the main layout

## Files to Modify/Created

- **New files**:
  - `src/styles/variables.css`
  - `src/styles/global.css`
  - `src/styles/layout.css`
  - `src/styles/typography.css`
  - `src/styles/components.css`
  - `src/styles/responsive.css`
  - `src/styles/animations.css`

- **Files to update**:
  - `src/layouts/Layout.astro` - Import new styles
  - `src/components/Navigation.astro` - Apply new styling
  - Existing page files - Use new component classes

This foundation provides a solid base for building the developer-focused terminal aesthetic while maintaining excellent responsive design and accessibility.