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
    
    // Verify board size options include 7x7
    const sizeOptions = page.getByTestId('size-selector').locator('option');
    await expect(sizeOptions).toHaveCount(3);
    await expect(sizeOptions.nth(0)).toHaveAttribute('value', '3');
    await expect(sizeOptions.nth(1)).toHaveAttribute('value', '4');
    await expect(sizeOptions.nth(2)).toHaveAttribute('value', '7');
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
    await expect(page.getByTestId('cell-0')).toContainText('X');
    
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

  test('should change board size to 7x7', async ({ page }) => {
    // Change board size to 7x7
    await page.getByTestId('size-selector').selectOption('7');
    
    // Verify the board size changed
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    
    // Verify board has 49 cells now (7x7)
    const cells = page.locator('[data-testid^="cell-"]');
    await expect(cells).toHaveCount(49);
    
    // Verify board has correct CSS class
    await expect(page.getByTestId('game-board')).toHaveClass(/board-7x7/);
    
    // Make a move to verify functionality
    await page.getByTestId('cell-24').click(); // Center cell (position 24 in 7x7)
    await expect(page.getByTestId('cell-24')).toContainText('X');
  });

  test('should start new game when button clicked', async ({ page }) => {
    // Make some moves
    await page.getByTestId('cell-0').click();
    await page.getByTestId('cell-1').click();
    
    // Verify moves were made
    await expect(page.getByTestId('cell-0')).toContainText('X');
    await expect(page.getByTestId('cell-1')).toContainText('O');
    
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
    await expect(page.getByTestId('cell-4')).toContainText('X');
    
    // Wait for computer move using expect polling (better than waitForTimeout)
    // Computer should make a move within reasonable time
    const oCell = page.locator('[data-testid^="cell-"][data-player="O"]');
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

test.describe('7x7 Board End-to-End Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/game');
  });

  test('should complete full 7x7 Human vs Computer game scenario', async ({ page }) => {
    // Select 7x7 board and human vs computer mode
    await page.getByTestId('size-selector').selectOption('7');
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    
    // Verify 7x7 board setup
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
    
    // Verify 49 cells are rendered
    const cells = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cells).toHaveCount(49);
    
    // Verify board has correct CSS class for 7x7
    await expect(page.getByTestId('game-board')).toHaveClass(/board-7x7/);
    
    // Human makes opening move (center position 24)
    await page.getByTestId('cell-24').click();
    await expect(page.getByTestId('cell-24')).toContainText('X');
    await expect(page.getByTestId('cell-24')).toHaveAttribute('data-player', 'X');
    
    // Wait for computer response
    const computerMove = page.locator('[data-testid^="cell-"][data-player="O"]');
    await expect(computerMove).toBeVisible({ timeout: 8000 });
    
    // Find an empty cell and make human move
    const emptyCell = page.locator('[data-testid^="cell-"]:not([data-player])').first();
    await emptyCell.click();
    await expect(emptyCell).toHaveAttribute('data-player', 'X');
    
    // Wait for second computer move
    const computerMoves = page.locator('[data-testid^="cell-"][data-player="O"]');
    await expect(computerMoves).toHaveCount(2, { timeout: 8000 });
    
    // Verify game is progressing correctly
    const humanMoves = page.locator('[data-testid^="cell-"][data-player="X"]');
    await expect(humanMoves).toHaveCount(2);
    
    // Game should be active and showing proper status
    const gameStatus = page.getByTestId('game-status');
    await expect(gameStatus).toBeVisible();
  });

  test('should detect 7x7 win condition in Human vs Human mode', async ({ page }) => {
    // Set up 7x7 Human vs Human game
    await page.getByTestId('size-selector').selectOption('7');
    await page.getByTestId('mode-selector').selectOption('human-vs-human');
    
    // Verify setup
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-human');
    
    // Play moves leading to X win in row 3 [21,22,23,24]
    await page.getByTestId('cell-21').click(); // X
    await page.getByTestId('cell-0').click();  // O
    await page.getByTestId('cell-22').click(); // X
    await page.getByTestId('cell-1').click();  // O
    await page.getByTestId('cell-23').click(); // X
    await page.getByTestId('cell-2').click();  // O
    await page.getByTestId('cell-24').click(); // X wins!
    
    // Verify win detection
    await expect(page.getByTestId('game-status')).toContainText('X Wins!');
    
    // Verify winning cells contain X
    await expect(page.getByTestId('cell-21')).toContainText('X');
    await expect(page.getByTestId('cell-22')).toContainText('X');
    await expect(page.getByTestId('cell-23')).toContainText('X');
    await expect(page.getByTestId('cell-24')).toContainText('X');
    
    // Verify game is ended - empty cells should be disabled
    const emptyCells = page.locator('[data-testid^="cell-"]:not([data-player])');
    const emptyCount = await emptyCells.count();
    
    // All remaining empty cells should be disabled after win
    for (let i = 0; i < emptyCount; i++) {
      await expect(emptyCells.nth(i)).toBeDisabled();
    }
  });

  test('should handle 7x7 column win detection', async ({ page }) => {
    await page.getByTestId('size-selector').selectOption('7');
    await page.getByTestId('mode-selector').selectOption('human-vs-human');
    
    // Play moves leading to X win in column 0 [0,7,14,21]
    await page.getByTestId('cell-0').click();  // X
    await page.getByTestId('cell-1').click();  // O
    await page.getByTestId('cell-7').click();  // X
    await page.getByTestId('cell-2').click();  // O
    await page.getByTestId('cell-14').click(); // X
    await page.getByTestId('cell-3').click();  // O
    await page.getByTestId('cell-21').click(); // X wins column!
    
    // Verify win detection
    await expect(page.getByTestId('game-status')).toContainText('X Wins!');
    
    // Verify winning column cells contain X
    await expect(page.getByTestId('cell-0')).toContainText('X');
    await expect(page.getByTestId('cell-7')).toContainText('X');
    await expect(page.getByTestId('cell-14')).toContainText('X');
    await expect(page.getByTestId('cell-21')).toContainText('X');
  });

  test('should handle 7x7 diagonal win detection', async ({ page }) => {
    await page.getByTestId('size-selector').selectOption('7');
    await page.getByTestId('mode-selector').selectOption('human-vs-human');
    
    // Play moves leading to X win in main diagonal [0,8,16,24]
    await page.getByTestId('cell-0').click();  // X
    await page.getByTestId('cell-1').click();  // O
    await page.getByTestId('cell-8').click();  // X
    await page.getByTestId('cell-2').click();  // O
    await page.getByTestId('cell-16').click(); // X
    await page.getByTestId('cell-3').click();  // O
    await page.getByTestId('cell-24').click(); // X wins diagonal!
    
    // Verify win detection
    await expect(page.getByTestId('game-status')).toContainText('X Wins!');
    
    // Verify winning diagonal cells contain X
    await expect(page.getByTestId('cell-0')).toContainText('X');
    await expect(page.getByTestId('cell-8')).toContainText('X');
    await expect(page.getByTestId('cell-16')).toContainText('X');
    await expect(page.getByTestId('cell-24')).toContainText('X');
  });

  test('should handle board size switching from and to 7x7', async ({ page }) => {
    // Start with 3x3
    await expect(page.getByTestId('size-selector')).toHaveValue('3');
    
    const cells3x3 = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cells3x3).toHaveCount(9);
    
    // Make a move in 3x3
    await page.getByTestId('cell-4').click();
    await expect(page.getByTestId('cell-4')).toContainText('X');
    
    // Switch to 7x7
    await page.getByTestId('size-selector').selectOption('7');
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    
    // Verify 7x7 board
    const cells7x7 = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cells7x7).toHaveCount(49);
    await expect(page.getByTestId('game-board')).toHaveClass(/board-7x7/);
    
    // Verify board is reset (no moves from previous game)
    await expect(page.getByTestId('cell-4')).not.toContainText('X');
    
    // Make a move in 7x7
    await page.getByTestId('cell-24').click(); // Center of 7x7
    await expect(page.getByTestId('cell-24')).toContainText('X');
    
    // Switch to 4x4
    await page.getByTestId('size-selector').selectOption('4');
    await expect(page.getByTestId('size-selector')).toHaveValue('4');
    
    const cells4x4 = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cells4x4).toHaveCount(16);
    await expect(page.getByTestId('game-board')).toHaveClass(/board-4x4/);
    
    // Switch back to 7x7
    await page.getByTestId('size-selector').selectOption('7');
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    
    const cellsBack7x7 = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cellsBack7x7).toHaveCount(49);
    await expect(page.getByTestId('game-board')).toHaveClass(/board-7x7/);
    
    // Verify fresh game state
    await expect(page.getByTestId('cell-24')).not.toContainText('X');
  });

  test('should maintain game mode during 7x7 board transitions', async ({ page }) => {
    // Set human vs computer mode
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
    
    // Switch to 7x7
    await page.getByTestId('size-selector').selectOption('7');
    
    // Verify mode is preserved
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    
    // Verify computer opponent still works
    await page.getByTestId('cell-24').click(); // Human move
    await expect(page.getByTestId('cell-24')).toContainText('X');
    
    // Wait for computer response
    const computerMove = page.locator('[data-testid^="cell-"][data-player="O"]');
    await expect(computerMove).toBeVisible({ timeout: 5000 });
    
    // Switch board size and verify mode preservation
    await page.getByTestId('size-selector').selectOption('4');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
    
    await page.getByTestId('size-selector').selectOption('7');
    await expect(page.getByTestId('mode-selector')).toHaveValue('human-vs-computer');
  });

  test('should handle 7x7 new game functionality', async ({ page }) => {
    await page.getByTestId('size-selector').selectOption('7');
    
    // Make several moves
    await page.getByTestId('cell-0').click();
    await page.getByTestId('cell-8').click();
    await page.getByTestId('cell-16').click();
    
    // Verify moves were made
    await expect(page.getByTestId('cell-0')).toContainText('X');
    await expect(page.getByTestId('cell-8')).toContainText('O');
    await expect(page.getByTestId('cell-16')).toContainText('X');
    
    // Click new game button
    await page.getByTestId('new-game-button').click();
    
    // Verify board is reset
    await expect(page.getByTestId('cell-0')).not.toContainText('X');
    await expect(page.getByTestId('cell-8')).not.toContainText('O');
    await expect(page.getByTestId('cell-16')).not.toContainText('X');
    
    // Verify 7x7 board is maintained
    const cells = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(cells).toHaveCount(49);
    await expect(page.getByTestId('size-selector')).toHaveValue('7');
    
    // Verify game can continue
    await page.getByTestId('cell-24').click();
    await expect(page.getByTestId('cell-24')).toContainText('X');
  });

  test('should demonstrate proper 7x7 cell accessibility and interaction', async ({ page }) => {
    await page.getByTestId('size-selector').selectOption('7');
    
    // Test corner cells with alternating players
    await page.getByTestId('cell-0').click();   // X
    await expect(page.getByTestId('cell-0')).toContainText('X');
    await expect(page.getByTestId('cell-0')).toBeDisabled();
    
    await page.getByTestId('cell-6').click();   // O
    await expect(page.getByTestId('cell-6')).toContainText('O');
    await expect(page.getByTestId('cell-6')).toBeDisabled();
    
    await page.getByTestId('cell-42').click();  // X
    await expect(page.getByTestId('cell-42')).toContainText('X');
    await expect(page.getByTestId('cell-42')).toBeDisabled();
    
    await page.getByTestId('cell-48').click();  // O
    await expect(page.getByTestId('cell-48')).toContainText('O');
    await expect(page.getByTestId('cell-48')).toBeDisabled();
    
    // Test edge cells
    await page.getByTestId('cell-3').click();   // X
    await expect(page.getByTestId('cell-3')).toContainText('X');
    await expect(page.getByTestId('cell-3')).toBeDisabled();
    
    await page.getByTestId('cell-21').click();  // O
    await expect(page.getByTestId('cell-21')).toContainText('O');
    await expect(page.getByTestId('cell-21')).toBeDisabled();
    
    // Test center cell
    await page.getByTestId('cell-24').click();  // X
    await expect(page.getByTestId('cell-24')).toContainText('X');
    await expect(page.getByTestId('cell-24')).toBeDisabled();
    
    // Verify total number of filled cells
    const filledCells = page.locator('[data-testid^="cell-"][data-player]');
    await expect(filledCells).toHaveCount(7);
    
    // Verify total cells is 49 for 7x7
    const allCells = page.getByTestId(new RegExp('^cell-\\d+$'));
    await expect(allCells).toHaveCount(49);
    
    // Verify filled cells are disabled and retain their content
    await expect(page.getByTestId('cell-0')).toBeDisabled();
    await expect(page.getByTestId('cell-0')).toContainText('X');
  });

  test('should handle 7x7 performance requirements during E2E interaction', async ({ page }) => {
    await page.getByTestId('size-selector').selectOption('7');
    await page.getByTestId('mode-selector').selectOption('human-vs-computer');
    
    // Measure response time for human vs computer moves
    const startTime = Date.now();
    
    await page.getByTestId('cell-24').click(); // Human move
    await expect(page.getByTestId('cell-24')).toContainText('X');
    
    // Wait for computer response and measure time
    const computerMove = page.locator('[data-testid^="cell-"][data-player="O"]');
    await expect(computerMove).toBeVisible({ timeout: 8000 }); // 8 second requirement
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(8000); // Verify <8 second requirement
    
    // Test sustained performance by making moves in empty cells
    const emptyCells = page.locator('[data-testid^="cell-"]:not([data-player])');
    
    // Make first additional human move
    const firstEmpty = emptyCells.first();
    await firstEmpty.click();
    await expect(firstEmpty).toHaveAttribute('data-player', 'X');
    
    // Wait for second computer response
    const computerMoves = page.locator('[data-testid^="cell-"][data-player="O"]');
    await expect(computerMoves).toHaveCount(2, { timeout: 8000 });
    
    // Make second additional human move
    const remainingEmpty = page.locator('[data-testid^="cell-"]:not([data-player])');
    const secondEmpty = remainingEmpty.first();
    await secondEmpty.click();
    await expect(secondEmpty).toHaveAttribute('data-player', 'X');
    
    // Verify game remains responsive throughout
    const gameStatus = page.getByTestId('game-status');
    await expect(gameStatus).toBeVisible();
  });
});