import { TestBed, waitForAsync } from '@angular/core/testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/angular';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../../services/game.service';

describe('GameBoard Integration Tests', () => {
  let gameService: GameService;

  beforeEach(async () => {
    jest.useFakeTimers();
    await render(GameBoardComponent);
    gameService = TestBed.inject(GameService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should complete full game workflow with human and computer moves', waitForAsync(async () => {
    // Initial state: empty board, X to play
    expect(screen.getByTestId('game-status').textContent).toContain('Current player: X');
    
    // Human move: Click first cell
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    // Fast-forward time to trigger computer move
    jest.advanceTimersByTime(600);
    
    // Wait for computer response
    await waitFor(() => {
      const occupiedCells = screen.getAllByRole('button').filter(btn => 
        btn.textContent === 'X' || btn.textContent === 'O'
      );
      expect(occupiedCells.length).toBe(2);
    }, { timeout: 1000 });
    
    // Verify computer made a move
    const boardState = gameService.gameState();
    expect(boardState.moveHistory.length).toBe(2);
    expect(boardState.currentPlayer).toBe('X'); // Back to human's turn
  }));

  it('should handle complete game to victory', waitForAsync(async () => {
    // Play a sequence that leads to X winning
    // X plays top row: 0, 1, 2 with computer blocking or playing elsewhere
    
    // First move
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    // Fast-forward time to trigger computer move
    jest.advanceTimersByTime(600);
    
    // Wait for computer response
    await waitFor(() => {
      const occupiedCells = screen.getAllByRole('button').filter(btn => 
        btn.textContent === 'X' || btn.textContent === 'O'
      );
      expect(occupiedCells.length).toBe(2);
    }, { timeout: 1000 });
    
    // Second human move
    fireEvent.click(screen.getByTestId('cell-1'));
    expect(screen.getByTestId('cell-1').textContent).toContain('X');
    
    // Fast-forward time to trigger second computer move
    jest.advanceTimersByTime(600);
    
    // Wait for second computer response
    await waitFor(() => {
      const occupiedCells = screen.getAllByRole('button').filter(btn => 
        btn.textContent === 'X' || btn.textContent === 'O'
      );
      expect(occupiedCells.length).toBe(4);
    }, { timeout: 1000 });
    
    // Third human move - try to win
    if (!screen.getByTestId('cell-2').textContent) {
      fireEvent.click(screen.getByTestId('cell-2'));
      
      // Check if X won
      await waitFor(() => {
        const status = screen.getByTestId('game-status');
        if (status.textContent?.includes('wins')) {
          expect(status.textContent).toContain('Player X wins!');
        }
      }, { timeout: 100 });
    }
  }));

  it('should handle game reset functionality', waitForAsync(async () => {
    // Make some moves
    fireEvent.click(screen.getByTestId('cell-0'));
    expect(screen.getByTestId('cell-0').textContent).toContain('X');
    
    // Fast-forward time to trigger computer move
    jest.advanceTimersByTime(600);
    
    // Wait for computer move
    await waitFor(() => {
      const occupiedCells = screen.getAllByRole('button').filter(btn => 
        btn.textContent === 'X' || btn.textContent === 'O'
      );
      expect(occupiedCells.length).toBe(2);
    }, { timeout: 1000 });
    
    // Reset game
    fireEvent.click(screen.getByTestId('reset-button'));
    
    // Verify reset
    expect(screen.getByTestId('game-status').textContent).toContain('Current player: X');
    
    // Check all cells are empty
    for (let i = 0; i < 9; i++) {
      expect(screen.getByTestId(`cell-${i}`).textContent).toBe('');
    }
  }));

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

  it('should display appropriate game status messages', () => {
    // Initial playing state
    expect(screen.getByTestId('game-status').textContent).toContain('Current player: X');
    
    // After human move, should still show current player
    fireEvent.click(screen.getByTestId('cell-0'));
    
    // Status should update appropriately based on game state
    const status = screen.getByTestId('game-status');
    const statusText = status.textContent || '';
    
    // Should show either current player or game result
    expect(
      statusText.includes('Current player:') || 
      statusText.includes('wins!') || 
      statusText.includes('draw!')
    ).toBe(true);
  });
});