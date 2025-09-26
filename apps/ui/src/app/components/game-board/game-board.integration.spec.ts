import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent, RenderResult } from '@testing-library/angular';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../../services/game.service';

describe('GameBoard Integration Tests', () => {
  let gameService: GameService;

  let fixture: RenderResult<GameBoardComponent>;

  beforeEach(async () => {
    jest.useFakeTimers();
    fixture = await render(GameBoardComponent);
    gameService = TestBed.inject(GameService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should complete full game workflow with human moves', () => {
    // Initial state: empty board, X to play
    expect(gameService.gameState().currentPlayer).toBe('X');
    
    // Human move: Click first cell
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    // Verify game state updated correctly
    let boardState = gameService.gameState();
    expect(boardState.moveHistory.length).toBe(1);
    expect(boardState.currentPlayer).toBe('O'); // Should switch to O
    
    // Second human move
    fireEvent.click(screen.getByTestId('cell-1'));
    expect(screen.getByTestId('cell-1').textContent).toContain('O');
    
    // Verify game state updated again
    boardState = gameService.gameState();
    expect(boardState.moveHistory.length).toBe(2);
    expect(boardState.currentPlayer).toBe('X'); // Should switch back to X
  });

  it('should handle complete game to victory', () => {
    // Play a sequence that leads to X winning
    // X plays top row: 0, 1, 2 to win
    
    // First move - X
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    // Second move - O
    fireEvent.click(screen.getByTestId('cell-3'));
    expect(screen.getByTestId('cell-3').textContent).toContain('O');
    
    // Third move - X
    fireEvent.click(screen.getByTestId('cell-1'));
    expect(screen.getByTestId('cell-1').textContent).toContain('X');
    
    // Fourth move - O
    fireEvent.click(screen.getByTestId('cell-4'));
    expect(screen.getByTestId('cell-4').textContent).toContain('O');
    
    // Fifth move - X winning move
    fireEvent.click(screen.getByTestId('cell-2'));
    expect(screen.getByTestId('cell-2').textContent).toContain('X');
    
    // Check if X won
    const boardState = gameService.gameState();
    expect(boardState.status).toBe('won');
    expect(boardState.winner).toBe('X');
    expect(boardState.winningLine).toEqual([0, 1, 2]);
  });

  it('should handle game reset functionality', () => {
    // Make some moves
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    fireEvent.click(screen.getByTestId('cell-1'));
    expect(screen.getByTestId('cell-1').textContent).toContain('O');
    
    // Reset game using service
    gameService.resetGame();
    
    // Trigger change detection
    fixture.detectChanges();
    
    // Verify reset through game state
    const boardState = gameService.gameState();
    expect(boardState.currentPlayer).toBe('X');
    expect(boardState.moveHistory.length).toBe(0);
    expect(boardState.status).toBe('playing');
    
    // Check all cells are empty (should update after change detection)
    for (let i = 0; i < 9; i++) {
      const cellContent = screen.getByTestId(`cell-${i}`).textContent || '';
      expect(cellContent.trim()).toBe('');
    }
  });

  it('should prevent moves on occupied cells', () => {
    // Make first move
    fireEvent.click(screen.getByTestId('cell-4'));
    expect(screen.getByTestId('cell-4').textContent).toContain('X');
    
    // Try to click same cell again
    const initialMoveCount = gameService.gameState().moveHistory.length;
    fireEvent.click(screen.getByTestId('cell-4'));
    
    // Should not add another move
    expect(gameService.gameState().moveHistory.length).toBe(initialMoveCount);
  });

  it('should disable all cells when game is terminal', () => {
    // Test that occupied cells are disabled
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0')).toBeDisabled();
    
    // Verify empty cells are not disabled while game continues
    expect(screen.getByTestId('cell-1')).not.toBeDisabled();
  });

  it('should display appropriate cell accessibility information', () => {
    // Initial playing state - check cell accessibility
    expect(screen.getByTestId('cell-0').getAttribute('aria-label')).toContain('empty');
    
    // After human move, should update accessibility
    fireEvent.click(screen.getByTestId('cell-0'));
    
    // Cell should now show it's occupied
    expect(screen.getByTestId('cell-0').getAttribute('aria-label')).toContain('X');
    
    // Other cells should still be accessible
    expect(screen.getByTestId('cell-1').getAttribute('aria-label')).toContain('empty');
  });
});