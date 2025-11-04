# Phase 2: Typography System

## Overview
This phase establishes a comprehensive typography system optimized for technical content with developer-friendly fonts, fluid typography scaling, and terminal-inspired design elements.

## Font Loading Strategy

### Font Import (variables.css)
```css
/* Google Fonts Import - Optimize for performance */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');

/* Fallback font stacks */
:root {
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', 'Consolas', 'Monaco', monospace;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-serif: 'Crimson Text', Georgia, 'Times New Roman', serif;
  --font-terminal: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
}
```

### Font Face Declarations (for self-hosting)
```css
/* If self-hosting fonts in public/fonts/ directory */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-semibold.woff2') format('woff2');
}
```

## Fluid Typography System

### Enhanced Variables (variables.css)
```css
:root {
  /* Advanced Fluid Typography */
  --fluid-min-width: 320;
  --fluid-max-width: 1140;
  --fluid-screen: 100vw;
  --fluid-bp: calc(
    (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
    (var(--fluid-max-width) - var(--fluid-min-width))
  );

  /* Responsive Font Sizes */
  --fluid-text-xs: calc(0.75rem + 0.125 * var(--fluid-bp));
  --fluid-text-sm: calc(0.875rem + 0.125 * var(--fluid-bp));
  --fluid-text-base: calc(1rem + 0.125 * var(--fluid-bp));
  --fluid-text-lg: calc(1.125rem + 0.125 * var(--fluid-bp));
  --fluid-text-xl: calc(1.25rem + 0.25 * var(--fluid-bp));
  --fluid-text-2xl: calc(1.5rem + 0.5 * var(--fluid-bp));
  --fluid-text-3xl: calc(2rem + 1 * var(--fluid-bp));
  --fluid-text-4xl: calc(2.5rem + 1.5 * var(--fluid-bp));

  /* Component-specific typography */
  --code-inline-size: 0.875em;
  --code-block-size: 0.9375em;
  --terminal-text-size: 0.9375rem;
  --heading-line-height: 1.2;
  --body-line-height: 1.625;
  --code-line-height: 1.5;
}
```

## Typography Styles (typography.css)

### Base Typography Classes
```css
/* Body text optimizations */
body {
  font-family: var(--font-sans);
  font-size: var(--fluid-text-base);
  font-weight: var(--font-normal);
  line-height: var(--body-line-height);
  letter-spacing: -0.01em; /* Slightly tighter letter spacing for better readability */
  color: var(--text-primary);
  text-rendering: optimizeLegibility;
  -webkit-font-feature-settings: 'kern' 1, 'liga' 1;
  font-feature-settings: 'kern' 1, 'liga' 1;
}

/* Text utility classes */
.text-xs { font-size: var(--fluid-text-xs); }
.text-sm { font-size: var(--fluid-text-sm); }
.text-base { font-size: var(--fluid-text-base); }
.text-lg { font-size: var(--fluid-text-lg); }
.text-xl { font-size: var(--fluid-text-xl); }
.text-2xl { font-size: var(--fluid-text-2xl); }
.text-3xl { font-size: var(--fluid-text-3xl); }
.text-4xl { font-size: var(--fluid-text-4xl); }

/* Font weight utilities */
.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

/* Font family utilities */
.font-mono { font-family: var(--font-mono); }
.font-sans { font-family: var(--font-sans); }
.font-serif { font-family: var(--font-serif); }
.font-terminal { font-family: var(--font-terminal); }
```

### Heading System
```css
/* Terminal-inspired headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  line-height: var(--heading-line-height);
  letter-spacing: -0.025em;
  color: var(--text-primary);
  position: relative;
}

h1 {
  font-size: var(--fluid-text-4xl);
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--border-primary);
  padding-bottom: var(--space-4);
}

h1::before {
  content: '$';
  color: var(--accent-green);
  margin-right: var(--space-2);
  font-weight: var(--font-normal);
}

h2 {
  font-size: var(--fluid-text-3xl);
  margin-top: var(--space-12);
  margin-bottom: var(--space-4);
  color: var(--accent-cyan);
}

h2::before {
  content: '>';
  color: var(--accent-green);
  margin-right: var(--space-2);
  font-weight: var(--font-normal);
}

h3 {
  font-size: var(--fluid-text-2xl);
  margin-top: var(--space-10);
  margin-bottom: var(--space-3);
  color: var(--accent-blue);
}

h3::before {
  content: '>>';
  color: var(--accent-green);
  margin-right: var(--space-2);
  font-weight: var(--font-normal);
  opacity: 0.8;
}

h4 {
  font-size: var(--fluid-text-xl);
  margin-top: var(--space-8);
  margin-bottom: var(--space-3);
  color: var(--text-secondary);
}

h4::before {
  content: '#';
  color: var(--accent-yellow);
  margin-right: var(--space-2);
  font-weight: var(--font-normal);
}

/* Responsive heading adjustments */
@media (max-width: 768px) {
  h1 { font-size: var(--fluid-text-3xl); }
  h2 { font-size: var(--fluid-text-2xl); }
  h3 { font-size: var(--fluid-text-xl); }
}
```

