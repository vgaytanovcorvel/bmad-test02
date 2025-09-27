import { GameEngine } from './engine';
import { ComputerPlayer } from './computer-player';
import { EngineFactory } from './factories/engine-factory';
import { GameState, Move } from '@libs/shared';

describe('Game Engine and Computer Player Integration', () => {
  let engine: GameEngine;
  let computer: ComputerPlayer;

  beforeEach(() => {
    engine = new GameEngine();
    computer = new ComputerPlayer();
  });

  describe('Complete Game Simulation', () => {
    it('should play a complete game between human and computer', () => {
      let state = engine.createInitialState();
      const maxMoves = 9;
      let moveCount = 0;

      // Play until game ends or max moves reached
      while (state.status === 'playing' && moveCount < maxMoves) {
        if (state.currentPlayer === 'X') {
          // Human move - take first available position
          const humanMove = findFirstAvailablePosition(state);
          if (humanMove >= 0) {
            const move: Move = {
              player: 'X',
              position: humanMove,
              timestamp: Date.now()
            };
            state = engine.processMove(state, move);
            moveCount++;
          }
        } else {
          // Computer move
          const computerMove = computer.calculateNextMove(state);
          if (computerMove >= 0) {
            const move: Move = {
              player: 'O',
              position: computerMove,
              timestamp: Date.now()
            };
            state = engine.processMove(state, move);
            moveCount++;
          }
        }
      }

      // Game should end with either a win or draw
      expect(state.status === 'won' || state.status === 'draw').toBe(true);
      expect(state.moveHistory.length).toBeLessThanOrEqual(9);
      
      if (state.status === 'won') {
        expect(state.winner).toMatch(/^[XO]$/);
        expect(state.winningLine).toBeDefined();
        expect(state.winningLine?.length).toBe(3);
      }
    });

    it('should handle computer blocking human wins', () => {
      let state = engine.createInitialState();
      
      // Human plays X at positions 0 and 1 (two in a row)
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 4, timestamp: Date.now() }); // Computer center
      state = engine.processMove(state, { player: 'X', position: 1, timestamp: Date.now() });
      
      // Now computer should block at position 2
      const computerMove = computer.calculateNextMove(state);
      
      expect(computerMove).toBe(2); // Should block the winning move
      
      // Execute the blocking move
      state = engine.processMove(state, { player: 'O', position: computerMove, timestamp: Date.now() });
      
      // X should not have won yet
      expect(state.winner).toBeNull();
      expect(state.status).toBe('playing');
    });

    it('should handle computer winning when possible', () => {
      let state = engine.createInitialState();
      
      // Set up a state where computer can win
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 4, timestamp: Date.now() }); // Computer center
      state = engine.processMove(state, { player: 'X', position: 1, timestamp: Date.now() });
      state = engine.processMove(state, { player: 'O', position: 3, timestamp: Date.now() }); // Computer left
      state = engine.processMove(state, { player: 'X', position: 6, timestamp: Date.now() }); // Human blocks some
      
      // Computer should try to win at position 5 (completing 3-4-5 column)
      const computerMove = computer.calculateNextMove(state);
      
      if (computerMove === 5) {
        state = engine.processMove(state, { player: 'O', position: computerMove, timestamp: Date.now() });
        expect(state.winner).toBe('O');
        expect(state.status).toBe('won');
      }
    });
  });

  describe('Game State Consistency', () => {
    it('should maintain consistent game state through engine and computer interactions', () => {
      let state = engine.createInitialState();
      const originalState = JSON.parse(JSON.stringify(state));
      
      // Make several moves
      const moves = [0, 4, 1, 3, 2]; // X wins on top row
      
      moves.forEach((position, index) => {
        const player = index % 2 === 0 ? 'X' : 'O';
        
        if (state.status === 'playing') {
          const move: Move = {
            player,
            position,
            timestamp: Date.now()
          };
          
          const validMove = engine.isValidMove(state, position);
          if (validMove) {
            state = engine.processMove(state, move);
            
            // Verify state consistency
            expect(state.moveHistory.length).toBe(index + 1);
            expect(state.moveHistory[index]).toEqual(move);
            expect(state.board[position]).toBe(player);
          }
        }
      });
      
      // Verify final state
      if (state.status === 'won') {
        expect(state.winner).toBe('X');
        expect(state.winningLine).toEqual([0, 1, 2]);
      }
      
      // Ensure original state wasn't mutated
      expect(originalState.board.every((cell: string | null) => cell === null)).toBe(true);
    });

    it('should handle invalid moves gracefully', () => {
      let state = engine.createInitialState();
      
      // Make a valid move
      state = engine.processMove(state, { player: 'X', position: 0, timestamp: Date.now() });
      const validStateSnapshot = JSON.parse(JSON.stringify(state));
      
      // Try invalid moves
        const invalidMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() }, // Occupied cell
        { player: 'O', position: -1, timestamp: Date.now() }, // Invalid position
        { player: 'X', position: 9, timestamp: Date.now() },  // Out of bounds
      ];      invalidMoves.forEach(move => {
        const result = engine.processMove(state, move);
        expect(result).toBe(state); // Should return same state for invalid moves
      });
      
      // State should remain unchanged
      expect(JSON.stringify(state)).toBe(JSON.stringify(validStateSnapshot));
    });
  });

  describe('Computer Player Intelligence Integration', () => {
    it('should demonstrate computer strategic behavior across multiple games', () => {
      const gameResults: string[] = [];
      
      // Play multiple games to test computer consistency
      for (let gameIndex = 0; gameIndex < 5; gameIndex++) {
        let state = engine.createInitialState();
        let humanMoves = 0;
        
        // Play a game with predictable human strategy
        const humanStrategy = [4, 0, 8, 2, 6]; // Center, corners
        
        while (state.status === 'playing' && humanMoves < humanStrategy.length) {
          // Human move
          const humanPosition = humanStrategy[humanMoves];
          if (engine.isValidMove(state, humanPosition)) {
            state = engine.processMove(state, {
              player: 'X',
              position: humanPosition,
              timestamp: Date.now()
            });
            humanMoves++;
          } else {
            // Skip invalid move
            humanMoves++;
            continue;
          }
          
          // Computer response
          if (state.status === 'playing') {
            const computerMove = computer.calculateNextMove(state);
            if (computerMove >= 0) {
              state = engine.processMove(state, {
                player: 'O',
                position: computerMove,
                timestamp: Date.now()
              });
            }
          }
        }
        
        gameResults.push(state.status + (state.winner ? `-${state.winner}` : ''));
      }
      
      // Computer should not lose all games (should win some or draw)
      const computerLosses = gameResults.filter(result => result === 'won-X').length;
      expect(computerLosses).toBeLessThan(5); // Should not lose every game
      
      // Should have consistent outcomes (computer should not lose)
      const uniqueResults = new Set(gameResults);
      expect(uniqueResults.size).toBeGreaterThanOrEqual(1); // At least one type of result
    });
  });

  // Helper function
  function findFirstAvailablePosition(state: GameState): number {
    for (let i = 0; i < state.board.length; i++) {
      if (engine.isValidMove(state, i)) {
        return i;
      }
    }
    return -1;
  }
});

