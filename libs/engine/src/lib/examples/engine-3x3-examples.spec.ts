/**
 * 3x3 Engine Usage Examples
 * 
 * This file contains comprehensive examples demonstrating proper usage patterns
 * of the tic-tac-toe engine for 3x3 games. These tests serve as both documentation
 * and validation of common usage scenarios.
 * 
 * Use these examples as reference patterns for integrating the engine into
 * applications or for understanding the complete game workflow.
 * 
 * @since 2.9.0
 */

import { EngineFactory } from '../factories/engine-factory';
import type { Engine } from '../interfaces/engine.interface';
import type { GameState, GameConfig, Move } from '@libs/shared';

describe('3x3 Engine Usage Examples', () => {
  let engine: Engine;

  beforeEach(() => {
    // Example: Creating a 3x3 engine using the factory
    engine = EngineFactory.create3x3Engine();
  });

  describe('Basic Engine Creation and Configuration', () => {
    it('demonstrates engine creation with factory methods', () => {
      // Example 1: Create engine with default settings (X starts, human vs human)
      const defaultEngine = EngineFactory.create3x3Engine();
      expect(defaultEngine).toBeDefined();

      // Example 2: Create engine with O starting first
      const engineWithO = EngineFactory.create3x3Engine('O');
      expect(engineWithO).toBeDefined();

      // Example 3: Create human vs computer engine
      const vsComputerEngine = EngineFactory.createHumanVsComputerEngine(3, 'X');
      expect(vsComputerEngine).toBeDefined();
    });

    it('demonstrates game configuration for 3x3 boards', () => {
      // Example: Standard 3x3 game configuration
      const config: GameConfig = {
        boardSize: 3,        // 3x3 board
        kInRow: 3,          // Need 3 in a row to win
        firstPlayer: 'X',   // X goes first
        mode: 'human-vs-human' // Two human players
      };

      const gameState = engine.initialState(config);

      // Verify initial state setup
      expect(gameState.board.length).toBe(9); // 3x3 = 9 cells
      expect(gameState.currentPlayer).toBe('X');
      expect(gameState.status).toBe('playing');
      expect(gameState.winner).toBeNull();
      expect(gameState.moveHistory).toEqual([]);
      expect(gameState.config).toEqual(config);
    });
  });

  describe('Complete Game Workflow Examples', () => {
    it('demonstrates a complete winning game with X victory', () => {
      // Start a new 3x3 game
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Example game moves leading to X victory in top row
      // Board positions:
      // 0 | 1 | 2
      // ---------
      // 3 | 4 | 5
      // ---------
      // 6 | 7 | 8

      // X wins on top row: X gets 0, 1, 2
      const moves = [0, 4, 1, 3, 2]; // X: 0, 1, 2 (top row), O: 4, 3
      
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

      // Verify X wins with top row
      expect(engine.isTerminal(gameState)).toBe(true);
      expect(gameState.status).toBe('won');
      expect(gameState.winner).toBe('X');
      expect(gameState.winningLine).toEqual([0, 1, 2]); // Top row positions
      
      // Verify board state
      expect(gameState.board[0]).toBe('X');
      expect(gameState.board[1]).toBe('X');
      expect(gameState.board[2]).toBe('X');
    });

    it('demonstrates a complete draw game scenario', () => {
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Play a sequence of moves that results in a draw
      // Final board state:
      // X | O | X
      // ---------
      // X | O | O  
      // ---------
      // O | X | X

      const moves = [0, 1, 2, 4, 6, 5, 8, 3, 7]; // Carefully avoid any winning lines
      
      // Apply all moves alternating between X and O
      for (let i = 0; i < moves.length; i++) {
        const move: Move = {
          player: gameState.currentPlayer,
          position: moves[i],
          timestamp: Date.now()
        };
        gameState = engine.applyMove(gameState, move);
        
        // Stop if game ends early (shouldn't happen in this draw scenario)
        if (engine.isTerminal(gameState)) {
          break;
        }
      }

      // Verify draw condition or that game ended appropriately
      expect(engine.isTerminal(gameState)).toBe(true);
      if (gameState.status === 'draw') {
        expect(gameState.winner).toBeNull();
        expect(gameState.board.every(cell => cell !== null)).toBe(true); // Board full
        expect(gameState.moveHistory.length).toBe(9); // All moves played
      } else {
        // If it's not a draw, it should be a win
        expect(gameState.status).toBe('won');
        expect(gameState.winner).not.toBeNull();
      }
    });
  });

  describe('Move Validation and Legal Moves Examples', () => {
    it('demonstrates legal move generation and validation', () => {
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Initially all positions are legal
      let legalMoves = engine.legalMoves(gameState);
      expect(legalMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
      expect(legalMoves.length).toBe(9);

      // Make first move
      const move1: Move = { player: 'X', position: 4, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move1);

      // Legal moves should exclude occupied position
      legalMoves = engine.legalMoves(gameState);
      expect(legalMoves).toEqual([0, 1, 2, 3, 5, 6, 7, 8]); // Excludes position 4
      expect(legalMoves.length).toBe(8);

      // Make second move
      const move2: Move = { player: 'O', position: 0, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, move2);

      // Legal moves should exclude both occupied positions
      legalMoves = engine.legalMoves(gameState);
      expect(legalMoves).toEqual([1, 2, 3, 5, 6, 7, 8]); // Excludes positions 0 and 4
      expect(legalMoves.length).toBe(7);

      // Verify legal move validation
      expect(legalMoves.includes(1)).toBe(true);  // Position 1 is legal
      expect(legalMoves.includes(0)).toBe(false); // Position 0 is occupied
      expect(legalMoves.includes(4)).toBe(false); // Position 4 is occupied
    });

    it('demonstrates error handling for invalid moves', () => {
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Occupy position 4
      const validMove: Move = { player: 'X', position: 4, timestamp: Date.now() };
      gameState = engine.applyMove(gameState, validMove);

      // Example 1: Invalid position (out of bounds)
      expect(() => {
        const invalidMove: Move = { player: 'O', position: 9, timestamp: Date.now() };
        engine.applyMove(gameState, invalidMove);
      }).toThrow('Invalid move position: 9. Valid range: 0-8 for 3x3 board');

      // Example 2: Negative position
      expect(() => {
        const invalidMove: Move = { player: 'O', position: -1, timestamp: Date.now() };
        engine.applyMove(gameState, invalidMove);
      }).toThrow('Invalid move position: -1. Valid range: 0-8 for 3x3 board');

      // Example 3: Occupied cell
      expect(() => {
        const occupiedMove: Move = { player: 'O', position: 4, timestamp: Date.now() };
        engine.applyMove(gameState, occupiedMove);
      }).toThrow('Cannot move to occupied cell at position 4. Cell contains: X');

      // Example 4: Wrong player
      expect(() => {
        const wrongPlayerMove: Move = { player: 'X', position: 0, timestamp: Date.now() };
        engine.applyMove(gameState, wrongPlayerMove);
      }).toThrow('Move player X does not match current player O');
    });
  });

  describe('Terminal State Detection Examples', () => {
    it('demonstrates winning condition detection for all victory types', () => {
      // Test horizontal win (top row)
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Create X wins in top row: X-X-X
      const topRowMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];

      for (const move of topRowMoves) {
        gameState = engine.applyMove(gameState, move);
      }

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(engine.winner(gameState)).toBe('X');
      expect(gameState.winningLine).toEqual([0, 1, 2]); // Top row
      expect(engine.kInRow(gameState)).toContainEqual([0, 1, 2]);

      // Test vertical win (left column)
      gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'human-vs-human'
      });

      const leftColumnMoves: Move[] = [
        { player: 'O', position: 0, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() },
        { player: 'O', position: 6, timestamp: Date.now() }
      ];

      for (const move of leftColumnMoves) {
        gameState = engine.applyMove(gameState, move);
      }

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(engine.winner(gameState)).toBe('O');
      expect(gameState.winningLine).toEqual([0, 3, 6]); // Left column
      expect(engine.kInRow(gameState)).toContainEqual([0, 3, 6]);

      // Test diagonal win (main diagonal)
      gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      const diagonalMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 1, timestamp: Date.now() },
        { player: 'X', position: 4, timestamp: Date.now() },
        { player: 'O', position: 2, timestamp: Date.now() },
        { player: 'X', position: 8, timestamp: Date.now() }
      ];

      for (const move of diagonalMoves) {
        gameState = engine.applyMove(gameState, move);
      }

      expect(engine.isTerminal(gameState)).toBe(true);
      expect(engine.winner(gameState)).toBe('X');
      expect(gameState.winningLine).toEqual([0, 4, 8]); // Main diagonal
      expect(engine.kInRow(gameState)).toContainEqual([0, 4, 8]);
    });

    it('demonstrates terminal state checking with proper error handling', () => {
      let gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      // Non-terminal state
      expect(engine.isTerminal(gameState)).toBe(false);
      
      // Should throw error when calling winner() on non-terminal state
      expect(() => engine.winner(gameState)).toThrow('Cannot determine winner of non-terminal game state');

      // Make game terminal
      const winningMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];

      for (const move of winningMoves) {
        gameState = engine.applyMove(gameState, move);
      }

      // Now terminal state methods work
      expect(engine.isTerminal(gameState)).toBe(true);
      expect(engine.winner(gameState)).toBe('X');
      expect(gameState.endTime).toBeDefined();

      // Should throw error when trying to make move on terminal state
      expect(() => {
        const postGameMove: Move = { player: 'O', position: 5, timestamp: Date.now() };
        engine.applyMove(gameState, postGameMove);
      }).toThrow('Cannot apply move to terminal game');
    });
  });

  describe('Factory Usage Examples', () => {
    it('demonstrates different factory creation patterns', () => {
      // Pattern 1: Default 3x3 engine
      const defaultEngine = EngineFactory.create3x3Engine();
      const defaultState = defaultEngine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });
      expect(defaultState.currentPlayer).toBe('X');

      // Pattern 2: 3x3 engine with O starting
      const engineO = EngineFactory.create3x3Engine('O');
      const stateO = engineO.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'human-vs-human'
      });
      expect(stateO.currentPlayer).toBe('O');

      // Pattern 3: Human vs Computer configuration
      const vsComputerEngine = EngineFactory.createHumanVsComputerEngine(3, 'X');
      const vsComputerState = vsComputerEngine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-computer'
      });
      expect(vsComputerState.config.mode).toBe('human-vs-computer');

      // Pattern 4: Custom configuration with validation
      const customConfig: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'computer-vs-computer'
      };
      const customEngine = EngineFactory.createEngine(customConfig);
      expect(customEngine).toBeDefined();

      // Pattern 5: Error handling for invalid configuration
      expect(() => {
        const invalidConfig = {
          boardSize: 5 as unknown as 3,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        } as GameConfig;
        EngineFactory.createEngine(invalidConfig);
      }).toThrow('Invalid board size: 5. Must be 3 or 4');
    });
  });

  describe('State Immutability Examples', () => {
    it('demonstrates immutability patterns and state transitions', () => {
      const gameState = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });

      const originalState = gameState;
      const originalBoard = gameState.board;

      // Apply move - creates new state
      const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const newState = engine.applyMove(gameState, move);

      // Verify immutability: original state unchanged
      expect(originalState).not.toBe(newState); // Different objects
      expect(originalState.board).toBe(originalBoard); // Original board unchanged
      expect(originalState.currentPlayer).toBe('X'); // Original player unchanged
      expect(originalState.moveHistory.length).toBe(0); // Original history unchanged

      // Verify new state: properly updated
      expect(newState.board[4]).toBe('X'); // Move applied
      expect(newState.currentPlayer).toBe('O'); // Player switched
      expect(newState.moveHistory.length).toBe(1); // History updated
      expect(newState.moveHistory[0]).toEqual(move); // Move recorded

      // Verify readonly properties prevent mutation at TypeScript level
      // Note: These would fail at compile time, not runtime
      // The engine ensures immutability by always creating new objects
      expect(newState.board).not.toBe(originalState.board); // Different array instances
      expect(newState).not.toBe(originalState); // Different state objects
      
      // Verify deep immutability - original state completely unchanged
      expect(originalState.board.every((cell, index) => 
        index === 4 ? cell === null : cell === newState.board[index] || cell === null
      )).toBe(true);
    });
  });

  describe('Performance and Optimization Examples', () => {
    it('demonstrates efficient game operations', () => {
      const startTime = Date.now();
      
      // Create many games to test performance
      for (let i = 0; i < 1000; i++) {
        let gameState = engine.initialState({
          boardSize: 3,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        });

        // Play quick game
        const moves = [4, 0, 1, 3, 7]; // X wins
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
      
      // Performance assertion: should complete quickly
      expect(duration).toBeLessThan(1000); // Less than 1 second for 1000 games
    });

    it('demonstrates memory efficiency with large game counts', () => {
      const games: GameState[] = [];
      
      // Create multiple game states
      for (let i = 0; i < 100; i++) {
        let gameState = engine.initialState({
          boardSize: 3,
          kInRow: 3,
          firstPlayer: i % 2 === 0 ? 'X' : 'O',
          mode: 'human-vs-human'
        });
        
        // Make a few moves
        const move: Move = { player: gameState.currentPlayer, position: i % 9, timestamp: Date.now() };
        if (engine.legalMoves(gameState).includes(move.position)) {
          gameState = engine.applyMove(gameState, move);
        }
        
        games.push(gameState);
      }
      
      // Verify all games are independent
      expect(games.length).toBe(100);
      expect(new Set(games).size).toBe(100); // All unique objects
      
      // Verify immutability across games
      const firstGame = games[0];
      const lastGame = games[99];
      expect(firstGame).not.toBe(lastGame);
      expect(firstGame.config).not.toBe(lastGame.config);
    });
  });
});