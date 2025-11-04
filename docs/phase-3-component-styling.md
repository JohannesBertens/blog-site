# Phase 3: Core Component Styling

## Overview
This phase focuses on creating styled components with terminal-inspired design, including navigation, code blocks, blog post cards, and metadata displays that embody the developer aesthetic.

## Navigation Component Styling

### Enhanced Navigation.astro
```astro
---
// src/components/Navigation.astro
const { currentPage } = Astro.props;
---

<nav class="terminal-nav">
  <div class="container">
    <div class="nav-header">
      <div class="terminal-prompt">
        <span class="prompt">$</span>
        <span class="command">cd ~/blog</span>
      </div>
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span class="hamburger"></span>
      </button>
    </div>

    <ul class="nav-menu">
      <li class="nav-item">
        <a href="/" class={`nav-link ${currentPage === 'home' ? 'active' : ''}`}>
          <span class="nav-icon">🏠</span>
          <span class="nav-text">home</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/about" class={`nav-link ${currentPage === 'about' ? 'active' : ''}`}>
          <span class="nav-icon">👤</span>
          <span class="nav-text">about</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/blog" class={`nav-link ${currentPage === 'blog' ? 'active' : ''}`}>
          <span class="nav-icon">📝</span>
          <span class="nav-text">posts</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="/projects" class={`nav-link ${currentPage === 'projects' ? 'active' : ''}`}>
          <span class="nav-icon">💻</span>
          <span class="nav-text">projects</span>
        </a>
      </li>
    </ul>

    <div class="nav-status">
      <span class="status-indicator online"></span>
      <span class="status-text">online</span>
    </div>
  </div>
</nav>

<style>
  .terminal-nav {
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-primary);
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(10px);
    background: rgba(22, 27, 34, 0.95);
  }

  .nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) 0;
  }

  .terminal-prompt {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-lg);
    color: var(--accent-green);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .command {
    color: var(--text-primary);
  }

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-2);
  }

  .hamburger {
    display: block;
    width: 1.5rem;
    height: 2px;
    background: var(--text-primary);
    position: relative;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: var(--text-primary);
    transition: all 0.3s ease;
  }

  .hamburger::before {
    top: -0.5rem;
  }

  .hamburger::after {
    bottom: -0.5rem;
  }

  .nav-menu {
    display: flex;
    list-style: none;
    gap: var(--space-6);
    margin: 0;
    padding: 0;
    align-items: center;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    position: relative;
    overflow: hidden;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(63, 185, 80, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .nav-link:hover::before {
    left: 100%;
  }

  .nav-link:hover {
    color: var(--accent-green);
    background: rgba(63, 185, 80, 0.05);
    border-color: var(--accent-green);
    transform: translateY(-1px);
  }

  .nav-link.active {
    color: var(--text-primary);
    background: var(--bg-tertiary);
    border-color: var(--accent-cyan);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 2rem;
    height: 2px;
    background: var(--accent-cyan);
    border-radius: 1px;
  }

  .nav-icon {
    font-size: 1.1em;
  }

  .nav-status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
  }

  .status-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--accent-green);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .nav-toggle {
      display: block;
    }

    .nav-menu {
      position: fixed;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      flex-direction: column;
      gap: 0;
      padding: var(--space-4);
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      border-bottom: 2px solid var(--border-primary);
    }

    .nav-menu.active {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .nav-item {
      width: 100%;
    }

    .nav-link {
      width: 100%;
      justify-content: flex-start;
      padding: var(--space-4);
    }

    .nav-status {
      display: none;
    }
  }
</style>
```

## Code Block Component

