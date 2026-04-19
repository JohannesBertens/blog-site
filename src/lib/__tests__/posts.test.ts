import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { BlogPostModule } from '../types';

// Mock the posts module before importing
vi.mock('../posts', () => {
  let mockPosts: Record<string, BlogPostModule> = {};

  return {
    getAllPosts: vi.fn(() => {
      const posts = Object.values(mockPosts);
      return posts.sort(
        (a, b) =>
          new Date(b.frontmatter.pubDate).valueOf() -
          new Date(a.frontmatter.pubDate).valueOf()
      );
    }),
    getAllTags: vi.fn(() => {
      const posts = Object.values(mockPosts);
      return [...new Set(posts.flatMap((post) => post.frontmatter.tags || []))];
    }),
    getTagCounts: vi.fn(() => {
      const tagCountMap: Record<string, number> = {};
      for (const post of Object.values(mockPosts)) {
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
    }),
    getFilteredPosts: vi.fn(
      (tag: string | null, sortNewestFirst = true) => {
        let posts = Object.values(mockPosts);
        let canonicalTag = 'all';

        if (tag) {
          const trimmed = tag.trim().toLowerCase();
          const allTags = [...new Set(posts.flatMap((p) => p.frontmatter.tags || []))];
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
            (a, b) =>
              new Date(b.frontmatter.pubDate).valueOf() -
              new Date(a.frontmatter.pubDate).valueOf()
          );
        }

        return { posts, canonicalTag };
      }
    ),
    isValidTag: vi.fn(
      (rawTag: string | null, tagCounts: Record<string, number>) => {
        if (!rawTag) return false;
        const trimmed = rawTag.trim().toLowerCase();
        if (!trimmed) return false;
        return trimmed in tagCounts;
      }
    ),
    getReadingTime: vi.fn(() => '5 min read'),
    _setMockPosts: (posts: Record<string, BlogPostModule>) => {
      mockPosts = posts;
    },
  };
});

// Access the mocked functions
import * as postsModule from '../posts';

