import { test, expect } from '@playwright/test';

test.describe('Basic Navigation E2E Tests', () => {
  
  test('should navigate to home page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Since home redirects to health, check that redirect works
    await expect(page).toHaveTitle(/Health Check/i);
    
    // Should have some basic content structure
    await expect(page.locator('body')).toBeVisible();
    
    // Should have the main application container (use toBeAttached instead of toBeVisible)
    await expect(page.locator('app-root')).toBeAttached();
    
    // Should show health content after redirect
    await expect(page.getByTestId('app-name')).toBeVisible();
  });

  test('should be responsive across different viewports', async ({ page }) => {
    await page.goto('/');

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load without critical JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    
    // Should not have any critical console errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && // Ignore favicon errors
      !error.includes('chrome-extension') // Ignore extension errors
    );
    expect(criticalErrors.length).toBe(0);
  });
});
