import { test, expect } from '@playwright/test';

test.describe('Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game');
  });

  test('should display game controls with default values', async ({ page }) => {
    // Verify controls are visible
    await expect(page.getByTestId('game-controls')).toBeVisible();
    await expect(page.getByTestId('mode-selector')).toBeVisible();
    await expect(page.getByTestId('size-selector')).toBeVisible();
    await expect(page.getByTestId('new-game-button')).toBeVisible();
    
    // Verify default values
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-human');
    await expect(page.getByTestId('size-selector')).toHaveValue('3');
  });

  test('should change game mode', async ({ page }) => {
    // Change mode to human vs computer
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    
    // Verify the mode changed
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
    
    // Verify new game started (board should be empty)
    const cells = page.locator('[data-testid^="cell-"]');
    const cellCount = await cells.count();
    
    for (let i = 0; i < cellCount; i++) {
      const cellText = await cells.nth(i).textContent();
      expect(cellText?.trim()).toBe('');
    }
  });

  test('should change board size', async ({ page }) => {
    // Make a move first
    await page.getByTestId('cell-0').click();
    
    // Verify move was made
    await expect(page.getByTestId('cell-0')).toHaveText('❌');
    
    // Change board size to 4x4
    await page.getByTestId('size-selector').selectOption('4');
    
    // Verify the board size changed and new game started
    await expect(page.getByTestId('size-selector')).toHaveValue('4');
    
    // Verify board has 16 cells now (4x4)
    const cells = page.locator('[data-testid^="cell-"]');
    await expect(cells).toHaveCount(16);
    
    // Verify new game started (first cell should be empty again)
    await expect(page.getByTestId('cell-0')).toHaveText('');
  });

  test('should start new game when button clicked', async ({ page }) => {
    // Make some moves
    await page.getByTestId('cell-0').click();
    await page.getByTestId('cell-1').click();
    
    // Verify moves were made
    await expect(page.getByTestId('cell-0')).toHaveText('❌');
    await expect(page.getByTestId('cell-1')).toHaveText('⭕');
    
    // Click new game button
    await page.getByTestId('new-game-button').click();
    
    // Verify board is reset
    await expect(page.getByTestId('cell-0')).toHaveText('');
    await expect(page.getByTestId('cell-1')).toHaveText('');
  });

  test('should handle human vs computer mode gameplay', async ({ page }) => {
    // Change to human vs computer mode
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    
    // Make human move (X)
    await page.getByTestId('cell-4').click(); // Center cell
    
    // Verify human move
    await expect(page.getByTestId('cell-4')).toHaveText('❌');
    
    // Wait for computer move using expect polling (better than waitForTimeout)
    // Computer should make a move within reasonable time
    const oCell = page.locator('[data-testid^="cell-"]:has-text("⭕")');
    await expect(oCell).toBeVisible({ timeout: 2000 });
  });

  test('should preserve configuration when switching between modes', async ({ page }) => {
    // Change to 4x4 board
    await page.getByTestId('size-selector').selectOption('4');
    await expect(page.getByTestId('size-selector')).toHaveValue('4');
    
    // Change mode
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    
    // Verify board size is preserved
    await expect(page.getByTestId('size-selector')).toHaveValue('4');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check ARIA labels
    await expect(page.getByTestId('mode-selector')).toHaveAttribute('aria-label', 'Select game mode');
    await expect(page.getByTestId('size-selector')).toHaveAttribute('aria-label', 'Select board size');
    await expect(page.getByTestId('new-game-button')).toHaveAttribute('aria-label', 'Start new game');
    
    // Check semantic HTML (labels)
    const modeLabel = page.locator('label[for="game-mode"]');
    const sizeLabel = page.locator('label[for="board-size"]');
    
    await expect(modeLabel).toBeVisible();
    await expect(sizeLabel).toBeVisible();
    await expect(modeLabel).toHaveText('Game Mode:');
    await expect(sizeLabel).toHaveText('Board Size:');
  });
});