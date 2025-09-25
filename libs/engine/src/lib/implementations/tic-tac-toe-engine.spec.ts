/**
 * TicTacToe Engine Unit Tests
 * 
 * Comprehensive test suite for the TicTacToeEngine implementation covering
 * Engine interface compliance, game state management, and integration with WinDetector.
 * 
 * @since 2.2.0
 */

import { TicTacToeEngine } from './tic-tac-toe-engine';
import type { Engine } from '../interfaces/engine.interface';
import type { GameState, GameConfig, Move, Cell } from '@libs/shared';

describe('TicTacToeEngine', () => {
  let engine: Engine;
  
  beforeEach(() => {
    engine = new TicTacToeEngine();
  });
  
  describe('Engine Interface Compliance', () => {
    it('should implement all required Engine interface methods', () => {
      expect(typeof engine.initialState).toBe('function');
      expect(typeof engine.legalMoves).toBe('function');
      expect(typeof engine.applyMove).toBe('function');
      expect(typeof engine.isTerminal).toBe('function');
      expect(typeof engine.winner).toBe('function');
      expect(typeof engine.kInRow).toBe('function');
    });
  });
  
  describe('initialState method', () => {
    it('should create valid initial game state', () => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      
      const state = engine.initialState(config);
      
      expect(state.board).toHaveLength(9);
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.moveHistory).toHaveLength(0);
      expect(state.status).toBe('playing');
      expect(state.winner).toBe(null);
      expect(state.winningLine).toBe(null);
      expect(state.config).toEqual(config);
      expect(state.startTime).toBeCloseTo(Date.now(), -2);
      expect(state.endTime).toBeUndefined();
    });
    
    it('should respect firstPlayer configuration', () => {
      const configO: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'O',
        mode: 'human-vs-computer'
      };
      
      const state = engine.initialState(configO);
      expect(state.currentPlayer).toBe('O');
      expect(state.config.firstPlayer).toBe('O');
    });
  });
  
  describe('legalMoves method', () => {
    it('should return all positions for empty board', () => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      
      const state = engine.initialState(config);
      const legalMoves = engine.legalMoves(state);
      
      expect(legalMoves).toHaveLength(9);
      expect(legalMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });
    
    it('should return only empty positions for partially filled board', () => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      
      const initialState = engine.initialState(config);
      
      // Apply some moves
      const move1: Move = { player: 'X', position: 0, timestamp: Date.now() };
      const move2: Move = { player: 'O', position: 4, timestamp: Date.now() };
      
      let state = engine.applyMove(initialState, move1);
      state = engine.applyMove(state, move2);
      
      const legalMoves = engine.legalMoves(state);
      expect(legalMoves).toHaveLength(7);
      expect(legalMoves).toEqual([1, 2, 3, 5, 6, 7, 8]);
      expect(legalMoves).not.toContain(0);
      expect(legalMoves).not.toContain(4);
    });
    
    it('should return empty array for terminal state', () => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      
      let state = engine.initialState(config);
      
      // Create winning sequence for X
      const moves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() } // X wins
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.isTerminal(state)).toBe(true);
      const legalMoves = engine.legalMoves(state);
      expect(legalMoves).toHaveLength(0);
    });
  });
  
  describe('applyMove method', () => {
    let initialState: GameState;
    
    beforeEach(() => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      initialState = engine.initialState(config);
    });
    
    it('should apply valid move and update state correctly', () => {
      const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const newState = engine.applyMove(initialState, move);
      
      expect(newState.board[4]).toBe('X');
      expect(newState.currentPlayer).toBe('O');
      expect(newState.moveHistory).toHaveLength(1);
      expect(newState.moveHistory[0]).toEqual(move);
      expect(newState.status).toBe('playing');
      expect(newState.winner).toBe(null);
      expect(newState.winningLine).toBe(null);
    });
    
    it('should detect winning move and update state accordingly', () => {
      let state = initialState;
      
      // Create winning sequence
      const moves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() } // Winning move
      ];
      
      // Apply first 4 moves
      for (let i = 0; i < 4; i++) {
        state = engine.applyMove(state, moves[i]);
        expect(state.status).toBe('playing');
      }
      
      // Apply winning move
      const finalState = engine.applyMove(state, moves[4]);
      
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('X');
      expect(finalState.winningLine).toEqual([0, 1, 2]);
      expect(finalState.endTime).toBeDefined();
      expect(finalState.currentPlayer).toBe('X'); // Winning player remains current
    });
    
    it('should detect draw game', () => {
      let state = initialState;
      
      // Create guaranteed draw sequence: O X O | X X O | X O X
      const drawMoves: Move[] = [
        { player: 'X', position: 1, timestamp: Date.now() }, // X at 1
        { player: 'O', position: 0, timestamp: Date.now() }, // O at 0
        { player: 'X', position: 3, timestamp: Date.now() }, // X at 3
        { player: 'O', position: 2, timestamp: Date.now() }, // O at 2
        { player: 'X', position: 4, timestamp: Date.now() }, // X at 4
        { player: 'O', position: 5, timestamp: Date.now() }, // O at 5
        { player: 'X', position: 6, timestamp: Date.now() }, // X at 6
        { player: 'O', position: 7, timestamp: Date.now() }, // O at 7
        { player: 'X', position: 8, timestamp: Date.now() }  // X at 8 - Draw
      ];
      
      drawMoves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(state.status).toBe('draw');
      expect(state.winner).toBe(null);
      expect(state.winningLine).toBe(null);
      expect(state.endTime).toBeDefined();
    });
    
    it('should throw error for invalid move position', () => {
      const invalidMove: Move = { player: 'X', position: 9, timestamp: Date.now() };
      
      expect(() => engine.applyMove(initialState, invalidMove))
        .toThrow('Invalid position 9 for board size 9');
    });
    
    it('should throw error for negative position', () => {
      const invalidMove: Move = { player: 'X', position: -1, timestamp: Date.now() };
      
      expect(() => engine.applyMove(initialState, invalidMove))
        .toThrow('Invalid position -1 for board size 9');
    });
    
    it('should throw error for occupied position', () => {
      const move1: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const state = engine.applyMove(initialState, move1);
      
      const move2: Move = { player: 'O', position: 4, timestamp: Date.now() };
      
      expect(() => engine.applyMove(state, move2))
        .toThrow('Position 4 is already occupied');
    });
    
    it('should throw error for wrong player move', () => {
      const wrongPlayerMove: Move = { player: 'O', position: 4, timestamp: Date.now() };
      
      expect(() => engine.applyMove(initialState, wrongPlayerMove))
        .toThrow('Move player O does not match current player X');
    });
    
    it('should throw error for move on terminal state', () => {
      let state = initialState;
      
      // Create winning state
      const moves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      const moveAfterWin: Move = { player: 'O', position: 5, timestamp: Date.now() };
      
      expect(() => engine.applyMove(state, moveAfterWin))
        .toThrow('Cannot apply move to terminal game state');
    });
  });
  
  describe('isTerminal method', () => {
    let initialState: GameState;
    
    beforeEach(() => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      initialState = engine.initialState(config);
    });
    
    it('should return false for initial state', () => {
      expect(engine.isTerminal(initialState)).toBe(false);
    });
    
    it('should return false for ongoing game', () => {
      const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const state = engine.applyMove(initialState, move);
      
      expect(engine.isTerminal(state)).toBe(false);
    });
    
    it('should return true for won game', () => {
      let state = initialState;
      
      const winningMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];
      
      winningMoves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.isTerminal(state)).toBe(true);
    });
    
    it('should return true for draw game', () => {
      let state = initialState;
      
      // Create guaranteed draw sequence: O X O | X X O | X O X
      const drawMoves: Move[] = [
        { player: 'X', position: 1, timestamp: Date.now() }, // X at 1
        { player: 'O', position: 0, timestamp: Date.now() }, // O at 0
        { player: 'X', position: 3, timestamp: Date.now() }, // X at 3
        { player: 'O', position: 2, timestamp: Date.now() }, // O at 2
        { player: 'X', position: 4, timestamp: Date.now() }, // X at 4
        { player: 'O', position: 5, timestamp: Date.now() }, // O at 5
        { player: 'X', position: 6, timestamp: Date.now() }, // X at 6
        { player: 'O', position: 7, timestamp: Date.now() }, // O at 7
        { player: 'X', position: 8, timestamp: Date.now() }  // X at 8 - Draw
      ];
      
      drawMoves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.isTerminal(state)).toBe(true);
    });
  });
  
  describe('winner method', () => {
    let initialState: GameState;
    
    beforeEach(() => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      initialState = engine.initialState(config);
    });
    
    it('should throw error for non-terminal state', () => {
      expect(() => engine.winner(initialState))
        .toThrow('Cannot determine winner of non-terminal game state');
    });
    
    it('should return correct winner for won game', () => {
      let state = initialState;
      
      const winningMoves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];
      
      winningMoves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.winner(state)).toBe('X');
    });
    
    it('should return null for draw game', () => {
      let state = initialState;
      
      // Create guaranteed draw sequence: O X O | X X O | X O X
      const drawMoves: Move[] = [
        { player: 'X', position: 1, timestamp: Date.now() }, // X at 1
        { player: 'O', position: 0, timestamp: Date.now() }, // O at 0
        { player: 'X', position: 3, timestamp: Date.now() }, // X at 3
        { player: 'O', position: 2, timestamp: Date.now() }, // O at 2
        { player: 'X', position: 4, timestamp: Date.now() }, // X at 4
        { player: 'O', position: 5, timestamp: Date.now() }, // O at 5
        { player: 'X', position: 6, timestamp: Date.now() }, // X at 6
        { player: 'O', position: 7, timestamp: Date.now() }, // O at 7
        { player: 'X', position: 8, timestamp: Date.now() }  // X at 8 - Draw
      ];
      
      drawMoves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.winner(state)).toBe(null);
    });
  });
  
  describe('kInRow method', () => {
    let initialState: GameState;
    
    beforeEach(() => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      initialState = engine.initialState(config);
    });
    
    it('should return empty array for no winning lines', () => {
      const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const state = engine.applyMove(initialState, move);
      
      const winningLines = engine.kInRow(state);
      expect(winningLines).toEqual([]);
    });
    
    it('should return winning line coordinates', () => {
      let state = initialState;
      
      const moves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 3, timestamp: Date.now() },
        { player: 'X', position: 1, timestamp: Date.now() },
        { player: 'O', position: 4, timestamp: Date.now() },
        { player: 'X', position: 2, timestamp: Date.now() }
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      const winningLines = engine.kInRow(state);
      expect(winningLines).toHaveLength(1);
      expect(winningLines[0]).toEqual([0, 1, 2]);
    });
    
    it('should return all winning lines when multiple exist', () => {
      // Manually create state with multiple wins
      const board: Cell[] = ['X', 'X', 'X', 'X', 'O', 'O', 'X', null, null];
      const state: GameState = {
        board: board as readonly Cell[],
        currentPlayer: 'O',
        moveHistory: [],
        status: 'won',
        winner: 'X',
        winningLine: [0, 1, 2],
        config: initialState.config,
        startTime: Date.now(),
        endTime: Date.now()
      };
      
      const winningLines = engine.kInRow(state);
      expect(winningLines.length).toBeGreaterThanOrEqual(2);
      expect(winningLines).toContainEqual([0, 1, 2]); // Row
      expect(winningLines).toContainEqual([0, 3, 6]); // Column
    });
  });
  
  describe('Immutability Tests', () => {
    it('should not mutate original state when applying move', () => {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      
      const originalState = engine.initialState(config);
      const originalBoard = [...originalState.board];
      const originalHistory = [...originalState.moveHistory];
      
      const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const newState = engine.applyMove(originalState, move);
      
      // Original state should be unchanged
      expect(originalState.board).toEqual(originalBoard);
      expect(originalState.moveHistory).toEqual(originalHistory);
      expect(originalState.currentPlayer).toBe('X');
      
      // New state should have changes
      expect(newState.board[4]).toBe('X');
      expect(newState.currentPlayer).toBe('O');
      expect(newState.moveHistory).toHaveLength(1);
    });
  });
  
  describe('Integration with WinDetector', () => {
    it('should properly integrate with WinDetector for complex scenarios', () => {
      let state = engine.initialState({
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      });
      
      // Create complex board state
      const moves: Move[] = [
        { player: 'X', position: 0, timestamp: Date.now() },
        { player: 'O', position: 1, timestamp: Date.now() },
        { player: 'X', position: 3, timestamp: Date.now() },
        { player: 'O', position: 2, timestamp: Date.now() },
        { player: 'X', position: 6, timestamp: Date.now() } // X wins column
      ];
      
      moves.forEach(move => {
        state = engine.applyMove(state, move);
      });
      
      expect(engine.isTerminal(state)).toBe(true);
      expect(engine.winner(state)).toBe('X');
      expect(state.winningLine).toEqual([0, 3, 6]);
      
      const allWinningLines = engine.kInRow(state);
      expect(allWinningLines).toContainEqual([0, 3, 6]);
    });
  });
});