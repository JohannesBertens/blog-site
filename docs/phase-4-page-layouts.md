# Phase 4: Page Layout Enhancement

## Overview
This phase focuses on creating responsive page layouts with terminal-inspired design, including grid layouts for blog indexes, enhanced blog post layouts with table of contents, and mobile-optimized designs that maintain the terminal aesthetic.

## Blog Index Page Layout

### Enhanced blog.astro
```astro
---
// src/pages/blog.astro
import Layout from '../layouts/Layout.astro';
import BlogCard from '../components/BlogCard.astro';
import Navigation from '../components/Navigation.astro';

// Get all blog posts
const allPosts = await Astro.glob('../pages/posts/*.md');

// Sort posts by date (newest first)
const sortedPosts = allPosts.sort((a, b) =>
  new Date(b.frontmatter.pubDate).valueOf() -
  new Date(a.frontmatter.pubDate).valueOf()
);

// Extract unique tags
const allTags = [...new Set(
  allPosts.flatMap(post => post.frontmatter.tags || [])
)];

// Calculate reading time helper
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Filter posts by tag
let filteredPosts = sortedPosts;
let currentTag = 'all';

if (Astro.url.searchParams.has('tag')) {
  currentTag = Astro.url.searchParams.get('tag')!;
  filteredPosts = sortedPosts.filter(post =>
    post.frontmatter.tags?.includes(currentTag)
  );
}
---

<Layout title="Blog - Johannes Developer" currentPage="blog">
  <Navigation currentPage="blog" />

  <main class="blog-main">
    <section class="blog-hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-terminal">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="terminal-title">blog</div>
            </div>
            <div class="terminal-content">
              <div class="terminal-line">
                <span class="prompt">$</span>
                <span class="command">ls -la posts/</span>
              </div>
              <div class="terminal-output">
                <div class="output-line">total {filteredPosts.length}</div>
                <div class="output-line">drwxr-xr-x 2 johannes dev 4096 {new Date().toLocaleDateString()}</div>
                <div class="output-line">-rw-r--r-- 1 johannes dev 2048 Dec 15 latest.md</div>
                <div class="output-line">-rw-r--r-- 1 johannes dev 1536 Dec 10 featured.md</div>
                <div class="output-line">...</div>
              </div>
            </div>
          </div>
        </div>

        <div class="blog-stats">
          <div class="stat-item">
            <span class="stat-number">{filteredPosts.length}</span>
            <span class="stat-label">Posts</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{allTags.length}</span>
            <span class="stat-label">Tags</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">
              {Math.floor(allPosts.reduce((acc, post) => acc + post.compiledContent.length, 0) / 1000)}K
            </span>
            <span class="stat-label">Words</span>
          </div>
        </div>
      </div>
    </section>

    <section class="blog-content">
      <div class="container">
        <div class="blog-layout">
          <!-- Tags Filter -->
          <aside class="blog-sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-title">
                <span class="title-prefix">$</span>
                <span class="title-text">filter by tag</span>
              </h3>
              <div class="tags-filter">
                <a
                  href="/blog"
                  class={`tag-filter ${currentTag === 'all' ? 'active' : ''}`}
                >
                  <span class="tag-prefix">all</span>
                  <span class="tag-count">({sortedPosts.length})</span>
                </a>
                {allTags.map(tag => {
                  const count = sortedPosts.filter(post =>
                    post.frontmatter.tags?.includes(tag)
                  ).length;
                  return (
                    <a
                      href={`/blog?tag=${tag}`}
                      class={`tag-filter ${currentTag === tag ? 'active' : ''}`}
                    >
                      <span class="tag-prefix">#{tag}</span>
                      <span class="tag-count">({count})</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div class="sidebar-section">
              <h3 class="sidebar-title">
                <span class="title-prefix">$</span>
                <span class="title-text">recent activity</span>
              </h3>
              <div class="recent-activity">
                <div class="activity-item">
                  <span class="activity-icon">📝</span>
                  <span class="activity-text">Latest post published</span>
                  <span class="activity-time">2 hours ago</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">🔧</span>
                  <span class="activity-text">Code examples updated</span>
                  <span class="activity-time">1 day ago</span>
                </div>
                <div class="activity-item">
                  <span class="activity-icon">📊</span>
                  <span class="activity-text">Analytics dashboard launched</span>
                  <span class="activity-time">3 days ago</span>
                </div>
              </div>
            </div>
          </aside>

          <!-- Posts Grid -->
          <div class="blog-posts">
            <div class="posts-header">
              <h2 class="posts-title">
                {currentTag === 'all' ? 'All Posts' : `Posts tagged: ${currentTag}`}
              </h2>
              <div class="posts-count">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </div>
            </div>

            <div class="posts-grid">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  title={post.frontmatter.title}
                  description={post.frontmatter.description}
                  pubDate={new Date(post.frontmatter.pubDate)}
                  url={post.url}
                  tags={post.frontmatter.tags}
                  readingTime={calculateReadingTime(post.compiledContent)}
                />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>No posts found</h3>
                <p>No posts match the current filter. Try selecting a different tag.</p>
                <a href="/blog" class="reset-filter">Clear filter</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  </main>
</Layout>

<style>
  .blog-main {
    min-height: 100vh;
    background: var(--bg-primary);
  }

  .blog-hero {
    padding: var(--section-gap) 0;
    background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
    border-bottom: 1px solid var(--border-primary);
  }

  .hero-content {
    text-align: center;
    margin-bottom: var(--space-8);
  }

  .hero-terminal {
    max-width: 600px;
    margin: 0 auto;
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--border-primary);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .terminal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-4);
    background: var(--bg-tertiary);
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

  .terminal-content {
    background: var(--code-bg);
    padding: var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
  }

  .terminal-line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .prompt {
    color: var(--accent-green);
  }

  .command {
    color: var(--text-primary);
  }

  .terminal-output {
    margin-top: var(--space-2);
    padding-left: var(--space-4);
    color: var(--text-secondary);
  }

  .output-line {
    margin-bottom: var(--space-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .blog-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-8);
    margin-top: var(--space-6);
  }

  .stat-item {
    text-align: center;
    padding: var(--space-4);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    min-width: 120px;
  }

  .stat-number {
    display: block;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-2xl);
    font-weight: var(--font-bold);
    color: var(--accent-cyan);
    margin-bottom: var(--space-1);
  }

  .stat-label {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-content {
    padding: var(--section-gap) 0;
  }

  .blog-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--space-8);
    align-items: start;
  }

  .blog-sidebar {
    position: sticky;
    top: calc(var(--space-16) + 4rem);
  }

  .sidebar-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .sidebar-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-lg);
    color: var(--text-primary);
    margin: 0 0 var(--space-4) 0;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .title-prefix {
    color: var(--accent-green);
    font-weight: var(--font-normal);
  }

  .tags-filter {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .tag-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    transition: all 0.2s ease;
  }

  .tag-filter:hover {
    background: var(--bg-primary);
    border-color: var(--accent-green);
    color: var(--accent-green);
    transform: translateX(2px);
  }

  .tag-filter.active {
    background: var(--bg-primary);
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
  }

  .tag-prefix {
    font-weight: var(--font-medium);
  }

  .tag-count {
    color: var(--text-muted);
    font-size: var(--fluid-text-xs);
  }

  .recent-activity {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    border: 1px solid var(--border-primary);
  }

  .activity-icon {
    font-size: 1.1em;
  }

  .activity-text {
    flex: 1;
    font-size: var(--fluid-text-sm);
    color: var(--text-secondary);
  }

  .activity-time {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--text-muted);
  }

  .blog-posts {
    flex: 1;
  }

  .posts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-primary);
  }

  .posts-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-2xl);
    color: var(--text-primary);
    margin: 0;
  }

  .posts-count {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: var(--space-2) var(--space-3);
    border-radius: 9999px;
    border: 1px solid var(--border-primary);
  }

  .posts-grid {
    display: grid;
    gap: var(--space-6);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-12) var(--space-6);
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: var(--space-4);
  }

  .empty-state h3 {
    font-family: var(--font-mono);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .empty-state p {
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
  }

  .reset-filter {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--accent-green);
    color: var(--text-inverse);
    text-decoration: none;
    border-radius: 0.5rem;
    font-family: var(--font-mono);
    font-weight: var(--font-medium);
    transition: all 0.2s ease;
  }

  .reset-filter:hover {
    background: var(--accent-cyan);
    transform: translateY(-1px);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .blog-layout {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    .blog-sidebar {
      position: static;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .sidebar-section {
      margin-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    .blog-stats {
      flex-direction: column;
      gap: var(--space-4);
    }

    .stat-item {
      min-width: auto;
    }

    .posts-header {
      flex-direction: column;
      gap: var(--space-3);
      align-items: flex-start;
    }

    .hero-terminal {
      max-width: 100%;
    }
  }
</style>
```

