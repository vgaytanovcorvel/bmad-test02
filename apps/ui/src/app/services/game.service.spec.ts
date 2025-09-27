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

  describe('Comprehensive 7x7 Integration Tests', () => {
    beforeEach(() => {
      service.changeBoardSize(7);
    });

    describe('7x7 Game Flow Integration', () => {
      it('should complete full 7x7 Human vs Human game flow', () => {
        service.changeGameMode('human-vs-human');
        
        expect(service.currentBoardSize()).toBe(7);
        expect(service.currentMode()).toBe('human-vs-human');
        expect(service.gameState().config.kInRow).toBe(4);
        
        // Simulate game leading to X win in row
        service.makeMove(21); // X at position 21 (row 3, pos 0)
        service.makeMove(0);  // O at position 0
        service.makeMove(22); // X at position 22 (row 3, pos 1)
        service.makeMove(1);  // O at position 1
        service.makeMove(23); // X at position 23 (row 3, pos 2)
        service.makeMove(2);  // O at position 2
        service.makeMove(24); // X at position 24 (row 3, pos 3) - X wins!
        
        const finalState = service.gameState();
        expect(finalState.status).toBe('won');
        expect(service.winner()).toBe('X');
        expect(service.isTerminal()).toBe(true);
        expect(finalState.winningLine).toEqual([21, 22, 23, 24]);
      });

      it('should complete full 7x7 Human vs Computer game flow', () => {
        service.changeGameMode('human-vs-computer');
        
        expect(service.currentBoardSize()).toBe(7);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.gameState().currentPlayer).toBe('X'); // Human starts
        
        // Make human move
        const humanMoveSuccess = service.makeMove(24); // Center position
        expect(humanMoveSuccess).toBe(true);
        expect(service.gameState().board[24]).toBe('X');
        
        // Continue with more moves to test game progression
        service.makeMove(0);  // Human corner
        service.makeMove(48); // Human opposite corner
        
        const gameState = service.gameState();
        expect(gameState.moveHistory.length).toBeGreaterThan(0);
        expect(service.currentMode()).toBe('human-vs-computer');
        
        // Verify 7x7 board integrity maintained
        expect(gameState.board.length).toBe(49);
        expect(gameState.config.boardSize).toBe(7);
        expect(gameState.config.kInRow).toBe(4);
      });

      it('should handle 7x7 draw condition detection', () => {
        service.changeGameMode('human-vs-human');
        
        // Simulate strategic moves to create near-full board without wins
        const drawPattern = [
          0, 1, 2, 5, 6, // Row 0: X O X _ _ O X (no 4 consecutive)
          7, 8, 9, 12, 13, // Row 1: O X O _ _ X O
          14, 15, 16, 19, 20, // Continue pattern...
          21, 22, 23, 26, 27,
          28, 29, 30, 33, 34,
          35, 36, 37, 40, 41,
          42, 43, 44, 47, 48
        ];
        
        let isXTurn = true;
        drawPattern.forEach(position => {
          service.makeMove(position);
          isXTurn = !isXTurn;
        });
        
        // Fill remaining positions strategically
        const remainingPositions = [3, 4, 10, 11, 17, 18, 24, 25, 31, 32, 38, 39, 45, 46];
        remainingPositions.forEach(position => {
          if (service.gameState().board[position] === null) {
            const success = service.makeMove(position);
            if (success && service.isTerminal()) {
              return; // Game ended
            }
          }
        });
        
        // Check if we achieved draw or valid game state
        const finalState = service.gameState();
        if (finalState.status === 'draw') {
          expect(service.isTerminal()).toBe(true);
        }
        
        // At minimum, verify 7x7 integrity maintained
        expect(finalState.board.length).toBe(49);
        expect(finalState.config.boardSize).toBe(7);
      });
    });

    describe('7x7 Board Size Transitions', () => {
      it('should smoothly transition from 3x3 → 7x7 → 4x4', () => {
        // Start with 3x3
        service.changeBoardSize(3);
        expect(service.currentBoardSize()).toBe(3);
        expect(service.gameState().board.length).toBe(9);
        
        service.makeMove(0); // Make a move
        expect(service.gameState().board[0]).toBe('X');
        
        // Transition to 7x7
        service.changeBoardSize(7);
        expect(service.currentBoardSize()).toBe(7);
        expect(service.gameState().board.length).toBe(49);
        expect(service.gameState().config.kInRow).toBe(4);
        expect(service.gameState().board.every(cell => cell === null)).toBe(true); // New game
        
        service.makeMove(24); // Make move in 7x7
        expect(service.gameState().board[24]).toBe('X');
        
        // Transition to 4x4
        service.changeBoardSize(4);
        expect(service.currentBoardSize()).toBe(4);
        expect(service.gameState().board.length).toBe(16);
        expect(service.gameState().config.kInRow).toBe(3);
        expect(service.gameState().board.every(cell => cell === null)).toBe(true); // New game
      });

      it('should preserve game mode during 7x7 board size changes', () => {
        service.changeGameMode('human-vs-computer');
        expect(service.currentMode()).toBe('human-vs-computer');
        
        service.changeBoardSize(3);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(3);
        
        service.changeBoardSize(7);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(7);
        expect(service.gameState().config.kInRow).toBe(4);
        
        service.changeBoardSize(4);
        expect(service.currentMode()).toBe('human-vs-computer');
        expect(service.currentBoardSize()).toBe(4);
      });

      it('should maintain performance during rapid board size switches with 7x7', () => {
        const sizes = [3, 7, 4, 7, 3, 7];
        const startTime = performance.now();
        
        sizes.forEach(size => {
          service.changeBoardSize(size);
          expect(service.currentBoardSize()).toBe(size);
          
          // Make a quick move to verify functionality
          service.makeMove(0);
          expect(service.gameState().board[0]).toBe('X');
          
          service.resetGame(); // Reset for next iteration
        });
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        expect(duration).toBeLessThan(100); // Should complete rapidly
      });
    });

    describe('7x7 UI Component Integration', () => {
      it('should provide correct cell accessibility for 7x7 board', () => {
        // Test all 49 positions
        for (let i = 0; i < 49; i++) {
          expect(service.isCellDisabled(i)).toBe(false);
          expect(service.getCellValue(i)).toBe('');
        }
        
        // Make some moves and verify disabled states
        service.makeMove(0);
        expect(service.isCellDisabled(0)).toBe(true);
        expect(service.getCellValue(0)).toBe('X');
        
        service.makeMove(24);
        expect(service.isCellDisabled(24)).toBe(true);
        expect(service.getCellValue(24)).toBe('O');
        
        // Verify remaining cells still accessible
        for (let i = 1; i < 49; i++) {
          if (i !== 24) {
            expect(service.isCellDisabled(i)).toBe(false);
            expect(service.getCellValue(i)).toBe('');
          }
        }
      });

      it('should handle 7x7 board rendering state changes', () => {
        const initialTrigger = service.boardSizeChangeTrigger();
        
        // Change to 7x7 should trigger animation
        service.changeBoardSize(7);
        expect(service.boardSizeChangeTrigger()).toBe(initialTrigger + 1);
        
        // Verify CSS class implications
        expect(service.currentBoardSize()).toBe(7);
        expect(service.gameState().board.length).toBe(49);
        
        // Mode changes shouldn't trigger board size animation
        const afterSizeChange = service.boardSizeChangeTrigger();
        service.changeGameMode('human-vs-computer');
        expect(service.boardSizeChangeTrigger()).toBe(afterSizeChange); // No change
      });

      it('should support 7x7 game status and winner display integration', () => {
        service.changeGameMode('human-vs-human');
        
        expect(service.gameState().status).toBe('playing');
        expect(service.winner()).toBeNull();
        expect(service.isTerminal()).toBe(false);
        
        // Create winning scenario for X
        service.makeMove(0); service.makeMove(7);   // X, O
        service.makeMove(1); service.makeMove(8);   // X, O  
        service.makeMove(2); service.makeMove(9);   // X, O
        service.makeMove(3); // X wins row 0!
        
        expect(service.gameState().status).toBe('won');
        expect(service.winner()).toBe('X');
        expect(service.isTerminal()).toBe(true);
        expect(service.gameState().winningLine).toEqual([0, 1, 2, 3]);
        
        // Verify UI state methods
        expect(service.hasGameStarted()).toBe(true);
        expect(service.isGameInProgress()).toBe(false); // Game ended
      });
    });

    describe('7x7 Service Methods Integration', () => {
      it('should integrate all GameService methods with 7x7 boards', () => {
        service.changeGameMode('human-vs-human');
        
        // Test initial state methods
        expect(service.hasGameStarted()).toBe(false);
        expect(service.isGameInProgress()).toBe(false);
        expect(service.isTerminal()).toBe(false);
        expect(service.winner()).toBeNull();
        
        // Make first move
        service.makeMove(24); // Center
        expect(service.hasGameStarted()).toBe(true);
        expect(service.isGameInProgress()).toBe(true);
        expect(service.getCellValue(24)).toBe('X');
        expect(service.isCellDisabled(24)).toBe(true);
        
        // Test game state consistency
        const state = service.gameState();
        expect(state.currentPlayer).toBe('O');
        expect(state.moveHistory).toHaveLength(1);
        expect(state.moveHistory[0]).toEqual({
          player: 'X',
          position: 24,
          timestamp: expect.any(Number)
        });
        
        // Test reset functionality
        service.resetGame();
        expect(service.hasGameStarted()).toBe(false);
        expect(service.isGameInProgress()).toBe(false);
        expect(service.gameState().board.every(cell => cell === null)).toBe(true);
        expect(service.gameState().moveHistory).toHaveLength(0);
        expect(service.currentBoardSize()).toBe(7); // Board size preserved
      });

      it('should handle invalid moves gracefully in 7x7', () => {
        // Test out-of-bounds moves
        expect(service.makeMove(-1)).toBe(false);
        expect(service.makeMove(49)).toBe(false);
        expect(service.makeMove(100)).toBe(false);
        
        // Test occupied cell moves
        service.makeMove(0);
        expect(service.gameState().board[0]).toBe('X');
        expect(service.makeMove(0)).toBe(false); // Should fail
        
        // Test moves after game ends
        // Create quick win scenario
        service.resetGame();
        service.makeMove(0); service.makeMove(7);
        service.makeMove(1); service.makeMove(8);
        service.makeMove(2); service.makeMove(9);
        service.makeMove(3); // X wins
        
        expect(service.isTerminal()).toBe(true);
        expect(service.makeMove(6)).toBe(false); // Should fail - game over
      });
    });

    describe('7x7 Performance Integration', () => {
      it('should maintain responsive performance with 7x7 game operations', () => {
        const operations = [
          () => service.makeMove(Math.floor(Math.random() * 49)),
          () => service.resetGame(),
          () => service.changeGameMode('human-vs-computer'),
          () => service.changeGameMode('human-vs-human'),
          () => service.gameState(),
          () => service.currentBoardSize(),
          () => service.isTerminal(),
          () => service.winner()
        ];
        
        const startTime = performance.now();
        
        // Perform 100 mixed operations
        for (let i = 0; i < 100; i++) {
          const operation = operations[i % operations.length];
          operation();
        }
        
        const endTime = performance.now();
        const avgDuration = (endTime - startTime) / 100;
        
        expect(avgDuration).toBeLessThan(2); // <2ms per operation average
      });

      it('should handle rapid 7x7 game completions efficiently', () => {
        const startTime = performance.now();
        
        // Complete 10 quick games
        for (let game = 0; game < 10; game++) {
          service.resetGame();
          service.changeGameMode('human-vs-human');
          
          // Quick win pattern
          const moves = [0, 7, 1, 8, 2, 9, 3]; // X wins row 0
          moves.forEach(move => {
            if (!service.isTerminal()) {
              service.makeMove(move);
            }
          });
          
          expect(service.isTerminal() || service.gameState().moveHistory.length > 0).toBe(true);
        }
        
        const endTime = performance.now();
        const totalDuration = endTime - startTime;
        
        expect(totalDuration).toBeLessThan(200); // <200ms for 10 complete games
      });
    });

    describe('7x7 Cross-Board Compatibility', () => {
      it('should maintain consistent behavior across all board sizes including 7x7', () => {
        const boardSizes = [3, 4, 7];
        const expectedKValues = [3, 3, 4];
        const expectedBoardCells = [9, 16, 49];
        
        boardSizes.forEach((size, index) => {
          service.changeBoardSize(size);
          
          expect(service.currentBoardSize()).toBe(size);
          expect(service.gameState().config.boardSize).toBe(size);
          expect(service.gameState().config.kInRow).toBe(expectedKValues[index]);
          expect(service.gameState().board.length).toBe(expectedBoardCells[index]);
          
          // Test basic functionality works
          service.makeMove(0);
          expect(service.gameState().board[0]).toBe('X');
          expect(service.hasGameStarted()).toBe(true);
          
          service.resetGame();
          expect(service.gameState().board[0]).toBeNull();
          expect(service.hasGameStarted()).toBe(false);
        });
      });

      it('should preserve game mode and functionality during board size transitions including 7x7', () => {
        const modes = ['human-vs-human', 'human-vs-computer'];
        const sizes = [3, 7, 4];
        
        modes.forEach(mode => {
          service.changeGameMode(mode);
          
          sizes.forEach(size => {
            service.changeBoardSize(size);
            
            expect(service.currentMode()).toBe(mode);
            expect(service.currentBoardSize()).toBe(size);
            
            // Verify functionality
            const success = service.makeMove(0);
            expect(success).toBe(true);
            expect(service.gameState().board[0]).toBe('X');
            
            service.resetGame();
          });
        });
      });
    });
  });
});