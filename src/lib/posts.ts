import type { BlogPostModule } from './types';
import { calculateReadingTime } from './utils';

// Lazy-loaded post modules using import.meta.glob
const postModules = import.meta.glob<BlogPostModule>('../pages/posts/*.md', { eager: true });

/**
 * Retrieve all blog posts, sorted newest-first.
 */
export function getAllPosts(): BlogPostModule[] {
  try {
    return Object.values(postModules).sort(
      (a, b) => new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
    );
  } catch (error) {
    throw new Error(`Failed to load posts: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Return unique tags across all posts, preserving first-seen order.
 */
export function getAllTags(): string[] {
  try {
    return [...new Set(getAllPosts().flatMap((post) => post.frontmatter.tags || []))];
  } catch (error) {
    throw new Error(`Failed to extract tags: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Build a tag → count map from all posts.
 */
export function getTagCounts(): Record<string, number> {
  try {
    const tagCountMap: Record<string, number> = {};
    for (const post of getAllPosts()) {
      const tags = post.frontmatter.tags;
      if (Array.isArray(tags)) {
        for (const tag of tags) {
          if (typeof tag === 'string') {
            const normalized = tag.toLowerCase();
            tagCountMap[normalized] = (tagCountMap[normalized] ?? 0) + 1;
          }
        }
      }
    }
    return tagCountMap;
  } catch (error) {
    throw new Error(`Failed to count tags: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Filter posts by a tag name (case-insensitive).
 * Returns the original (unsorted) posts and the resolved canonical tag for display.
 */
export function getFilteredPosts(
  tag: string | null,
  sortNewestFirst = true
): { posts: BlogPostModule[]; canonicalTag: string } {
  try {
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
  } catch (error) {
    throw new Error(`Failed to filter posts: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Calculate reading time for a single post module.
 */
export function getReadingTime(post: BlogPostModule): string {
  try {
    const contentStr = post.rawContent ? post.rawContent() : '';
    return calculateReadingTime(contentStr);
  } catch (error) {
    throw new Error(`Failed to calculate reading time: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Determine whether a raw tag param is a valid tag name.
 */
export function isValidTag(rawTag: string | null, tagCounts: Record<string, number>): boolean {
  if (!rawTag) return false;
  const trimmed = rawTag.trim().toLowerCase();
  if (!trimmed) return false;
  return trimmed in tagCounts;
}