## Blog Post Layout with Table of Contents

### Enhanced BlogPostLayout.astro
```astro
---
// src/layouts/BlogPostLayout.astro
import Layout from './Layout.astro';
import Navigation from '../components/Navigation.astro';
import CodeBlock from '../components/CodeBlock.astro';
import Metadata from '../components/Metadata.astro';

interface Props {
  title: string;
  description?: string;
  pubDate: Date;
  updatedDate?: Date;
  author?: string;
  tags?: string[];
  readingTime?: string;
  wordCount?: number;
}

const {
  title,
  description,
  pubDate,
  updatedDate,
  author,
  tags,
  readingTime,
  wordCount
} = Astro.props;

const { content } = Astro.props;
---

<Layout title={title} description={description}>
  <Navigation currentPage="blog" />

  <article class="blog-post">
    <header class="post-header">
      <Metadata
        title={title}
        description={description}
        publishDate={pubDate}
        updatedDate={updatedDate}
        author={author}
        tags={tags}
        readingTime={readingTime}
        wordCount={wordCount}
      />
    </header>

    <div class="post-layout">
      <!-- Table of Contents -->
      <aside class="post-sidebar">
        <div class="toc-container">
          <h3 class="toc-title">
            <span class="toc-icon">📋</span>
            <span class="toc-text">Table of Contents</span>
          </h3>
          <nav class="toc-nav" id="table-of-contents">
            <!-- TOC will be generated by JavaScript -->
          </nav>
        </div>

        <div class="post-progress">
          <h4 class="progress-title">Reading Progress</h4>
          <div class="progress-bar">
            <div class="progress-fill" id="reading-progress"></div>
          </div>
          <div class="progress-text" id="progress-text">0%</div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="post-content">
        <div class="content-wrapper">
          <slot />
        </div>

        <!-- Post Actions -->
        <div class="post-actions">
          <div class="action-group">
            <h4>Share this post</h4>
            <div class="share-buttons">
              <button class="share-btn" data-platform="twitter">
                <span class="share-icon">🐦</span>
                <span class="share-text">Twitter</span>
              </button>
              <button class="share-btn" data-platform="linkedin">
                <span class="share-icon">💼</span>
                <span class="share-text">LinkedIn</span>
              </button>
              <button class="share-btn" data-platform="reddit">
                <span class="share-icon">🤖</span>
                <span class="share-text">Reddit</span>
              </button>
            </div>
          </div>

          <div class="action-group">
            <h4>Like this post?</h4>
            <button class="like-btn" id="like-button">
              <span class="like-icon">❤️</span>
              <span class="like-text">Like</span>
              <span class="like-count" id="like-count">42</span>
            </button>
          </div>
        </div>
      </main>
    </div>

    <!-- Related Posts -->
    <section class="related-posts">
      <div class="container">
        <h3 class="related-title">
          <span class="title-prefix">$</span>
          <span class="title-text">find similar posts</span>
        </h3>
        <div class="related-grid">
          <!-- Related posts will be populated by JavaScript -->
        </div>
      </div>
    </section>
  </article>
</Layout>

<style>
  .blog-post {
    min-height: 100vh;
    background: var(--bg-primary);
  }

  .post-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--space-8);
    max-width: var(--container-xl);
    margin: 0 auto;
    padding: 0 var(--container-padding);
  }

  .post-sidebar {
    position: sticky;
    top: calc(var(--space-16) + 4rem);
    height: fit-content;
  }

  .toc-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .toc-title {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-lg);
    color: var(--text-primary);
    margin: 0 0 var(--space-4) 0;
  }

  .toc-icon {
    font-size: 1.1em;
  }

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .toc-nav a {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    color: var(--text-secondary);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    border-left: 2px solid transparent;
  }

  .toc-nav a:hover {
    background: var(--bg-tertiary);
    color: var(--accent-cyan);
    border-left-color: var(--accent-cyan);
  }

  .toc-nav a.active {
    background: var(--bg-tertiary);
    color: var(--accent-green);
    border-left-color: var(--accent-green);
    font-weight: var(--font-medium);
  }

  .toc-nav a::before {
    content: '>';
    color: var(--accent-green);
    font-weight: var(--font-normal);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .toc-nav a:hover::before,
  .toc-nav a.active::before {
    opacity: 1;
  }

  .post-progress {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-6);
  }

  .progress-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    color: var(--text-secondary);
    margin: 0 0 var(--space-3) 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .progress-bar {
    height: 4px;
    background: var(--bg-tertiary);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: var(--space-2);
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-green) 0%, var(--accent-cyan) 100%);
    width: 0%;
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .progress-text {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-xs);
    color: var(--accent-cyan);
    text-align: center;
  }

  .post-content {
    background: var(--bg-secondary);
    border: 1px solid var(--border-primary);
    border-radius: 0.75rem;
    padding: var(--space-8);
  }

  .content-wrapper {
    max-width: 65ch; /* Optimal reading width */
    margin: 0 auto;
  }

  /* Enhanced content typography */
  .content-wrapper h1,
  .content-wrapper h2,
  .content-wrapper h3,
  .content-wrapper h4,
  .content-wrapper h5,
  .content-wrapper h6 {
    scroll-margin-top: 2rem; /* Offset for sticky TOC */
  }

  .content-wrapper p {
    margin-bottom: var(--space-4);
    line-height: var(--leading-relaxed);
    color: var(--text-primary);
  }

  .content-wrapper pre {
    margin: var(--space-6) 0;
  }

  .post-actions {
    margin-top: var(--space-12);
    padding-top: var(--space-8);
    border-top: 1px solid var(--border-primary);
    display: grid;
    gap: var(--space-6);
  }

  .action-group {
    text-align: center;
  }

  .action-group h4 {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-lg);
    color: var(--text-primary);
    margin: 0 0 var(--space-4) 0;
  }

  .share-buttons {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .share-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .share-btn:hover {
    background: var(--bg-primary);
    border-color: var(--accent-cyan);
    color: var(--accent-cyan);
    transform: translateY(-1px);
  }

  .share-icon {
    font-size: 1.1em;
  }

  .like-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    background: var(--bg-tertiary);
    border: 1px solid var(--border-primary);
    border-radius: 9999px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: var(--fluid-text-sm);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .like-btn:hover {
    background: rgba(248, 113, 113, 0.1);
    border-color: #f87171;
    color: #f87171;
    transform: scale(1.05);
  }

  .like-btn.liked {
    background: rgba(248, 113, 113, 0.2);
    border-color: #f87171;
    color: #f87171;
  }

  .like-icon {
    font-size: 1.2em;
    transition: transform 0.2s ease;
  }

  .like-btn:hover .like-icon {
    transform: scale(1.2);
  }

  .like-count {
    font-weight: var(--font-semibold);
  }

  .related-posts {
    margin-top: var(--section-gap);
    padding: var(--space-12) 0;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-primary);
  }

  .related-title {
    font-family: var(--font-mono);
    font-size: var(--fluid-text-2xl);
    color: var(--text-primary);
    margin: 0 0 var(--space-6) 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  .title-prefix {
    color: var(--accent-green);
    font-weight: var(--font-normal);
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-6);
  }

  /* Responsive design */
  @media (max-width: 1024px) {
    .post-layout {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }

    .post-sidebar {
      position: static;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
    }

    .toc-container {
      margin-bottom: 0;
    }

    .content-wrapper {
      max-width: 100%;
    }
  }

  @media (max-width: 768px) {
    .post-content {
      padding: var(--space-6);
    }

    .share-buttons {
      flex-direction: column;
      align-items: center;
    }

    .share-btn {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }

    .related-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  // Table of Contents Generation
  function generateTableOfContents() {
    const headings = document.querySelectorAll('.content-wrapper h2, .content-wrapper h3, .content-wrapper h4');
    const tocNav = document.getElementById('table-of-contents');

    if (headings.length === 0) {
      tocNav.innerHTML = '<p class="no-toc">No headings found</p>';
      return;
    }

    let tocHTML = '';
    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;

      const level = parseInt(heading.tagName.charAt(1));
      const indent = (level - 2) * 1; // Indent based on heading level

      tocHTML += `
        <a href="#${id}" class="toc-link toc-level-${level}" data-level="${level}">
          ${'  '.repeat(indent)}${heading.textContent}
        </a>
      `;
    });

    tocNav.innerHTML = tocHTML;

    // Add click handlers for TOC links
    tocNav.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links
        tocNav.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        link.classList.add('active');

        // Scroll to heading
        const targetId = link.getAttribute('href').substring(1);
        const targetHeading = document.getElementById(targetId);
        if (targetHeading) {
          targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Update active TOC link on scroll
    updateActiveTocLink();
  }

  function updateActiveTocLink() {
    const headings = document.querySelectorAll('.content-wrapper h2, .content-wrapper h3, .content-wrapper h4');
    const tocLinks = document.querySelectorAll('.toc-link');

    let currentHeading = null;
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 100) {
        currentHeading = heading;
      }
    });

    if (currentHeading) {
      const currentId = currentHeading.id;
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // Reading Progress
  function updateReadingProgress() {
    const article = document.querySelector('.content-wrapper');
    const progressBar = document.getElementById('reading-progress');
    const progressText = document.getElementById('progress-text');

    if (!article || !progressBar) return;

    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const progress = Math.min(100, Math.max(0,
      ((scrollTop - articleTop + windowHeight) / (articleHeight + windowHeight)) * 100
    ));

    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
  }

  // Like button functionality
  function setupLikeButton() {
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');

    if (!likeButton) return;

    let liked = localStorage.getItem(`liked-${window.location.pathname}`) === 'true';
    let likes = parseInt(likeCount.textContent);

    if (liked) {
      likeButton.classList.add('liked');
    }

    likeButton.addEventListener('click', () => {
      if (liked) {
        liked = false;
        likes--;
        likeButton.classList.remove('liked');
        localStorage.removeItem(`liked-${window.location.pathname}`);
      } else {
        liked = true;
        likes++;
        likeButton.classList.add('liked');
        localStorage.setItem(`liked-${window.location.pathname}`, 'true');
      }

      likeCount.textContent = likes;
    });
  }

  // Share functionality
  function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
      button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        let shareUrl = '';

        switch(platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
          case 'reddit':
            shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
            break;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // Initialize everything when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    generateTableOfContents();
    updateReadingProgress();
    setupLikeButton();
    setupShareButtons();

    // Update progress on scroll
    window.addEventListener('scroll', () => {
      updateReadingProgress();
      updateActiveTocLink();
    });

    // Update progress on resize
    window.addEventListener('resize', updateReadingProgress);
  });
</script>
```

## Implementation Steps

1. **Enhance the blog index page** with terminal hero section and filtering
2. **Create sticky sidebar layouts** for tags and navigation
3. **Build responsive grid systems** for blog post cards
4. **Implement table of contents** with smooth scrolling
5. **Add reading progress indicators** for long posts
6. **Create mobile-optimized layouts** that maintain terminal aesthetic
7. **Test responsive behavior** across all device sizes

## Files to Modify/Created

- **New/Updated pages**:
  - `src/pages/blog.astro` (complete redesign with terminal hero)
  - `src/layouts/BlogPostLayout.astro` (enhanced with TOC and sidebar)

- **Files to update**:
  - `src/styles/layout.css` (add grid layouts and responsive styles)
  - `src/styles/responsive.css` (add breakpoint-specific adjustments)
  - All existing blog post pages (use new layout)

This phase creates professional, responsive layouts that showcase technical content effectively while maintaining the terminal aesthetic throughout the design.