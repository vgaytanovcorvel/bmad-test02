# Testing Requirements

### Unit Test Template

```typescript
// game-board.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../services/game.service';
import { GameState } from '@libs/shared';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let gameService: jasmine.SpyObj<GameService>;

  const mockGameState: GameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winningLine: null,
    isTerminal: false,
    winner: null
  };

  beforeEach(async () => {
    const gameServiceSpy = jasmine.createSpyObj('GameService', ['makeMove'], {
      gameState: signal(mockGameState),
      isTerminal: signal(false)
    });

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty board', () => {
    fixture.detectChanges();
    const cells = fixture.debugElement.queryAll(By.css('.cell'));
    expect(cells).toHaveLength(9);
    cells.forEach(cell => {
      expect(cell.nativeElement.textContent.trim()).toBe('');
    });
  });

  it('should handle cell click', () => {
    fixture.detectChanges();
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    
    firstCell.nativeElement.click();
    
    expect(gameService.makeMove).toHaveBeenCalledWith(0);
  });

  it('should disable cells when game is terminal', () => {
    gameService.isTerminal.and.returnValue(signal(true));
    fixture.detectChanges();
    
    const cells = fixture.debugElement.queryAll(By.css('.cell'));
    cells.forEach(cell => {
      expect(cell.nativeElement.disabled).toBe(true);
    });
  });
});
```

### Integration Test Example

```typescript
// game.integration.spec.ts
import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { GameComponent } from './game.component';
import { GameService } from '../services/game.service';

describe('Game Integration', () => {
  it('should complete a full game flow', async () => {
    await render(GameComponent);
    
    // Start game
    expect(screen.getByText('Current Player: X')).toBeInTheDocument();
    
    // Make moves to create a winning condition
    fireEvent.click(screen.getByTestId('cell-0')); // X
    fireEvent.click(screen.getByTestId('cell-3')); // O (computer)
    fireEvent.click(screen.getByTestId('cell-1')); // X
    fireEvent.click(screen.getByTestId('cell-4')); // O (computer)
    fireEvent.click(screen.getByTestId('cell-2')); // X wins
    
    // Verify win condition
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
    expect(screen.getByTestId('new-game-button')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// game.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game board', async ({ page }) => {
    await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(9);
  });

  test('should complete human vs computer game', async ({ page }) => {
    // Switch to human vs computer mode
    await page.click('[data-testid="mode-toggle"]');
    
    // Make first move
    await page.click('[data-testid="cell-0"]');
    await expect(page.locator('[data-testid="cell-0"]')).toHaveText('X');
    
    // Wait for computer move
    await page.waitForTimeout(500);
    const occupiedCells = await page.locator('.cell.occupied').count();
    expect(occupiedCells).toBe(2); // Human + Computer move
  });

  test('should handle board size change', async ({ page }) => {
    await page.selectOption('[data-testid="board-size-select"]', '4');
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(16);
  });
});
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions with services
3. **E2E Tests**: Test critical user flows (using Playwright)
4. **Coverage Goals**: Aim for 85% code coverage (unit + integration)
5. **Test Structure**: Arrange-Act-Assert pattern
6. **Mock External Dependencies**: Game engine, computer player logic
7. **Deterministic Tests**: Ensure computer moves are predictable in tests
8. **Accessibility Testing**: Include basic screen reader and keyboard navigation tests