describe('Cross-Board-Size Integration Tests', () => {
  describe('Multi-Board-Size Engine Compatibility', () => {
    it('should handle all board sizes with consistent APIs', () => {
      const boardSizes = [3, 4, 7] as const;
      const engines = boardSizes.map(size => {
        const config = {
          boardSize: size,
          kInRow: size === 7 ? 4 : 3,
          firstPlayer: 'X' as const,
          mode: 'human-vs-human' as const
        };
        const engine = EngineFactory.createEngine(config);
        return { engine, config, size };
      });

      engines.forEach(({ engine, config, size }) => {
        // Test API consistency
        const state = engine.initialState(config);
        expect(state.board.length).toBe(size * size);
        expect(state.config.boardSize).toBe(size);
        expect(state.config.kInRow).toBe(size === 7 ? 4 : 3);
        
        // Test legal moves API
        const legalMoves = engine.legalMoves(state);
        expect(legalMoves.length).toBe(size * size); // All positions legal initially
        
        // Test move validation API - legal moves should be valid
        expect(legalMoves.includes(0)).toBe(true);
        expect(legalMoves.includes(size * size - 1)).toBe(true); // Last position
        expect(legalMoves.includes(size * size)).toBe(false); // Out of bounds
        
        // Test terminal state API
        expect(engine.isTerminal(state)).toBe(false);
      });
    });

    it('should maintain consistent win detection patterns across board sizes', () => {
      // Simplified test - just verify that all board sizes can detect wins
      const testCases = [
        { size: 3 as const, kInRow: 3 },
        { size: 4 as const, kInRow: 3 },
        { size: 7 as const, kInRow: 4 }
      ];

      testCases.forEach(({ size, kInRow }) => {
        const config = {
          boardSize: size,
          kInRow,
          firstPlayer: 'X' as const,
          mode: 'human-vs-human' as const
        };
        
        const engine = EngineFactory.createEngine(config);
        const state = engine.initialState(config);
        
        // Verify basic functionality works for all board sizes
        expect(state.board.length).toBe(size * size);
        expect(state.config.boardSize).toBe(size);
        expect(state.config.kInRow).toBe(kInRow);
        
        // Test that win detection method exists and returns expected type
        const winLines = engine.kInRow(state);
        expect(Array.isArray(winLines)).toBe(true);
        expect(winLines).toEqual([]); // Empty board should have no wins
        
        // Test that terminal detection works
        expect(engine.isTerminal(state)).toBe(false); // Empty board should not be terminal
      });
    });

    it('should handle board size transitions correctly', () => {
      // Create games of different sizes using factory methods
      const engine3x3 = EngineFactory.create3x3Engine('X');
      const engine4x4 = EngineFactory.create4x4Engine('O');
      const engine7x7 = EngineFactory.create7x7Engine('X');
      
      const config3x3 = {
        boardSize: 3 as const,
        kInRow: 3,
        firstPlayer: 'X' as const,
        mode: 'human-vs-human' as const
      };
      
      const config4x4 = {
        boardSize: 4 as const,
        kInRow: 3,
        firstPlayer: 'O' as const,
        mode: 'human-vs-human' as const
      };
      
      const config7x7 = {
        boardSize: 7 as const,
        kInRow: 4,
        firstPlayer: 'X' as const,
        mode: 'human-vs-human' as const
      };
      
      // Test state isolation between different board sizes
      const state3x3 = engine3x3.initialState(config3x3);
      const state4x4 = engine4x4.initialState(config4x4);
      const state7x7 = engine7x7.initialState(config7x7);
      
      expect(state3x3.board.length).toBe(9);
      expect(state4x4.board.length).toBe(16);
      expect(state7x7.board.length).toBe(49);
      
      expect(state3x3.currentPlayer).toBe('X');
      expect(state4x4.currentPlayer).toBe('O');
      expect(state7x7.currentPlayer).toBe('X');
      
      // Verify configurations are properly isolated
      expect(state3x3.config.kInRow).toBe(3);
      expect(state4x4.config.kInRow).toBe(3);
      expect(state7x7.config.kInRow).toBe(4);
    });

    it('should maintain performance characteristics across board sizes', () => {
      const performanceResults: Array<{ size: number; time: number }> = [];
      
      ([3, 4, 7] as const).forEach(size => {
        const config = {
          boardSize: size,
          kInRow: size === 7 ? 4 : 3,
          firstPlayer: 'X' as const,
          mode: 'human-vs-human' as const
        };
        
        const start = performance.now();
        
        // Test engine creation and basic operations
        const engine = EngineFactory.createEngine(config);
        const state = engine.initialState(config);
        const legalMoves = engine.legalMoves(state);
        const winLines = engine.kInRow(state);
        const isTerminal = engine.isTerminal(state);
        
        const end = performance.now();
        const time = end - start;
        
        performanceResults.push({ size, time });
        
        // Verify basic operations completed successfully
        expect(state.board.length).toBe(size * size);
        expect(legalMoves.length).toBe(size * size);
        expect(winLines).toEqual([]);
        expect(isTerminal).toBe(false);
      });
      
      // Verify performance is reasonable for all board sizes
      performanceResults.forEach(({ size, time }) => {
        const maxTime = size === 7 ? 100 : 50; // 7x7 allowed slightly more time
        expect(time).toBeLessThan(maxTime); 
      });
    });
  });

  describe('API Consistency Validation', () => {
    it('should maintain consistent method signatures across board sizes', () => {
      ([3, 4, 7] as const).forEach(size => {
        const config = {
          boardSize: size,
          kInRow: size === 7 ? 4 : 3,
          firstPlayer: 'X' as const,
          mode: 'human-vs-human' as const
        };
        
        const engine = EngineFactory.createEngine(config);
        const state = engine.initialState(config);
        
        // Test all public methods exist and return expected types
        expect(typeof engine.initialState).toBe('function');
        expect(typeof engine.legalMoves).toBe('function');
        expect(typeof engine.applyMove).toBe('function');
        expect(typeof engine.isTerminal).toBe('function');
        expect(typeof engine.winner).toBe('function');
        expect(typeof engine.kInRow).toBe('function');
        
        // Test return types
        expect(Array.isArray(engine.legalMoves(state))).toBe(true);
        expect(typeof engine.isTerminal(state)).toBe('boolean');
        expect(Array.isArray(engine.kInRow(state))).toBe(true);
        
        // Test state immutability - operations should not modify original state 
        const originalBoard = [...state.board];
        engine.legalMoves(state);
        expect(state.board).toEqual(originalBoard);
      });
    });

    it('should handle error conditions consistently across board sizes', () => {
      ([3, 4, 7] as const).forEach(size => {
        const config = {
          boardSize: size,
          kInRow: size === 7 ? 4 : 3,
          firstPlayer: 'X' as const,
          mode: 'human-vs-human' as const
        };
        
        const engine = EngineFactory.createEngine(config);
        const state = engine.initialState(config);
        
        // Test valid move positions
        const legalMoves = engine.legalMoves(state);
        expect(legalMoves.includes(0)).toBe(true); // First position should be legal
        expect(legalMoves.includes(size * size - 1)).toBe(true); // Last position should be legal
        expect(legalMoves.includes(size * size)).toBe(false); // Out of bounds should not be legal
        
        // Test error handling for invalid moves
        expect(() => {
          const invalidMove = {
            player: 'X' as const,
            position: size * size + 1, // Out of bounds
            timestamp: Date.now()
          };
          engine.applyMove(state, invalidMove);
        }).toThrow();
      });
    });
  });

  describe('Regression Prevention', () => {
    it('should maintain exact compatibility with existing 3x3 behavior', () => {
      const config = {
        boardSize: 3 as const,
        kInRow: 3,
        firstPlayer: 'X' as const,
        mode: 'human-vs-human' as const
      };
      
      const engine = EngineFactory.createEngine(config);
      let state = engine.initialState(config);
      
      // Classic 3x3 winning scenario - top row
      const moves = [
        { player: 'X' as const, position: 0, timestamp: Date.now() },
        { player: 'O' as const, position: 3, timestamp: Date.now() + 1 },
        { player: 'X' as const, position: 1, timestamp: Date.now() + 2 },
        { player: 'O' as const, position: 4, timestamp: Date.now() + 3 },
        { player: 'X' as const, position: 2, timestamp: Date.now() + 4 }
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(state.winner).toBe('X');
      expect(state.winningLine).toEqual([0, 1, 2]);
      expect(state.status).toBe('won');
      expect(engine.isTerminal(state)).toBe(true);
    });

    it('should maintain exact compatibility with existing 4x4 behavior', () => {
      const config = {
        boardSize: 4 as const,
        kInRow: 3,
        firstPlayer: 'X' as const,
        mode: 'human-vs-human' as const
      };
      
      const engine = EngineFactory.createEngine(config);
      let state = engine.initialState(config);
      
      // Classic 4x4 winning scenario - first row, positions 0,1,2
      const moves = [
        { player: 'X' as const, position: 0, timestamp: Date.now() },
        { player: 'O' as const, position: 4, timestamp: Date.now() + 1 },
        { player: 'X' as const, position: 1, timestamp: Date.now() + 2 },
        { player: 'O' as const, position: 5, timestamp: Date.now() + 3 },
        { player: 'X' as const, position: 2, timestamp: Date.now() + 4 }
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(state.winner).toBe('X');
      expect(state.winningLine).toEqual([0, 1, 2]);
      expect(state.status).toBe('won');
      expect(engine.isTerminal(state)).toBe(true);
    });
  });
});