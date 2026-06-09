/**
 * Shared reading-time calculation utility.
 * Extracted from index.astro to eliminate code duplication (C-6 / WEB-22).
 */

const WORDS_PER_MINUTE = 200;

/**
 * Calculate a human-readable reading time string from raw markdown content.
 * Uses 200 WPM as the standard reading speed (C-6 / WEB-22).
 */
export function calculateReadingTime(rawContent: string | (() => string) | undefined): string {
  // Resolve rawContent if it's a function (Astro's lazy-loading pattern)
  const contentStr = typeof rawContent === 'function' ? rawContent() : (rawContent ?? '');

  // Remove markdown syntax for more accurate word count
  const textOnly = contentStr
    .replace(/```[\s\S]*?```/g, '')    // Remove code blocks
    .replace(/`[^`]*`/g, '')            // Remove inline code
    .replace(/[#*_~\[\]()]/g, '')       // Remove markdown syntax
    .trim();

  const words = textOnly.split(/\s+/).filter((word: string) => word.length > 0).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);

  return `${minutes} min read`;
}