### CodeBlock.astro
```astro
---
// src/components/CodeBlock.astro
interface Props {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

const { code, language = 'bash', title, showLineNumbers = true, copyable = true } = Astro.props;
---

<div class={`code-block ${showLineNumbers ? 'line-numbers' : ''}`}>
  {title && (
    <div class="code-header">
      <div class="code-title">
        <span class="file-icon">📄</span>
        <span class="file-name">{title}</span>
      </div>
      <div class="code-actions">
        {copyable && (
          <button class="copy-btn" data-code={encodeURIComponent(code)}>
            <span class="copy-icon">📋</span>
            <span class="copy-text">Copy</span>
          </button>
        )}
      </div>
    </div>
  )}

  <div class="code-terminal">
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="terminal-title">{language}</div>
    </div>

    <pre class="code-content"><code class={`language-${language}`}>{code}</code></pre>
  </div>
</div>

<style>
  .code-block {
    margin: var(--space-6) 0;
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--border-primary);
    background: var(--bg-secondary);
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-primary);
  }

  .code-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--text-secondary);
  }

  .file-icon {
    font-size: 1.1em;
  }

  .file-name {
    color: var(--text-primary);
  }

  .code-actions {
    display: flex;
    gap: var(--space-2);
  }

  .copy-btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-btn:hover {
    background: var(--bg-tertiary);
    color: var(--accent-green);
    border-color: var(--accent-green);
  }

  .copy-btn.copied {
    color: var(--accent-green);
    background: rgba(63, 185, 80, 0.1);
  }

  .code-terminal {
    background: var(--code-bg);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-primary);
  }

  .terminal-dots {
    display: flex;
    gap: var(--space-1);
  }

  .dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
  }

  .dot.red { background-color: #ff5f56; }
  .dot.yellow { background-color: #ffbd2e; }
  .dot.green { background-color: #27c93f; }

  .terminal-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .code-content {
    margin: 0;
    padding: var(--space-4);
    background: var(--code-bg);
    overflow-x: auto;
  }

  .code-content code {
    font-family: var(--font-mono);
    font-size: var(--code-block-size);
    line-height: var(--code-line-height);
    color: var(--text-primary);
    background: none;
    padding: 0;
    border: none;
  }

  /* Line numbers */
  .line-numbers .code-content {
    padding-left: 0;
  }

  .line-numbers .code-content code {
    counter-reset: line;
  }

  .line-numbers .code-content code > * {
    counter-increment: line;
    position: relative;
    display: block;
    padding-left: var(--space-8);
  }

  .line-numbers .code-content code > *::before {
    content: counter(line);
    position: absolute;
    left: 0;
    width: var(--space-6);
    text-align: right;
    color: var(--text-muted);
    font-size: 0.875em;
    user-select: none;
    border-right: 1px solid var(--border-primary);
    margin-right: var(--space-2);
    padding-right: var(--space-1);
  }

  /* Syntax highlighting colors */
  .token.comment { color: var(--code-comment); font-style: italic; }
  .token.keyword { color: var(--code-keyword); font-weight: var(--font-semibold); }
  .token.string { color: var(--code-string); }
  .token.number { color: var(--code-number); }
  .token.function { color: var(--code-function); }
  .token.operator { color: var(--accent-yellow); }
  .token.punctuation { color: var(--text-secondary); }
  .token.variable { color: var(--accent-cyan); }
  .token.class-name { color: var(--accent-purple); }
  .token.tag { color: var(--accent-red); }
  .token.attr-name { color: var(--accent-yellow); }
  .token.attr-value { color: var(--code-string); }
</style>

<script>
  // Copy to clipboard functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const code = decodeURIComponent(btn.dataset.code);

      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        btn.querySelector('.copy-text').textContent = 'Copied!';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.querySelector('.copy-text').textContent = 'Copy';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    });
  });
</script>
```

## Blog Post Card Component

