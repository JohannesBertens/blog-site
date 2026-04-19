import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigation between pages works', async ({ page }) => {
    // Navigate to homepage
    await expect(page).toHaveTitle(/Blog/i);

    // Click on a post
    const firstPostLink = page.locator('a[href*="/posts/"]').first();
    await expect(firstPostLink).toBeVisible();
    await firstPostLink.click();

    // Should be on a post page
    await page.waitForURL(/\/posts\//);
    expect(page.url()).toContain('/posts/');

    // Check post page loaded
    const article = page.locator('article, .blog-post');
    await expect(article.first()).toBeVisible();
  });

  test('navigation back to home from post', async ({ page }) => {
    // Go to a post
    const firstPostLink = page.locator('a[href*="/posts/"]').first();
    await firstPostLink.click();
    await page.waitForURL(/\/posts\//);

    // Click home link
    const homeLink = page.locator('a[href="/"]').first();
    await homeLink.click();

    // Should be back on homepage
    await page.waitForURL('/');
    await expect(page).toHaveTitle(/Blog/i);
  });

  test('tag navigation works', async ({ page }) => {
    // Find tag filter
    const tagFilters = page.locator('aside a, .blog-sidebar a, a.tag-filter');
    const tagCount = await tagFilters.count();

    if (tagCount > 1) {
      const tagLink = tagFilters.nth(1);
      const href = await tagLink.getAttribute('href');
      
      if (href && href.includes('tag=')) {
        await tagLink.click();
        await page.waitForURL(/tag=/);
        
        // Filtered posts should load
        const posts = page.locator('a[href*="/posts/"]');
        await expect(posts.first()).toBeVisible();
      }
    }
  });
});