### Content Typography
```css
/* Paragraphs */
p {
  margin-bottom: var(--space-4);
  max-width: 65ch; /* Optimal reading width */
  line-height: var(--body-line-height);
  color: var(--text-primary);
}

/* Lead paragraphs */
.lead {
  font-size: var(--fluid-text-lg);
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
  font-style: italic;
}

/* Lists */
ul, ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
}

li {
  margin-bottom: var(--space-2);
  line-height: var(--body-line-height);
}

/* Terminal-style lists */
.terminal-list {
  list-style: none;
  padding-left: 0;
}

.terminal-list li {
  position: relative;
  padding-left: var(--space-8);
}

.terminal-list li::before {
  content: '❯';
  position: absolute;
  left: 0;
  color: var(--accent-green);
  font-family: var(--font-mono);
}

/* Links */
a {
  color: var(--accent-blue);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

a:hover {
  color: var(--accent-cyan);
  border-bottom-color: var(--accent-cyan);
  text-decoration: none;
}

a:focus {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
  border-radius: 2px;
}

/* External links */
a.external::after {
  content: '↗';
  font-size: 0.8em;
  margin-left: 0.2em;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

a.external:hover::after {
  opacity: 1;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid var(--accent-green);
  padding: var(--space-4) var(--space-6);
  margin: var(--space-6) 0;
  background: linear-gradient(90deg, var(--bg-secondary) 0%, transparent 100%);
  border-radius: 0 var(--space-2) var(--space-2) 0;
  font-style: italic;
  color: var(--text-secondary);
  position: relative;
}

blockquote::before {
  content: '"';
  font-family: var(--font-serif);
  font-size: 3rem;
  color: var(--accent-green);
  position: absolute;
  top: -0.5rem;
  left: var(--space-2);
  opacity: 0.3;
}

blockquote p {
  margin-bottom: 0;
  font-size: var(--fluid-text-lg);
}

/* Code Typography */
code {
  font-family: var(--font-mono);
  background-color: var(--bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: var(--code-inline-size);
  color: var(--accent-cyan);
  border: 1px solid var(--border-primary);
  display: inline-block;
  line-height: var(--code-line-height);
}

pre {
  background-color: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: 0.5rem;
  padding: var(--space-4);
  overflow-x: auto;
  margin: var(--space-6) 0;
  position: relative;
}

pre code {
  background: none;
  padding: 0;
  border: none;
  color: var(--text-primary);
  display: block;
  font-size: var(--code-block-size);
  line-height: var(--code-line-height);
  white-space: pre;
  word-wrap: normal;
}

/* Terminal-style code blocks */
.terminal-block {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;
}

.terminal-header {
  background: var(--bg-tertiary);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.terminal-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.terminal-dot.red { background-color: #ff5f56; }
.terminal-dot.yellow { background-color: #ffbd2e; }
.terminal-dot.green { background-color: #27c93f; }

.terminal-content {
  padding: var(--space-4);
  font-family: var(--font-terminal);
  font-size: var(--terminal-text-size);
  line-height: var(--code-line-height);
}

.terminal-content::before {
  content: '$ ';
  color: var(--accent-green);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-6) 0;
  font-size: var(--fluid-text-sm);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-primary);
}

th, td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--border-primary);
}

th {
  background-color: var(--bg-secondary);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: var(--accent-cyan);
  text-transform: uppercase;
  font-size: 0.875em;
  letter-spacing: 0.05em;
}

tr:hover {
  background-color: var(--bg-secondary);
}

tr:last-child td {
  border-bottom: none;
}
```

## Responsive Typography

### Breakpoint-specific Adjustments
```css
/* Mobile typography adjustments */
@media (max-width: 640px) {
  html {
    font-size: 14px;
  }

  h1 { font-size: var(--fluid-text-2xl); }
  h2 { font-size: var(--fluid-text-xl); }
  h3 { font-size: var(--fluid-text-lg); }

  .lead {
    font-size: var(--fluid-text-base);
  }

  p {
    max-width: 100%;
  }
}

/* Tablet adjustments */
@media (min-width: 641px) and (max-width: 1024px) {
  html {
    font-size: 15px;
  }
}

/* Desktop optimizations */
@media (min-width: 1025px) {
  html {
    font-size: 16px;
  }
}
```

## Typography Components

### Specialized Text Components
```css
/* Terminal prompt styles */
.prompt {
  font-family: var(--font-terminal);
  color: var(--accent-green);
  margin-right: var(--space-2);
}

.command {
  font-family: var(--font-terminal);
  color: var(--text-primary);
}

/* Status indicators */
.status {
  font-family: var(--font-mono);
  font-size: var(--fluid-text-xs);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status.success {
  background-color: rgba(63, 185, 80, 0.1);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
}

.status.warning {
  background-color: rgba(210, 153, 34, 0.1);
  color: var(--accent-yellow);
  border: 1px solid var(--accent-yellow);
}

.status.error {
  background-color: rgba(248, 81, 73, 0.1);
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
}

/* Code line numbers */
.line-numbers {
  counter-reset: line;
  padding-left: var(--space-8);
  position: relative;
}

.line-numbers code {
  counter-increment: line;
}

.line-numbers code::before {
  content: counter(line);
  position: absolute;
  left: 0;
  width: var(--space-6);
  text-align: right;
  color: var(--text-muted);
  font-size: 0.875em;
  user-select: none;
}

/* Syntax highlighting classes */
.token.comment { color: var(--code-comment); }
.token.keyword { color: var(--code-keyword); }
.token.string { color: var(--code-string); }
.token.number { color: var(--code-number); }
.token.function { color: var(--code-function); }
.token.operator { color: var(--accent-yellow); }
.token.punctuation { color: var(--text-secondary); }
```

## Implementation Steps

1. **Add font imports** to variables.css
2. **Create typography.css** with all typography styles
3. **Update existing components** to use new typography classes
4. **Test responsive behavior** across different screen sizes
5. **Optimize font loading** with proper font-display settings
6. **Add fallback fonts** for performance and reliability

## Files to Modify/Created

- **New files**:
  - `src/styles/typography.css` (complete typography system)

- **Files to update**:
  - `src/styles/variables.css` (add font variables)
  - `src/styles/global.css` (import typography.css)
  - All page components (use new typography classes)

This typography system creates a cohesive developer-focused reading experience with terminal aesthetics while maintaining excellent readability and responsive behavior across all devices.