### BlogCard.astro
```astro
---
// src/components/BlogCard.astro
interface Props {
  title: string;
  description: string;
  pubDate: Date;
  url: string;
  tags?: string[];
  readingTime?: string;
}

const { title, description, pubDate, url, tags = [], readingTime } = Astro.props;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};
---

<article class="blog-card">
  <div class="card-header">
    <div class="card-meta">
      <time class="publish-date" datetime={pubDate.toISOString()}>
        <span class="date-icon">📅</span>
        <span class="date-text">{formatDate(pubDate)}</span>
        <span class="date-relative">({getRelativeTime(pubDate)})</span>
      </time>
      {readingTime && (
        <span class="reading-time">
          <span class="time-icon">⏱️</span>
          <span class="time-text">{readingTime}</span>
        </span>
      )}
    </div>
    <div class="card-status">
      <span class="status-indicator"></span>
    </div>
  </div>

  <div class="card-content">
    <h3 class="card-title">
      <a href={url} class="title-link">
        <span class="title-prefix">></span>
        <span class="title-text">{title}</span>
      </a>
    </h3>

    <p class="card-description">{description}</p>

    {tags.length > 0 && (
      <div class="card-tags">
        {tags.map(tag => (
          <span class="tag" key={tag}>
            <span class="tag-prefix">#</span>
            <span class="tag-text">{tag}</span>
          </span>
        ))}
      </div>
    )}
  </div>

  <div class="card-footer">
    <a href={url} class="read-more">
      <span class="read-text">Read Post</span>
      <span class="read-arrow">→</span>
    </a>
  </div>
</article>

<style>
  .blog-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-6);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .blog-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--accent-green) 0%, var(--accent-cyan) 100%);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .blog-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent-green);
    box-shadow: 0 4px 20px rgba(63, 185, 80, 0.1);
  }

  .blog-card:hover::before {
    transform: translateX(0);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-4);
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .publish-date {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-secondary);
    text-decoration: none;
  }

  .date-icon {
    font-size: 1em;
  }

  .date-text {
    color: var(--accent-cyan);
    font-weight: var(--font-medium);
  }

  .date-relative {
    color: var(--text-muted);
    font-style: italic;
  }

  .reading-time {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
  }

  .time-icon {
    font-size: 1em;
  }

  .card-status {
    display: flex;
    align-items: center;
  }

  .status-indicator {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--accent-green);
    box-shadow: 0 0 0.5rem var(--accent-green);
    animation: pulse 2s infinite;
  }

  .card-content {
    margin-bottom: var(--space-4);
  }

  .card-title {
    margin: 0 0 var(--space-3) 0;
    font-size: var(--fluid-text-xl);
    font-family: var(--font-mono);
    line-height: var(--leading-tight);
  }

  .title-link {
    color: var(--text-primary);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    transition: color 0.2s ease;
  }

  .title-link:hover {
    color: var(--accent-green);
  }

  .title-prefix {
    color: var(--accent-green);
    font-weight: var(--font-normal);
    transition: transform 0.2s ease;
  }

  .title-link:hover .title-prefix {
    transform: translateX(2px);
  }

  .card-description {
    color: var(--text-secondary);
    line-height: var(--leading-normal);
    margin: 0 0 var(--space-4) 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  .tag {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.25rem;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-secondary);
    transition: all 0.2s ease;
  }

  .tag:hover {
    background: var(--bg-primary);
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
  }

  .tag-prefix {
    color: var(--accent-cyan);
    font-weight: var(--font-semibold);
  }

  .card-footer {
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.25rem;
    color: var(--accent-cyan);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    font-weight: var(--font-medium);
    transition: all 0.2s ease;
  }

  .read-more:hover {
    background: var(--bg-primary);
    border-color: var(--accent-cyan);
    color: var(--text-primary);
    transform: translateX(2px);
  }

  .read-arrow {
    transition: transform 0.2s ease;
  }

  .read-more:hover .read-arrow {
    transform: translateX(2px);
  }

  /* Responsive design */
  @media (max-width: 640px) {
    .blog-card {
      padding: var(--space-4);
    }

    .card-header {
      flex-direction: column;
      gap: var(--space-2);
    }

    .card-title {
      font-size: var(--fluid-text-lg);
    }

    .card-tags {
      margin-bottom: var(--space-3);
    }
  }
</style>
```

## Metadata Display Component

