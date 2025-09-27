import { test, expect } from '@playwright/test';

test.describe('Page Navigation', () => {
  test('should navigate between all pages using navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test that game page loads by default
    await expect(page.locator('[data-testid="game-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Tic Tac Toe');
    
    // Navigate to health page
    await page.click('[data-testid="nav-health"]');
    await expect(page.locator('[data-testid="health-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Health Check');
    
    // Navigate to credits page
    await page.click('[data-testid="nav-credits"]');
    await expect(page.locator('[data-testid="credits-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Credits');
    
    // Navigate back to game using navigation
    await page.click('[data-testid="nav-game"]');
    await expect(page.locator('[data-testid="game-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Tic Tac Toe');
  });

  test('should have functional back to game link from credits page', async ({ page }) => {
    await page.goto('/credits');
    
    // Verify we're on credits page
    await expect(page.locator('[data-testid="credits-page"]')).toBeVisible();
    
    // Click the back to game button
    await page.click('[data-testid="back-to-game"]');
    await expect(page.locator('[data-testid="game-page"]')).toBeVisible();
  });

  test('credits page displays attribution information', async ({ page }) => {
    await page.goto('/credits');
    
    // Verify page loads and has proper title
    await expect(page.locator('[data-testid="credits-page"]')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Credits');
    
    // Verify contributors section
    const contributorsSection = page.locator('[data-testid="contributors-section"]');
    await expect(contributorsSection).toBeVisible();
    await expect(contributorsSection.locator('h2')).toHaveText('Contributors');
    
    // Verify dependency table exists and is accessible
    const dependencyTable = page.getByRole('table', { name: /dependencies/i });
    await expect(dependencyTable).toBeVisible();
    
    // Verify license links work
    const licenseLink = page.locator('[data-testid="license-link"]');
    const noticeLink = page.locator('[data-testid="notice-link"]');
    await expect(licenseLink).toBeVisible();
    await expect(noticeLink).toBeVisible();
    
    // Verify navigation works
    await page.getByTestId('back-to-game').click();
    await expect(page).toHaveURL('/');
  });

  test('LICENSE and NOTICE file links are accessible and functional', async ({ page }) => {
    await page.goto('/credits');
    
    // Test LICENSE link functionality
    const licenseLink = page.locator('[data-testid="license-link"]');
    await expect(licenseLink).toBeVisible();
    await expect(licenseLink).toHaveAttribute('href', '/LICENSE.txt');
    await expect(licenseLink).toHaveAttribute('target', '_blank');
    await expect(licenseLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Test NOTICE link functionality
    const noticeLink = page.locator('[data-testid="notice-link"]');
    await expect(noticeLink).toBeVisible();
    await expect(noticeLink).toHaveAttribute('href', '/NOTICE.txt');
    await expect(noticeLink).toHaveAttribute('target', '_blank');
    await expect(noticeLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Test that files are actually accessible (open in new tab and verify content)
    const [licensePagePromise] = await Promise.all([
      page.context().waitForEvent('page'),
      licenseLink.click()
    ]);
    const licensePage = await licensePagePromise;
    await licensePage.waitForLoadState();
    
    // Verify LICENSE file content (should not contain source maps)
    await expect(licensePage).toHaveURL('/LICENSE.txt');
    const licenseContent = await licensePage.textContent('body');
    expect(licenseContent).toContain('MIT License');
    expect(licenseContent).toContain('Copyright (c) 2025 Tic-Tac-Toe Showcase Project');
    expect(licenseContent).not.toContain('sourceMappingURL'); // Verify no source maps
    await licensePage.close();
    
    // Test NOTICE file
    const [noticePagePromise] = await Promise.all([
      page.context().waitForEvent('page'),
      noticeLink.click()
    ]);
    const noticePage = await noticePagePromise;
    await noticePage.waitForLoadState();
    
    // Verify NOTICE file content (should not contain source maps)
    await expect(noticePage).toHaveURL('/NOTICE.txt');
    const noticeContent = await noticePage.textContent('body');
    expect(noticeContent).toContain('Tic-Tac-Toe Showcase Project');
    expect(noticeContent).toContain('Angular');
    expect(noticeContent).toContain('MIT License');
    expect(noticeContent).not.toContain('sourceMappingURL'); // Verify no source maps
    await noticePage.close();
  });

  test('should maintain responsive layout on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const boardContainer = page.locator('[data-testid="game-board-container"]');
    await expect(boardContainer).toBeVisible();
    
    // Navigation should still work on mobile
    await page.click('[data-testid="nav-health"]');
    await expect(page.locator('[data-testid="health-page"]')).toBeVisible();
    
    await page.click('[data-testid="nav-credits"]');
    await expect(page.locator('[data-testid="credits-page"]')).toBeVisible();
  });

  test('should show active navigation state correctly', async ({ page }) => {
    await page.goto('/');
    
    // Game link should be active
    const gameLink = page.locator('[data-testid="nav-game"]');
    await expect(gameLink).toHaveClass(/active/);
    
    // Navigate to health
    await page.click('[data-testid="nav-health"]');
    
    // Health link should be active, game should not
    const healthLink = page.locator('[data-testid="nav-health"]');
    await expect(healthLink).toHaveClass(/active/);
    await expect(gameLink).not.toHaveClass(/active/);
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Direct navigation to health page
    await page.goto('/health');
    await expect(page.locator('[data-testid="health-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-health"]')).toHaveClass(/active/);
    
    // Direct navigation to credits page
    await page.goto('/credits');
    await expect(page.locator('[data-testid="credits-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-credits"]')).toHaveClass(/active/);
    
    // Direct navigation to home
    await page.goto('/');
    await expect(page.locator('[data-testid="game-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-game"]')).toHaveClass(/active/);
  });

  test('should render game controls and board', async ({ page }) => {
    await page.goto('/');
    
    // Check game controls are present
    await expect(page.locator('[data-testid="game-controls"]')).toBeVisible();
    
    // Check control elements are present (mode selector, size selector, new game button)
    await expect(page.getByTestId('mode-selector')).toBeVisible();
    await expect(page.getByTestId('size-selector')).toBeVisible();
    await expect(page.getByTestId('new-game-button')).toBeVisible();
    
    // Check game board is visible
    await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
  });
});