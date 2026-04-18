// Shared utility functions for the blog

/**
 * Format a Date object as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate reading time from markdown content
 */
export function calculateReadingTime(rawContent: string): string {
  const wordsPerMinute = 100;

  // Remove markdown syntax for more accurate word count
  const textOnly = rawContent
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/[#*_~\[\]()]/g, '') // Remove markdown syntax
    .trim();

  const words = textOnly.split(/\s+/).filter(word => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
}

/**
 * Format a count with K/M suffixes
 */
export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