### Metadata.astro
```astro
---
// src/components/Metadata.astro
interface Props {
  title: string;
  description?: string;
  publishDate: Date;
  updatedDate?: Date;
  author?: string;
  tags?: string[];
  readingTime?: string;
  wordCount?: number;
  views?: number;
}

const {
  title,
  description,
  publishDate,
  updatedDate,
  author = 'Johannes',
  tags = [],
  readingTime,
  wordCount,
  views
} = Astro.props;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

const formatViews = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};
---

<div class="metadata-container">
  <header class="metadata-header">
    <div class="metadata-title">
      <h1 class="title">
        <span class="prompt">$</span>
        <span class="command">cat {title}.md</span>
      </h1>
      {description && (
        <p class="description">{description}</p>
      )}
    </div>
  </header>

  <div class="metadata-content">
    <div class="metadata-primary">
      <div class="meta-item">
        <span class="meta-icon">📅</span>
        <div class="meta-content">
          <span class="meta-label">Published</span>
          <time class="meta-value" datetime={publishDate.toISOString()}>
            {formatDate(publishDate)}
          </time>
          {updatedDate && updatedDate > publishDate && (
            <span class="meta-updated">
              (Updated {formatDate(updatedDate)})
            </span>
          )}
        </div>
      </div>

      <div class="meta-item">
        <span class="meta-icon">👤</span>
        <div class="meta-content">
          <span class="meta-label">Author</span>
          <span class="meta-value">{author}</span>
        </div>
      </div>

      {readingTime && (
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <div class="meta-content">
            <span class="meta-label">Reading Time</span>
            <span class="meta-value">{readingTime}</span>
          </div>
        </div>
      )}
    </div>

    <div class="metadata-secondary">
      {wordCount && (
        <div class="meta-item">
          <span class="meta-icon">📝</span>
          <div class="meta-content">
            <span class="meta-label">Word Count</span>
            <span class="meta-value">{wordCount.toLocaleString()} words</span>
          </div>
        </div>
      )}

      {views && (
        <div class="meta-item">
          <span class="meta-icon">👁️</span>
          <div class="meta-content">
            <span class="meta-label">Views</span>
            <span class="meta-value">{formatViews(views)} views</span>
          </div>
        </div>
      )}

      <div class="meta-item">
        <span class="meta-icon">📂</span>
        <div class="meta-content">
          <span class="meta-label">Category</span>
          <span class="meta-value">Technology</span>
        </div>
      </div>
    </div>

    {tags.length > 0 && (
      <div class="metadata-tags">
        <div class="tags-header">
          <span class="tags-icon">🏷️</span>
          <span class="tags-label">Tags</span>
        </div>
        <div class="tags-list">
          {tags.map(tag => (
            <span class="tag" key={tag}>
              <span class="tag-prefix">#{tag}</span>
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

<style>
  .metadata-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-8);
    margin-bottom: var(--space-8);
    position: relative;
    overflow: hidden;
  }

  .metadata-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-green) 0%, var(--accent-cyan) 50%, var(--accent-blue) 100%);
  }

  .metadata-header {
    margin-bottom: var(--space-6);
  }

  .metadata-title {
    text-align: center;
  }

  .title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-3xl);
    color: var(--text-primary);
    margin: 0 0 var(--space-4) 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    line-height: var(--leading-tight);
  }

  .prompt {
    color: var(--accent-green);
    font-weight: var(--font-normal);
  }

  .command {
    color: var(--text-primary);
    font-weight: var(--font-semibold);
  }

  .description {
    color: var(--text-secondary);
    font-size: var(--fluid-text-lg);
    line-height: var(--leading-normal);
    margin: 0;
    max-width: 65ch;
    margin: 0 auto;
  }

  .metadata-content {
    display: grid;
    gap: var(--space-6);
  }

  .metadata-primary,
  .metadata-secondary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .meta-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
    transition: all 0.2s ease;
  }

  .meta-item:hover {
    background: var(--bg-primary);
    border-color: var(--accent-green);
    transform: translateY(-1px);
  }

  .meta-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  .meta-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .meta-label {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
  }

  .meta-value {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--accent-cyan);
    font-weight: var(--font-medium);
  }

  .meta-updated {
    font-size: var(--fluid-text-xs);
    color: var(--accent-yellow);
    font-style: italic;
    display: block;
    margin-top: var(--space-1);
  }

  .metadata-tags {
    margin-top: var(--space-6);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border-primary);
  }

  .tags-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .tags-icon {
    font-size: 1.25rem;
  }

  .tags-label {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--text-secondary);
    font-weight: var(--font-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%);
    border: 1px solid var(--border-primary);
    border-radius: 9999px;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    font-weight: var(--font-medium);
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .tag::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(63, 185, 80, 0.1), transparent);
    transition: left 0.5s ease;
  }

  .tag:hover::before {
    left: 100%;
  }

  .tag:hover {
    border-color: var(--accent-green);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(63, 185, 80, 0.2);
  }

  .tag-prefix {
    color: var(--accent-green);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .metadata-container {
      padding: var(--space-6);
    }

    .title {
      font-size: var(--fluid-text-2xl);
      flex-direction: column;
      gap: var(--space-2);
      text-align: center;
    }

    .metadata-primary,
    .metadata-secondary {
      grid-template-columns: 1fr;
    }

    .meta-item {
      padding: var(--space-3);
    }

    .tags-list {
      gap: var(--space-1);
    }

    .tag {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
  }
</style>
```

## Implementation Steps

1. **Create the Navigation component** with terminal styling
2. **Build the CodeBlock component** with syntax highlighting
3. **Develop the BlogCard component** with code-inspired metadata
4. **Create the Metadata component** for blog post headers
5. **Add component styles** to components.css
6. **Update existing pages** to use new components
7. **Test responsive behavior** across different screen sizes

## Files to Modify/Created

- **New components**:
  - `src/components/Navigation.astro` (enhanced with terminal styling)
  - `src/components/CodeBlock.astro` (syntax highlighting component)
  - `src/components/BlogCard.astro` (blog post card component)
  - `src/components/Metadata.astro` (post metadata component)

- **Files to update**:
  - `src/styles/components.css` (add component-specific styles)
  - `src/pages/blog.astro` (use BlogCard components)
  - `src/pages/posts/*.md` (use Metadata and CodeBlock components)
  - `src/layouts/Layout.astro` (import Navigation component)

This phase creates a cohesive set of components that embody the terminal aesthetic while providing excellent functionality and user experience for technical content.