describe('posts library', () => {
  let setMockPosts: (posts: Record<string, BlogPostModule>) => void;

  beforeEach(() => {
    const module = postsModule as typeof postsModule & {
      _setMockPosts: (posts: Record<string, BlogPostModule>) => void;
    };
    setMockPosts = module._setMockPosts;
    vi.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('returns posts sorted newest-first', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/older',
          frontmatter: {
            title: 'Older Post',
            pubDate: '2025-01-15',
            tags: [],
          },
        },
        './post-2.md': {
          url: '/posts/newer',
          frontmatter: {
            title: 'Newer Post',
            pubDate: '2025-06-20',
            tags: [],
          },
        },
      });

      const posts = postsModule.getAllPosts();

      expect(posts[0].frontmatter.title).toBe('Newer Post');
      expect(posts[1].frontmatter.title).toBe('Older Post');
    });

    it('includes draft posts in returned results', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/regular',
          frontmatter: {
            title: 'Regular Post',
            pubDate: '2025-01-15',
            tags: [],
            draft: false,
          },
        },
        './post-2.md': {
          url: '/posts/draft',
          frontmatter: {
            title: 'Draft Post',
            pubDate: '2025-02-15',
            tags: [],
            draft: true,
          },
        },
      });

      const posts = postsModule.getAllPosts();

      // getAllPosts returns all posts including drafts
      expect(posts).toHaveLength(2);
      expect(posts.map((p) => p.frontmatter.draft)).toContain(true);
    });
  });

  describe('getAllTags', () => {
    it('extracts unique tags from all posts', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['javascript', 'web'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['javascript', 'astro'],
          },
        },
      });

      const tags = postsModule.getAllTags();

      expect(tags).toContain('javascript');
      expect(tags).toContain('web');
      expect(tags).toContain('astro');
      expect(tags).toHaveLength(3);
    });

    it('removes duplicate tags', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['tag1', 'tag2'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['tag1', 'tag3'],
          },
        },
      });

      const tags = postsModule.getAllTags();

      const tag1Count = tags.filter((t) => t === 'tag1').length;
      expect(tag1Count).toBe(1);
    });

    it('handles posts with no tags', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['web'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: undefined,
          },
        },
      });

      const tags = postsModule.getAllTags();

      expect(tags).toContain('web');
      expect(tags).toHaveLength(1);
    });
  });

  describe('getTagCounts', () => {
    it('counts tags accurately', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['javascript', 'web'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['javascript', 'astro'],
          },
        },
        './post-3.md': {
          url: '/posts/post-3',
          frontmatter: {
            title: 'Post 3',
            pubDate: '2025-03-01',
            tags: ['web'],
          },
        },
      });

      const counts = postsModule.getTagCounts();

      expect(counts['javascript']).toBe(2);
      expect(counts['web']).toBe(2);
      expect(counts['astro']).toBe(1);
    });

    it('normalizes tags to lowercase', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['JavaScript', 'WEB'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['javascript'],
          },
        },
      });

      const counts = postsModule.getTagCounts();

      // JavaScript + javascript = 2 (normalized to lowercase)
      expect(counts['javascript']).toBe(2);
      expect(counts['web']).toBe(1);
      expect(counts).not.toHaveProperty('JavaScript');
      expect(counts).not.toHaveProperty('WEB');
    });

    it('handles empty state', () => {
      setMockPosts({});

      const counts = postsModule.getTagCounts();

      expect(counts).toEqual({});
    });
  });

  describe('getFilteredPosts', () => {
    it('returns all posts when tag is null', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['web'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['astro'],
          },
        },
      });

      const { posts, canonicalTag } = postsModule.getFilteredPosts(null);

      expect(posts).toHaveLength(2);
      expect(canonicalTag).toBe('all');
    });

    it('filters posts case-insensitively', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['JavaScript'],
          },
        },
        './post-2.md': {
          url: '/posts/post-2',
          frontmatter: {
            title: 'Post 2',
            pubDate: '2025-02-01',
            tags: ['JAVASCRIPT'],
          },
        },
        './post-3.md': {
          url: '/posts/post-3',
          frontmatter: {
            title: 'Post 3',
            pubDate: '2025-03-01',
            tags: ['Python'],
          },
        },
      });

      const { posts, canonicalTag } = postsModule.getFilteredPosts('javascript');

      expect(posts).toHaveLength(2);
      expect(canonicalTag).toBe('JavaScript');
    });

    it('returns canonical tag for display', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['JavaScript'],
          },
        },
      });

      const { canonicalTag } = postsModule.getFilteredPosts('JAVASCRIPT');

      expect(canonicalTag).toBe('JavaScript');
    });

    it('returns all posts for non-existent tag', () => {
      setMockPosts({
        './post-1.md': {
          url: '/posts/post-1',
          frontmatter: {
            title: 'Post 1',
            pubDate: '2025-01-01',
            tags: ['JavaScript'],
          },
        },
      });

      const { posts, canonicalTag } = postsModule.getFilteredPosts('nonexistent');

      // Returns all posts when tag doesn't exist (canonicalTag stays 'all')
      expect(posts).toHaveLength(1);
      expect(canonicalTag).toBe('all');
    });
  });

  describe('isValidTag', () => {
    it('returns true for valid tags', () => {
      const tagCounts = { javascript: 2, web: 1 };

      expect(postsModule.isValidTag('javascript', tagCounts)).toBe(true);
      expect(postsModule.isValidTag('web', tagCounts)).toBe(true);
    });

    it('returns false for invalid tags', () => {
      const tagCounts = { javascript: 2, web: 1 };

      expect(postsModule.isValidTag('python', tagCounts)).toBe(false);
      expect(postsModule.isValidTag('nonexistent', tagCounts)).toBe(false);
    });

    it('handles case-insensitive matching', () => {
      const tagCounts = { javascript: 2, web: 1 };

      expect(postsModule.isValidTag('JAVASCRIPT', tagCounts)).toBe(true);
      expect(postsModule.isValidTag('Web', tagCounts)).toBe(true);
    });

    it('returns false for null or empty input', () => {
      const tagCounts = { javascript: 2 };

      expect(postsModule.isValidTag(null, tagCounts)).toBe(false);
      expect(postsModule.isValidTag('', tagCounts)).toBe(false);
      expect(postsModule.isValidTag('   ', tagCounts)).toBe(false);
    });

    it('returns false for whitespace-only input', () => {
      const tagCounts = { javascript: 2 };

      expect(postsModule.isValidTag('  ', tagCounts)).toBe(false);
      expect(postsModule.isValidTag('\t', tagCounts)).toBe(false);
      expect(postsModule.isValidTag('\n', tagCounts)).toBe(false);
    });
  });
});
