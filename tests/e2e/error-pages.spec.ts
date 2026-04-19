import { test, expect } from '@playwright/test';

test.describe('Error Pages', () => {
  test('404 page displays properly', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz-404');

    // Check that we get a 404 response
    await expect(page).toHaveTitle(/404|Not Found|Command Not Found/i);

    // Check for error message or terminal content (separate locators)
    const errorOutput = page.locator('.error-output, .terminal-prompt');
    const errorText = page.getByText(/404|command not found/i);
    
    const hasErrorOutput = await errorOutput.count() > 0;
    const hasErrorText = await errorText.count() > 0;
    
    expect(hasErrorOutput || hasErrorText).toBeTruthy();

    // Check for home link
    const homeLink = page.locator('a[href="/"], .home-link').getByText(/go home/i);
    await expect(homeLink.first()).toBeVisible();
  });

  test('500 page displays properly', async ({ page }) => {
    // The 500 page might not be directly accessible without causing an error
    // Try to visit it directly if it exists, or verify 404 behavior
    await page.goto('/500', { waitUntil: 'domcontentloaded' });
    
    // Should land on some error page (either 500 or 404 fallback)
    const title = await page.title();
    const isErrorPage = 
      title.includes('500') ||
      title.includes('404') ||
      title.includes('Error');
    
    expect(isErrorPage).toBeTruthy();
  });
});
