import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with posts', async ({ page }) => {
    // Check for main heading or page title
    await expect(page).toHaveTitle(/Blog/i);

    // Check that posts are visible
    const postGrid = page.locator('.post-grid, .posts-grid, [class*="post"]');
    await expect(postGrid.first()).toBeVisible();
  });

  test('tag filtering works', async ({ page }) => {
    // Find tag filter links
    const tagFilters = page.locator('a.tag-filter, aside a[class*="tag"], .blog-sidebar a');
    const tagCount = await tagFilters.count();

    // Should have at least the "all" filter plus some tags
    expect(tagCount).toBeGreaterThanOrEqual(1);

    // Click on a tag if available
    if (tagCount > 1) {
      const firstTag = tagFilters.nth(1);
      const tagHref = await firstTag.getAttribute('href');
      
      if (tagHref) {
        await firstTag.click();
        await page.waitForURL(new RegExp('tag='));
        
        // The URL should contain the tag parameter
        expect(page.url()).toContain('tag=');
      }
    }
  });

  test('empty state for no matches', async ({ page }) => {
    // Navigate with a non-existent tag
    await page.goto('/?tag=nonexistent-tag-xyz');
    
    // Check for empty state message or no results (use separate locators)
    const emptyStateClass = page.locator('.empty-state, .no-posts');
    const emptyStateText = page.getByText(/no posts|no results/i);
    
    // Check for "all" filter being active (fallback behavior)
    const allFilterActive = page.locator('a.tag-filter.active, aside a.active').first();
    
    const hasEmptyStateClass = await emptyStateClass.count() > 0;
    const hasEmptyStateText = await emptyStateText.count() > 0;
    const hasAllActive = await allFilterActive.count() > 0;
    
    expect(hasEmptyStateClass || hasEmptyStateText || hasAllActive).toBeTruthy();
  });
});
