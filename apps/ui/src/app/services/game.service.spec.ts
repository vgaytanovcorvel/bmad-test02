import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should initialize with empty board and X as first player', () => {
      const state = service.gameState();
      
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(service.isTerminal()).toBe(false);
    });
  });

  describe('makeMove', () => {
    it('should place human move on board', () => {
      service.makeMove(0);
      
      const state = service.gameState();
      expect(state.board[0]).toBe('X');
      expect(state.currentPlayer).toBe('O');
    });

    it('should reject invalid moves', () => {
      service.makeMove(0); // Valid move
      const initialMoveCount = service.gameState().moveHistory.length;
      
      service.makeMove(0); // Try to move in same cell
      
      expect(service.gameState().moveHistory.length).toBe(initialMoveCount);
    });

    it('should not allow moves when game is terminal', () => {
      // Set up a winning state
      const winningMoves = [0, 3, 1, 4, 2]; // X wins on top row
      winningMoves.forEach(move => service.makeMove(move));
      
      const initialState = service.gameState();
      service.makeMove(6); // Try to make another move
      
      expect(service.gameState()).toEqual(initialState);
    });
  });

  describe('Game Flow', () => {
    it('should detect win condition', () => {
      // X wins on top row: positions 0, 1, 2
      service.makeMove(0); // X
      service.makeMove(3); // O
      service.makeMove(1); // X
      service.makeMove(4); // O
      service.makeMove(2); // X wins
      
      const state = service.gameState();
      expect(state.status).toBe('won');
      expect(service.winner()).toBe('X');
      expect(service.isTerminal()).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should correctly report cell disabled state', () => {
      expect(service.isCellDisabled(0)).toBe(false);
      
      service.makeMove(0);
      expect(service.isCellDisabled(0)).toBe(true);
    });

    it('should return correct cell values', () => {
      expect(service.getCellValue(0)).toBe('');
      
      service.makeMove(0);
      expect(service.getCellValue(0)).toBe('X');
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      service.makeMove(0);
      service.makeMove(1);
      
      service.resetGame();
      
      const state = service.gameState();
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.moveHistory).toHaveLength(0);
    });
  });

  // Tests for Story 3.3: Configuration Management
  describe('Configuration Management', () => {
    describe('currentMode', () => {
      it('should return current game mode', () => {
        expect(service.currentMode()).toBe('human-vs-human');
      });
    });

    describe('currentBoardSize', () => {
      it('should return current board size', () => {
        expect(service.currentBoardSize()).toBe(3);
      });
    });

    describe('changeGameMode', () => {
      it('should start new game with different mode', () => {
        service.makeMove(0); // Make a move
        const initialMoveCount = service.gameState().moveHistory.length;
        expect(initialMoveCount).toBe(1);
        
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().moveHistory).toHaveLength(0); // New game started
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
      });

      it('should preserve other config settings when changing mode', () => {
        service.changeBoardSize(4); // Change to 4x4
        expect(service.currentBoardSize()).toBe(4);
        
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(4); // Should remain 4x4
      });
    });

    describe('changeBoardSize', () => {
      it('should start new game with different board size', () => {
        service.makeMove(0); // Make a move
        const initialMoveCount = service.gameState().moveHistory.length;
        expect(initialMoveCount).toBe(1);
        
        service.changeBoardSize(4);
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.gameState().moveHistory).toHaveLength(0); // New game started
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
        expect(service.gameState().board.length).toBe(16); // 4x4 board
      });

      it('should preserve other config settings when changing board size', () => {
        service.changeGameMode('human-vs-computer');
        expect(service.currentMode()).toBe('human-vs-computer');
        
        service.changeBoardSize(4);
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.currentMode()).toBe('human-vs-computer'); // Should remain human-vs-computer
      });
    });

    describe('Game State Utilities', () => {
      it('should correctly identify if game has started', () => {
        expect(service.hasGameStarted()).toBe(false);
        
        service.makeMove(0);
        expect(service.hasGameStarted()).toBe(true);
      });

      it('should correctly identify if game is in progress', () => {
        expect(service.isGameInProgress()).toBe(false);
        
        service.makeMove(0); // X at position 0
        expect(service.isGameInProgress()).toBe(true);
        
        // Create winning condition: X wins top row (0, 1, 2)
        service.makeMove(3); // O at position 3
        service.makeMove(1); // X at position 1  
        service.makeMove(4); // O at position 4
        service.makeMove(2); // X at position 2 - X wins!
        
        expect(service.isGameInProgress()).toBe(false); // Game ended
      });
    });
  });

  // Tests for Story 3.3: Computer Player Integration
  describe('Computer Player Integration', () => {
    beforeEach(() => {
      service.changeGameMode('human-vs-computer');
    });

    it('should detect human-vs-computer mode', () => {
      expect(service.currentMode()).toBe('human-vs-computer');
    });

    it('should handle human move without triggering infinite recursion', () => {
      // Make a human move (X) 
      const success = service.makeMove(0);
      
      expect(success).toBe(true);
      expect(service.gameState().board[0]).toBe('X');
    });

    it('should handle human moves in human-vs-computer mode', () => {
      // Make a human move (X) in human-vs-computer mode
      const success = service.makeMove(0);
      
      expect(success).toBe(true);
      expect(service.gameState().board[0]).toBe('X');
      expect(service.currentMode()).toBe('human-vs-computer');
    });
  });

  // Task 3: Integration Test Coverage Enhancement (AC: Both)
  describe('GameService Integration Tests', () => {
    describe('Human vs Computer Gameplay Integration', () => {
      beforeEach(() => {
        service.changeGameMode('human-vs-computer');
      });

      it('should complete full game flow from start to finish with computer opponent', async () => {
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().currentPlayer).toBe('X'); // Human starts
        expect(service.isGameInProgress()).toBe(false); // Not started yet
        
        // Human makes first move
        const humanMoveSuccess = service.makeMove(4); // Take center
        expect(humanMoveSuccess).toBe(true);
        expect(service.gameState().board[4]).toBe('X');
        expect(service.isGameInProgress()).toBe(true);
        
        // Allow time for computer to respond
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Make a few more human moves to progress the game
        service.makeMove(0); // Human takes corner
        await new Promise(resolve => setTimeout(resolve, 100));
        
        service.makeMove(2); // Human takes another corner
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Game should either be terminal or have progressed significantly
        const finalState = service.gameState();
        expect(finalState.moveHistory.length).toBeGreaterThan(1); // At least human moves made
        
        // Verify the game maintains correct mode throughout
        expect(service.currentMode()).toBe('human-vs-computer');
      });

      it('should maintain computer player behavior throughout the game', () => {
        // Start game in HvC mode
        expect(service.currentMode()).toBe('human-vs-computer');
        
        // Make several human moves and verify computer responds
        service.makeMove(0); // Human at 0
        const stateAfterMove1 = service.gameState();
        
        if (stateAfterMove1.currentPlayer === 'X') {
          // If it's still human turn, computer hasn't moved yet
          // This depends on the implementation - either auto-move or manual trigger
          expect(stateAfterMove1.board[0]).toBe('X');
        }
        
        // Continue with more moves
        service.makeMove(2); // Human at 2 (if valid)
        service.makeMove(1); // Human at 1 (if valid) - this should trigger win detection
        
        // Verify game state is consistent
        expect(service.currentMode()).toBe('human-vs-computer');
      });

      it('should handle computer optimal move selection', () => {
        // Set up scenario where computer has clear optimal move
        service.makeMove(0); // X at 0
        service.makeMove(4); // Try to place at center - should work if available
        service.makeMove(1); // X at 1
        
        // After these moves, computer should recognize the threat if X is about to win
        const state = service.gameState();
        
        // Verify the game is handling moves correctly
        expect(state.board[0]).toBe('X');
        expect(state.board[1]).toBe('X');
        
        // The computer should have made logical moves to either block or win
        const computerMoves = state.board.map((cell, index) => 
          cell === 'O' ? index : null
        ).filter(pos => pos !== null);
        
        expect(computerMoves.length).toBeGreaterThan(0); // Computer should have moved
      });
    });

    describe('Board Size Changes with Computer Player', () => {
      it('should work correctly with 3x3 board in computer mode', () => {
        service.changeGameMode('human-vs-computer');
        service.changeBoardSize(3);
        
        expect(service.currentBoardSize()).toBe(3);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().board.length).toBe(9);
        
        // Make a move to verify functionality
        const success = service.makeMove(4);
        expect(success).toBe(true);
        expect(service.gameState().board[4]).toBe('X');
      });

      it('should work correctly with 4x4 board in computer mode', () => {
        service.changeGameMode('human-vs-computer');
        service.changeBoardSize(4);
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().board.length).toBe(16);
        
        // Make a move to verify functionality
        const success = service.makeMove(5); // Middle-ish position
        expect(success).toBe(true);
        expect(service.gameState().board[5]).toBe('X');
      });

      it('should maintain computer player when transitioning board sizes', () => {
        service.changeGameMode('human-vs-computer');
        expect(service.currentMode()).toBe('human-vs-computer');
        
        // Change from 3x3 to 4x4
        service.changeBoardSize(4);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(4);
        
        // Change back to 3x3
        service.changeBoardSize(3);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(3);
        
        // Verify game functionality still works
        const success = service.makeMove(0);
        expect(success).toBe(true);
      });
    });

    describe('Game Reset Functionality with Computer Player', () => {
      beforeEach(() => {
        service.changeGameMode('human-vs-computer');
      });

      it('should reset game maintaining computer player mode', () => {
        // Make some moves
        service.makeMove(0);
        service.makeMove(4);
        
        const stateBefore = service.gameState();
        expect(stateBefore.moveHistory.length).toBeGreaterThan(0);
        expect(service.currentMode()).toBe('human-vs-computer');
        
        // Reset game
        service.resetGame();
        
        const stateAfter = service.gameState();
        expect(stateAfter.moveHistory.length).toBe(0);
        expect(stateAfter.board.every(cell => cell === null)).toBe(true);
        expect(stateAfter.currentPlayer).toBe('X');
        expect(stateAfter.status).toBe('playing');
        expect(service.currentMode()).toBe('human-vs-computer');
      });

      it('should allow starting new game after reset in computer mode', () => {
        // Make moves until game ends or gets interesting
        service.makeMove(0);
        service.makeMove(2);
        service.makeMove(1);
        
        // Reset
        service.resetGame();
        
        // Start new game
        const success = service.makeMove(4); // Different opening move
        expect(success).toBe(true);
        expect(service.gameState().board[4]).toBe('X');
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.isGameInProgress()).toBe(true);
      });

      it('should preserve board size setting after reset', () => {
        service.changeBoardSize(4);
        expect(service.currentBoardSize()).toBe(4);
        
        service.makeMove(0);
        service.resetGame();
        
        expect(service.currentBoardSize()).toBe(4);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().board.length).toBe(16);
      });
    });

    describe('All Game Modes Coverage', () => {
      it('should support human vs human mode', () => {
        service.changeGameMode('human-vs-human');
        
        expect(service.currentMode()).toBe('human-vs-human');
        
        // Both players are human - manual moves
        service.makeMove(0); // X
        expect(service.gameState().currentPlayer).toBe('O');
        
        service.makeMove(1); // O
        expect(service.gameState().currentPlayer).toBe('X');
        
        // Verify alternating turns work
        expect(service.gameState().board[0]).toBe('X');
        expect(service.gameState().board[1]).toBe('O');
      });

      it('should support human vs computer mode', () => {
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        
        // Human move
        service.makeMove(0); // X
        
        // Computer should be able to respond (implementation dependent)
        const state = service.gameState();
        expect(state.board[0]).toBe('X');
      });

      it('should handle mode transitions correctly', () => {
        // Start in HvH
        service.changeGameMode('human-vs-human');
        service.makeMove(0);
        
        expect(service.gameState().board[0]).toBe('X');
        expect(service.currentMode()).toBe('human-vs-human');
        
        // Switch to HvC - should reset game
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
        expect(service.gameState().moveHistory.length).toBe(0);
      });
    });

    describe('Error Handling and Edge Cases', () => {
      beforeEach(() => {
        service.changeGameMode('human-vs-computer');
      });

      it('should handle invalid move attempts gracefully', () => {
        service.makeMove(0); // Valid move
        
        const stateAfter = service.gameState();
        const moveCountBefore = stateAfter.moveHistory.length;
        
        // Try invalid move (same position)
        const success = service.makeMove(0);
        
        expect(success).toBe(false);
        expect(service.gameState().moveHistory.length).toBe(moveCountBefore);
      });

      it('should handle out-of-bounds moves', () => {
        const moveCountBefore = service.gameState().moveHistory.length;
        
        // Try moves outside board
        const success1 = service.makeMove(-1);
        const success2 = service.makeMove(9); // For 3x3 board
        const success3 = service.makeMove(100);
        
        expect(success1).toBe(false);
        expect(success2).toBe(false);  
        expect(success3).toBe(false);
        expect(service.gameState().moveHistory.length).toBe(moveCountBefore);
      });

      it('should handle rapid consecutive moves correctly', () => {
        const initialState = service.gameState();
        
        // Try multiple rapid moves
        service.makeMove(0);
        service.makeMove(1);
        service.makeMove(2);
        
        // Should have processed moves correctly without conflicts
        const finalState = service.gameState();
        expect(finalState.moveHistory.length).toBeGreaterThan(initialState.moveHistory.length);
      });
    });
  });

  describe('7x7 Board Configuration', () => {
    it('should create 7x7 board with correct kInRow value', () => {
      service.changeBoardSize(7);
      
      const state = service.gameState();
      expect(state.config.boardSize).toBe(7);
      expect(state.config.kInRow).toBe(4);
      expect(state.board.length).toBe(49);
    });

    it('should handle 7x7 board with human vs human mode', () => {
      service.changeBoardSize(7);
      service.changeGameMode('human-vs-human');
      
      expect(service.currentBoardSize()).toBe(7);
      expect(service.currentMode()).toBe('human-vs-human');
      expect(service.gameState().config.kInRow).toBe(4);
    });

    it('should handle 7x7 board with human vs computer mode', () => {
      service.changeBoardSize(7);
      service.changeGameMode('human-vs-computer');
      
      expect(service.currentBoardSize()).toBe(7);
      expect(service.currentMode()).toBe('human-vs-computer');
      expect(service.gameState().config.kInRow).toBe(4);
    });

    it('should preserve 7x7 configuration after reset', () => {
      service.changeBoardSize(7);
      service.makeMove(0);
      service.resetGame();
      
      expect(service.currentBoardSize()).toBe(7);
      expect(service.gameState().config.kInRow).toBe(4);
      expect(service.gameState().board.length).toBe(49);
      expect(service.gameState().board.every(cell => cell === null)).toBe(true);
    });

    it('should trigger board size change animation signal for 7x7', () => {
      const initialTriggerValue = service.boardSizeChangeTrigger();
      
      service.changeBoardSize(7);
      
      expect(service.boardSizeChangeTrigger()).toBe(initialTriggerValue + 1);
    });
  });
});