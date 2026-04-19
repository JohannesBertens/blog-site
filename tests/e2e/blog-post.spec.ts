import { test, expect } from '@playwright/test';

test.describe('Blog Post', () => {
  // Get a sample post URL
  const getFirstPostUrl = async (page: any): Promise<string> => {
    await page.goto('/');
    const firstPostLink = page.locator('a[href*="/posts/"]').first();
    const href = await firstPostLink.getAttribute('href');
    return href || '/posts/20251205-FromLovableToLive';
  };

  test('blog post pages render correctly', async ({ page }) => {
    const postUrl = await getFirstPostUrl(page);
    await page.goto(postUrl);

    // Check that the page has content
    const article = page.locator('article.blog-post, .blog-post, article');
    await expect(article).toBeVisible();

    // Check for main content area
    const postContent = page.locator('.post-content, .content-wrapper, article main, .content');
    await expect(postContent.first()).toBeVisible();
  });

  test('metadata displays', async ({ page }) => {
    const postUrl = await getFirstPostUrl(page);
    await page.goto(postUrl);

    // Check for metadata container
    const metadata = page.locator('.metadata-container, [class*="metadata"]');
    await expect(metadata.first()).toBeVisible();

    // Check for common metadata elements
    // Published date
    const dateElement = page.locator('time, .meta-item, [class*="date"]');
    await expect(dateElement.first()).toBeVisible();

    // Author or tags should be present
    const authorOrTags = page.locator('.meta-item, .tag, [class*="tag"]');
    const hasAuthorOrTags = await authorOrTags.count() > 0;
    expect(hasAuthorOrTags).toBeTruthy();
  });
});
