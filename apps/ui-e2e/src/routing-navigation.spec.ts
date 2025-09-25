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