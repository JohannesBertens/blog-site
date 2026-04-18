import type { BlogPostModule } from './types';
import { calculateReadingTime } from './utils';

// Lazy-loaded post modules using import.meta.glob
const postModules = import.meta.glob<BlogPostModule>('../pages/posts/*.md', { eager: true });

/**
 * Retrieve all blog posts, sorted newest-first.
 */
export function getAllPosts(): BlogPostModule[] {
  return Object.values(postModules).sort(
    (a, b) => new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
  );
}

/**
 * Return unique tags across all posts, preserving first-seen order.
 */
export function getAllTags(): string[] {
  return [...new Set(getAllPosts().flatMap((post) => post.frontmatter.tags || []))];
}

/**
 * Build a tag → count map from all posts.
 */
export function getTagCounts(): Map<string, number> {
  const tagCountMap = new Map<string, number>();
  for (const post of getAllPosts()) {
    const tags = post.frontmatter.tags;
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === 'string') {
          const normalized = tag.toLowerCase();
          tagCountMap.set(normalized, (tagCountMap.get(normalized) ?? 0) + 1);
        }
      }
    }
  }
  return tagCountMap;
}

/**
 * Filter posts by a tag name (case-insensitive).
 * Returns the original (unsorted) posts and the resolved canonical tag for display.
 */
export function getFilteredPosts(
  tag: string | null,
  sortNewestFirst = true
): { posts: BlogPostModule[]; canonicalTag: string } {
  let posts = getAllPosts();

  let canonicalTag = 'all';

  if (tag) {
    const trimmed = tag.trim().toLowerCase();
    const allTags = getAllTags();
    const resolved = allTags.find((t) => t.toLowerCase() === trimmed);
    if (resolved) {
      canonicalTag = resolved;
      posts = posts.filter((post) => {
        const postTags = post.frontmatter.tags;
        if (!Array.isArray(postTags)) return false;
        return postTags.some(
          (t) => typeof t === 'string' && t.toLowerCase() === trimmed
        );
      });
    }
  }

  if (sortNewestFirst) {
    posts = posts.sort(
      (a, b) => new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
    );
  }

  return { posts, canonicalTag };
}

/**
 * Calculate reading time for a single post module.
 */
export function getReadingTime(post: BlogPostModule): string {
  const contentStr = post.rawContent ? post.rawContent() : '';
  return calculateReadingTime(contentStr);
}

/**
 * Determine whether a raw tag param is a valid tag name.
 */
export function isValidTag(rawTag: string | null, tagCounts: Map<string, number>): boolean {
  if (!rawTag) return false;
  const trimmed = rawTag.trim().toLowerCase();
  if (!trimmed) return false;
  return tagCounts.has(trimmed);
}
