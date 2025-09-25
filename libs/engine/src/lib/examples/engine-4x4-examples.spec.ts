/**
 * 4x4 Engine Usage Examples
 * 
 * This file contains examples demonstrating proper usage patterns of the 
 * tic-tac-toe engine for 4x4 games. These tests serve as both documentation
 * and validation of usage scenarios specific to the larger board format.
 * 
 * The key difference in 4x4 games is the larger board (16 positions instead of 9)
 * while maintaining the k=3 win condition (3 in a row to win).
 * 
 * @since 2.9.0
 */

import { EngineFactory } from '../factories/engine-factory';
import type { Engine } from '../interfaces/engine.interface';
import type { GameState, GameConfig, Move } from '@libs/shared';

describe('4x4 Engine Usage Examples', () => {
  let engine: Engine;

  beforeEach(() => {
    // Example: Creating a 4x4 engine using the factory
    engine = EngineFactory.create4x4Engine();
  });

  describe('Basic Engine Creation and Configuration', () => {
    it('demonstrates 4x4 engine creation with factory methods', () => {
      // Example 1: Create 4x4 engine with default settings (X starts, human vs human)
      const defaultEngine = EngineFactory.create4x4Engine();
      expect(defaultEngine).toBeDefined();

      // Example 2: Create 4x4 engine with O starting first
      const engineWithO = EngineFactory.create4x4Engine('O');
      expect(engineWithO).toBeDefined();

      // Example 3: Create 4x4 human vs computer engine
      const vsComputerEngine = EngineFactory.createHumanVsComputerEngine(4, 'X');
      expect(vsComputerEngine).toBeDefined();
    });

    it('demonstrates game configuration for 4x4 boards', () => {
      // Example: Standard 4x4 game configuration with k=3 win condition
      const config: GameConfig = {
        boardSize: 4,        // 4x4 board (16 cells total)
        kInRow: 3,          // Still need 3 in a row to win (not 4!)
        firstPlayer: 'X',   // X goes first
        mode: 'human-vs-human' // Two human players
      };

      const gameState = engine.initialState(config);

      // Verify initial state setup for 4x4 board
      expect(gameState.board.length).toBe(16); // 4x4 = 16 cells
      expect(gameState.currentPlayer).toBe('X');
      expect(gameState.status).toBe('playing');
      expect(gameState.winner).toBeNull();
      expect(gameState.moveHistory).toEqual([]);
      expect(gameState.config).toEqual(config);
      expect(gameState.config.boardSize).toBe(4);
      expect(gameState.config.kInRow).toBe(3); // Key: still k=3 for 4x4 board
    });
  });

  describe('4x4 Board Position Examples', () => {
    it('demonstrates 4x4 board indexing and position mapping', () => {
      const gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // 4x4 Board Position Layout:
      // 0  | 1  | 2  | 3
      // -------------------
      // 4  | 5  | 6  | 7
      // -------------------
      // 8  | 9  | 10 | 11
      // -------------------
      // 12 | 13 | 14 | 15

      // Verify board size and legal moves
      expect(gameState.board.length).toBe(16);
      const allPositions = engine.legalMoves(gameState);
      expect(allPositions).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

      // Example moves in different areas of the 4x4 board
      const cornerPositions = [0, 3, 12, 15]; // Four corners
      const edgePositions = [1, 2, 4, 7, 8, 11, 13, 14]; // Edges (non-corner)
      const centerPositions = [5, 6, 9, 10]; // Center 2x2 area

      // Verify position categorization
      expect(cornerPositions.every(pos => allPositions.includes(pos))).toBe(true);
      expect(edgePositions.every(pos => allPositions.includes(pos))).toBe(true);
      expect(centerPositions.every(pos => allPositions.includes(pos))).toBe(true);
    });
  });

  describe('Complete 4x4 Game Workflow Examples', () => {
    it('demonstrates a complete winning game with horizontal line (k=3)', () => {
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Example: X wins with horizontal line in top row (positions 0, 1, 2)
      // 4x4 Board positions:
      // 0  | 1  | 2  | 3
      // -------------------
      // 4  | 5  | 6  | 7
      // -------------------
      // 8  | 9  | 10 | 11
      // -------------------
      // 12 | 13 | 14 | 15

      // Simple winning sequence: X gets positions 0, 1, 2 (top row)
      const moves = [0, 5, 1, 6, 2]; // X: 0, 1, 2 (top row win), O: 5, 6
      
      for (let i = 0; i < moves.length; i++) {
        const move: Move = { 
          player: gameState.currentPlayer, 
          position: moves[i], 
          timestamp: Date.now() 
        };
        gameState = engine.applyMove(gameState, move);
        
        // Check if game ended early
        if (engine.isTerminal(gameState)) {
          break;
        }
      }

      // Verify X wins with top row horizontal line
      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.status).toBe('won');
      expect(gameState.winner).toBe('X');
      expect(gameState.winningLine).toEqual([0, 1, 2]); // Top row positions
      
      // Verify board state
      expect(gameState.board[0]).toBe('X');
      expect(gameState.board[1]).toBe('X');
      expect(gameState.board[2]).toBe('X');
    });

    it('demonstrates a complete winning game with vertical line (k=3)', () => {
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'human-vs-human'
      });

      // Example: O wins with vertical line in leftmost column (positions 0, 4, 8)
      const moves = [0, 5, 4, 6, 8]; // O: 0, 4, 8 (left column win), X: 5, 6
      
      for (let i = 0; i < moves.length; i++) {
        const move: Move = { 
          player: gameState.currentPlayer, 
          position: moves[i], 
          timestamp: Date.now() 
        };
        gameState = engine.applyMove(gameState, move);
        
        // Check if game ended early
        if (engine.isTerminal(gameState)) {
          break;
        }
      }

      // Verify O wins with left column vertical line
      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.status).toBe('won');
      expect(gameState.winner).toBe('O');
      expect(gameState.winningLine).toEqual([0, 4, 8]); // Left column positions
    });

  });

  describe('4x4 Move Validation Examples', () => {
    it('demonstrates legal moves and validation for 4x4 board', () => {
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Initially all 16 positions are legal
      let legalMoves = engine.legalMoves(gameState);
      expect(legalMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      expect(legalMoves.length).toBe(16);

      // Make moves and verify legal moves decrease
      const move1: Move = { player: 'X', position: 5, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move1);
      
      legalMoves = engine.legalMoves(gameState);
      expect(legalMoves.length).toBe(15); // One less
      expect(legalMoves.includes(5)).toBe(false); // Position 5 no longer legal

      const move2: Move = { player: 'O', position: 10, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move2);
      
      legalMoves = engine.legalMoves(gameState);
      expect(legalMoves.length).toBe(14); // Two positions occupied
      expect(legalMoves.includes(5)).toBe(false);
      expect(legalMoves.includes(10)).toBe(false);
    });

    it('demonstrates error handling for invalid 4x4 positions', () => {
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Invalid position tests for 4x4 board
      
      // Position too high (>15)
      expect(() => {
        const invalidMove: Move = { player: 'X', position: 16, timestamp: Date.now() };
        engine.applyMove(gameState, invalidMove);
      }).toThrow('Invalid move position: 16. Valid range: 0-15 for 4x4 board');

      // Position too high (way out of range)
      expect(() => {
        const invalidMove: Move = { player: 'X', position: 25, timestamp: Date.now() };
        engine.applyMove(gameState, invalidMove);
      }).toThrow('Invalid move position: 25. Valid range: 0-15 for 4x4 board');

      // Negative position
      expect(() => {
        const invalidMove: Move = { player: 'X', position: -5, timestamp: Date.now() };
        engine.applyMove(gameState, invalidMove);
      }).toThrow('Invalid move position: -5. Valid range: 0-15 for 4x4 board');

      // Occupy a position then try to use it again
      const validMove: Move = { player: 'X', position: 7, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, validMove);

      expect(() => {
        const occupiedMove: Move = { player: 'O', position: 7, timestamp: Date.now() };
        engine.applyMove(gameState, occupiedMove);
      }).toThrow('Cannot move to occupied cell at position 7. Cell contains: X');
    });
  });

  describe('4x4 Winning Pattern Examples', () => {
    it('demonstrates horizontal winning pattern example', () => {
      // Simple horizontal win example for documentation
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // X wins with top row
      gameState = engine.applyMove(gameState, { player: 'X', position: 0, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 15, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 1, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 14, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 2, timestamp: Date.now() });

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.winner).toBe('X');
      expect(gameState.winningLine).toEqual([0, 1, 2]);
    });

    it('demonstrates vertical winning pattern example', () => {
      // Simple vertical win example for documentation  
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // X wins with left column
      gameState = engine.applyMove(gameState, { player: 'X', position: 0, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 1, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 4, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 2, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 8, timestamp: Date.now() });

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.winner).toBe('X');
      expect(gameState.winningLine).toEqual([0, 4, 8]);
    });

    it('demonstrates diagonal winning pattern example', () => {
      // Simple diagonal win example for documentation
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // X wins with main diagonal
      gameState = engine.applyMove(gameState, { player: 'X', position: 0, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 1, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 5, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'O', position: 2, timestamp: Date.now() });
      gameState = engine.applyMove(gameState, { player: 'X', position: 10, timestamp: Date.now() });

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.winner).toBe('X');
      expect(gameState.winningLine).toEqual([0, 5, 10]);
    });


  });

  describe('4x4 Factory and Configuration Examples', () => {
    it('demonstrates different 4x4 factory patterns and configurations', () => {
      // Pattern 1: Default 4x4 engine
      const defaultEngine = EngineFactory.create4x4Engine();
      const defaultState = defaultEngine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });
      expect(defaultState.currentPlayer).toBe('X');
      expect(defaultState.config.boardSize).toBe(4);

      // Pattern 2: 4x4 engine with O starting
      const engineO = EngineFactory.create4x4Engine('O');
      const stateO = engineO.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'human-vs-human'
      });
      expect(stateO.currentPlayer).toBe('O');

      // Pattern 3: 4x4 Human vs Computer
      const vsComputerEngine = EngineFactory.createHumanVsComputerEngine(4, 'X');
      const vsComputerState = vsComputerEngine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-computer'
      });
      expect(vsComputerState.config.mode).toBe('human-vs-computer');
      expect(vsComputerState.config.boardSize).toBe(4);

      // Pattern 4: Custom 4x4 configuration
      const customConfig: GameConfig = {
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'computer-vs-computer'
      };
      const customEngine = EngineFactory.createEngine(customConfig);
      expect(customEngine).toBeDefined();

      const customState = customEngine.initialState(customConfig);
      expect(customState.config.boardSize).toBe(4);
      expect(customState.config.kInRow).toBe(3); // Always 3, even for 4x4
    });
  });

  describe('4x4 Performance Examples', () => {
    it('demonstrates 4x4 performance characteristics', () => {
      const startTime = Date.now();
      
      // Create many 4x4 games to test performance
      // 4x4 games are more complex than 3x3 due to larger board
      for (let i = 0; i < 500; i++) {
        let gameState = engine.initialState({
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        });

        // Play quick 4x4 game
        const moves = [5, 1, 6, 2, 10]; // X wins with diagonal
        for (let j = 0; j < moves.length && !engine.isTerminal(gameState); j++) {
          const move: Move = {
            player: gameState.currentPlayer,
            position: moves[j],
            timestamp: Date.now()
          };
          gameState = engine.applyMove(gameState, move);
        }
      }
      
      const duration = Date.now() - startTime;
      
      // Performance assertion: 4x4 should still be fast
      expect(duration).toBeLessThan(2000); // Less than 2 seconds for 500 games
    });

    it('demonstrates 4x4 memory efficiency', () => {
      const games: GameState[] = [];
      
      // Create multiple 4x4 game states
      for (let i = 0; i < 50; i++) {
        let gameState = engine.initialState({
          boardSize: 4,
          kInRow: 3,
          firstPlayer: i % 2 === 0 ? 'X' : 'O',
          mode: 'human-vs-human'
        });
        
        // Make a few moves (4x4 has positions 0-15)
        const move: Move = { 
          player: gameState.currentPlayer, 
          position: i % 16, 
          timestamp: Date.now() 
        };
        if (engine.legalMoves(gameState).includes(move.position)) {
          gameState = engine.applyMove(gameState, move);
        }
        
        games.push(gameState);
      }
      
      // Verify all games are independent
      expect(games.length).toBe(50);
      expect(new Set(games).size).toBe(50); // All unique objects
      
      // Verify 4x4 board size consistency
      games.forEach(game => {
        expect(game.board.length).toBe(16);
        expect(game.config.boardSize).toBe(4);
        expect(game.config.kInRow).toBe(3);
      });
    });
  });

  describe('4x4 Comprehensive Integration Examples', () => {
    it('demonstrates complete 4x4 game with mixed strategies', () => {
      let gameState = engine.initialState({
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Simulate a realistic 4x4 game with strategic play
      const strategicMoves: Move[] = [
        // X takes center area
        { player: 'X', position: 5, timestamp: Date.now() },
        // O counters in different area
        { player: 'O', position: 0, timestamp: Date.now() },
        // X builds horizontally (second row: 4, 5, 6)
        { player: 'X', position: 4, timestamp: Date.now() },
        // O blocks different threat
        { player: 'O', position: 1, timestamp: Date.now() },
        // X completes horizontal line (positions 4, 5, 6)
        { player: 'X', position: 6, timestamp: Date.now() }
      ];

      for (const move of strategicMoves) {
        if (!engine.isTerminal(gameState)) {
          gameState = engine.applyMove(gameState, move);
        }
      }

      // Verify strategic play outcome
      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.winner).toBe('X');
      
      // Check that winning line makes sense strategically
      const winningLines = engine.kInRow(gameState);
      expect(winningLines.length).toBeGreaterThan(0);
      
      // Verify game progression was logical
      expect(gameState.moveHistory.length).toBeLessThanOrEqual(10); // Reasonable game length
      expect(gameState.endTime).toBeDefined();
    });
  });
});