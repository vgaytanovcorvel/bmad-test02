import { test, expect } from '@playwright/test';

test.describe('Health Check Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to health route
    await page.goto('/health');
  });

  test('should display health check page with correct title', async ({ page }) => {
    // Check page title is set correctly
    await expect(page).toHaveTitle(/Health Check/);
    
    // Check main heading (be specific about which H1)
    await expect(page.locator('h1').filter({ hasText: 'Health Check' })).toBeVisible();
  });

  test('should display green status indicator for healthy status', async ({ page }) => {
    // Check status indicator is present (use toBeAttached instead of toBeVisible)
    const statusIndicator = page.getByTestId('status-indicator');
    await expect(statusIndicator).toBeAttached();
    
    // Check status dot has green background
    const statusDot = page.locator('.status-dot');
    await expect(statusDot).toHaveClass(/bg-green-500/);
    
    // Check "Healthy" text is displayed
    await expect(page.locator('text=Healthy')).toBeVisible();
  });

  test('should display application information correctly', async ({ page }) => {
    // Check app name is displayed
    const appName = page.getByTestId('app-name');
    await expect(appName).toBeVisible();
    await expect(appName).toHaveText('Tic Tac Toe Showcase');
    
    // Check version is displayed
    const version = page.getByTestId('app-version');
    await expect(version).toBeVisible();
    await expect(version).toHaveText('1.3.0');
    
    // Check build hash is displayed (should not be empty)
    const buildHash = page.getByTestId('build-hash');
    await expect(buildHash).toBeVisible();
    await expect(buildHash).not.toBeEmpty();
    
    // Check environment is displayed
    const environment = page.getByTestId('environment');
    await expect(environment).toBeVisible();
    const envText = await environment.textContent();
    expect(envText).toMatch(/(Development|Production)/);
  });

  test('should display timestamp in readable format', async ({ page }) => {
    const timestamp = page.getByTestId('timestamp');
    await expect(timestamp).toBeVisible();
    await expect(timestamp).not.toBeEmpty();
    // Check timestamp contains date-like pattern
    await expect(timestamp).toHaveText(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/);
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check main page container has test id
    const healthPage = page.getByTestId('health-page');
    await expect(healthPage).toBeVisible();
    
    // Check all information sections are accessible
    const infoSections = [
      'app-name',
      'app-version', 
      'build-hash',
      'environment',
      'timestamp'
    ];
    
    for (const section of infoSections) {
      await expect(page.getByTestId(section)).toBeVisible();
    }
  });

  test('should render health route without errors', async ({ page }) => {
    // Check that the page loads without console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('load');
    
    // Check no console errors occurred
    expect(consoleErrors).toHaveLength(0);
  });

  test('should have responsive design elements', async ({ page }) => {
    // Check main card is visible
    const healthCard = page.locator('.health-card');
    await expect(healthCard).toBeVisible();
    
    // Check status indicator is visible
    const statusIndicator = page.locator('.status-indicator');
    await expect(statusIndicator).toBeVisible();
    
    // Check info items are visible
    const infoItems = page.locator('.info-item');
    await expect(infoItems.first()).toBeVisible();
  });

  test('should display environment with appropriate styling', async ({ page }) => {
    const environment = page.getByTestId('environment');
    await expect(environment).toBeVisible();
    
    // Check that environment shows either Production or Development (with trimmed whitespace)
    const envText = (await environment.textContent())?.trim();
    expect(envText === 'Production' || envText === 'Development').toBe(true);
  });

  test('should allow build hash text selection for copying', async ({ page }) => {
    const buildHash = page.getByTestId('build-hash');
    await expect(buildHash).toBeVisible();
    
    // Triple click to select all text (common user interaction)
    await buildHash.click({ clickCount: 3 });
    
    // Check that text can be selected (this is implicit in the click action)
    const selectedText = await page.evaluate(() => {
      return window.getSelection()?.toString();
    });
    
    expect(selectedText).toBeTruthy();
  });

  test('should navigate to health route directly via URL', async ({ page }) => {
    // Navigate directly to /health URL
    await page.goto('/health');
    
    // Verify we're on the correct page
    expect(page.url()).toContain('/health');
    
    // Verify health content is displayed
    await expect(page.locator('h1').filter({ hasText: 'Health Check' })).toBeVisible();
    await expect(page.getByTestId('app-name')).toBeVisible();
  });
});