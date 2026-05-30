import type { MarkdownInstance } from 'astro';

export interface PostFrontmatter {
  title: string;
  description?: string;
  pubDate: string | Date;
  updatedDate?: string | Date;
  author?: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
  readingTime?: string;
  wordCount?: number;
}

export type PostModule = MarkdownInstance<PostFrontmatter>;
