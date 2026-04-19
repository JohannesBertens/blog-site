// Shared type definitions for the blog

export interface BlogPostFrontmatter {
  title: string;
  description?: string;
  pubDate: Date | string;
  updatedDate?: Date | string;
  author?: string;
  tags?: string[];
  readingTime?: string;
  wordCount?: number;
  draft?: boolean;
}

export interface BlogPostModule {
  url: string;
  frontmatter: BlogPostFrontmatter;
  rawContent?: () => string;
}

