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
        .toThrow(/Invalid move position.*Valid range: 0-8 for 3x3 board/);
    });
    
    it('should throw error for negative position', () => {
      const invalidMove: Move = { player: 'X', position: -1, timestamp: Date.now() };
      
      expect(() => engine.applyMove(initialState, invalidMove))
        .toThrow(/Invalid move position.*Valid range: 0-8 for 3x3 board/);
    });
    
    it('should throw error for occupied position', () => {
      const move1: Move = { player: 'X', position: 4, timestamp: Date.now() };
      const state = engine.applyMove(initialState, move1);
      
      const move2: Move = { player: 'O', position: 4, timestamp: Date.now() };
      
      expect(() => engine.applyMove(state, move2))
        .toThrow(/Cannot move to occupied cell at position 4.*Cell contains: X/);
    });
    
    it('should throw error for wrong player move', () => {
      const wrongPlayerMove: Move = { player: 'O', position: 4, timestamp: Date.now() };
      
      expect(() => engine.applyMove(initialState, wrongPlayerMove))
        .toThrow(/Move player O does not match current player X/);
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
        .toThrow(/Cannot apply move to terminal game.*Game status: won.*Winner: X/);
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
        .toThrow(/Cannot determine winner of non-terminal game state/);
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

  describe('4x4 Board Support', () => {
    describe('initialState with 4x4 configuration', () => {
      it('should create valid initial 4x4 game state', () => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        const state = engine.initialState(config);
        
        expect(state.board).toHaveLength(16);
        expect(state.board.every(cell => cell === null)).toBe(true);
        expect(state.currentPlayer).toBe('X');
        expect(state.moveHistory).toHaveLength(0);
        expect(state.status).toBe('playing');
        expect(state.winner).toBe(null);
        expect(state.winningLine).toBe(null);
        expect(state.config).toEqual(config);
      });

      it('should respect firstPlayer configuration in 4x4', () => {
        const configO: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'O',
          mode: 'human-vs-computer'
        };
        
        const state = engine.initialState(configO);
        expect(state.currentPlayer).toBe('O');
        expect(state.config.firstPlayer).toBe('O');
      });
    });

    describe('legalMoves with 4x4 board', () => {
      it('should return all 16 positions for empty 4x4 board', () => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        const state = engine.initialState(config);
        const legalMoves = engine.legalMoves(state);
        
        expect(legalMoves).toHaveLength(16);
        expect(legalMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      });

      it('should return only empty positions for partially filled 4x4 board', () => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        const initialState = engine.initialState(config);
        
        // Apply some moves
        const move1: Move = { player: 'X', position: 0, timestamp: Date.now() };
        const move2: Move = { player: 'O', position: 5, timestamp: Date.now() };
        const move3: Move = { player: 'X', position: 10, timestamp: Date.now() };
        
        let state = engine.applyMove(initialState, move1);
        state = engine.applyMove(state, move2);
        state = engine.applyMove(state, move3);
        
        const legalMoves = engine.legalMoves(state);
        expect(legalMoves).toHaveLength(13);
        expect(legalMoves).not.toContain(0);
        expect(legalMoves).not.toContain(5);
        expect(legalMoves).not.toContain(10);
      });

      it('should return empty array for terminal 4x4 state', () => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        let state = engine.initialState(config);
        
        // Create winning sequence for X in 4x4: [0,1,2] row win
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 4, timestamp: Date.now() },
          { player: 'X', position: 1, timestamp: Date.now() },
          { player: 'O', position: 5, timestamp: Date.now() },
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

    describe('applyMove with 4x4 board', () => {
      let initialState4x4: GameState;
      
      beforeEach(() => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        initialState4x4 = engine.initialState(config);
      });

      it('should apply valid move and update 4x4 state correctly', () => {
        const move: Move = { player: 'X', position: 5, timestamp: Date.now() };
        const newState = engine.applyMove(initialState4x4, move);
        
        // Original state should be unchanged (immutability)
        expect(initialState4x4.board[5]).toBe(null);
        expect(initialState4x4.currentPlayer).toBe('X');
        expect(initialState4x4.moveHistory).toHaveLength(0);
        
        // New state should reflect the move
        expect(newState.board[5]).toBe('X');
        expect(newState.currentPlayer).toBe('O'); // Switched players
        expect(newState.moveHistory).toHaveLength(1);
        expect(newState.moveHistory[0]).toEqual(move);
        expect(newState.status).toBe('playing');
        expect(newState.winner).toBe(null);
        expect(newState.winningLine).toBe(null);
      });

      it('should detect row win in 4x4 board', () => {
        let state = initialState4x4;
        
        // Create winning sequence for X: [0,1,2] row win in 4x4
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 4, timestamp: Date.now() },
          { player: 'X', position: 1, timestamp: Date.now() },
          { player: 'O', position: 5, timestamp: Date.now() },
          { player: 'X', position: 2, timestamp: Date.now() } // X wins
        ];
        
        moves.forEach(move => {
          state = engine.applyMove(state, move);
        });
        
        expect(state.status).toBe('won');
        expect(state.winner).toBe('X');
        expect(state.winningLine).toEqual([0, 1, 2]);
        expect(state.currentPlayer).toBe('X'); // Current player should remain X when game ends
        expect(state.endTime).toBeDefined();
      });

      it('should detect column win in 4x4 board', () => {
        let state = initialState4x4;
        
        // Create winning sequence for O: [1,5,9] column win in 4x4
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 1, timestamp: Date.now() },
          { player: 'X', position: 2, timestamp: Date.now() },
          { player: 'O', position: 5, timestamp: Date.now() },
          { player: 'X', position: 3, timestamp: Date.now() },
          { player: 'O', position: 9, timestamp: Date.now() } // O wins
        ];
        
        moves.forEach(move => {
          state = engine.applyMove(state, move);
        });
        
        expect(state.status).toBe('won');
        expect(state.winner).toBe('O');
        expect(state.winningLine).toEqual([1, 5, 9]);
        expect(state.currentPlayer).toBe('O'); // Current player should remain O when game ends
      });

      it('should detect diagonal win in 4x4 board', () => {
        let state = initialState4x4;
        
        // Create winning sequence for X: [0,5,10] diagonal win in 4x4
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 1, timestamp: Date.now() },
          { player: 'X', position: 5, timestamp: Date.now() },
          { player: 'O', position: 2, timestamp: Date.now() },
          { player: 'X', position: 10, timestamp: Date.now() } // X wins diagonal
        ];
        
        moves.forEach(move => {
          state = engine.applyMove(state, move);
        });
        
        expect(state.status).toBe('won');
        expect(state.winner).toBe('X');
        expect(state.winningLine).toEqual([0, 5, 10]);
      });

      it('should detect anti-diagonal win in 4x4 board', () => {
        let state = initialState4x4;
        
        // Create winning sequence for O: [3,6,9] anti-diagonal win in 4x4
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 3, timestamp: Date.now() },
          { player: 'X', position: 1, timestamp: Date.now() },
          { player: 'O', position: 6, timestamp: Date.now() },
          { player: 'X', position: 4, timestamp: Date.now() }, // Changed from 2 to avoid row win
          { player: 'O', position: 9, timestamp: Date.now() } // O wins anti-diagonal
        ];
        
        moves.forEach(move => {
          if (!engine.isTerminal(state)) {
            state = engine.applyMove(state, move);
          }
        });
        
        expect(state.status).toBe('won');
        expect(state.winner).toBe('O');
        expect(state.winningLine).toEqual([3, 6, 9]);
      });

      it('should handle draw scenario in 4x4 board', () => {
        // Create a draw scenario by filling the board without any wins
        const drawBoard: Cell[] = [
          'X', 'O', 'O', 'X',
          'O', 'X', 'X', 'O',
          'X', 'O', 'O', 'X',
          'O', 'X', 'X', 'O'
        ];
        
        // For testing purposes, create a state with the draw board
        const drawState: GameState = {
          ...initialState4x4,
          board: drawBoard as readonly Cell[],
          status: 'draw',
          winner: null,
          winningLine: null
        };
        
        // Test that the engine correctly identifies this as terminal (draw)
        expect(engine.isTerminal(drawState)).toBe(true);
        expect(engine.winner(drawState)).toBe(null); // Draw has no winner
      });
    });

    describe('4x4 Integration with kInRow', () => {
      it('should integrate correctly with WinDetector for 4x4 boards', () => {
        const config: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        let state = engine.initialState(config);
        
        // Create a board with multiple wins in 4x4
        const moves: Move[] = [
          { player: 'X', position: 0, timestamp: Date.now() },
          { player: 'O', position: 4, timestamp: Date.now() },
          { player: 'X', position: 1, timestamp: Date.now() },
          { player: 'O', position: 5, timestamp: Date.now() },
          { player: 'X', position: 2, timestamp: Date.now() } // X wins row [0,1,2]
        ];
        
        moves.forEach(move => {
          state = engine.applyMove(state, move);
        });
        
        expect(engine.isTerminal(state)).toBe(true);
        expect(engine.winner(state)).toBe('X');
        expect(state.winningLine).toEqual([0, 1, 2]);
        
        const allWinningLines = engine.kInRow(state);
        expect(allWinningLines).toContainEqual([0, 1, 2]);
      });
    });

    describe('Cross-Board Size Compatibility', () => {
      it('should maintain 3x3 functionality after 4x4 implementation', () => {
        // Test 3x3 configuration
        const config3x3: GameConfig = {
          boardSize: 3,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        const state3x3 = engine.initialState(config3x3);
        expect(state3x3.board).toHaveLength(9);
        
        // Test 4x4 configuration  
        const config4x4: GameConfig = {
          boardSize: 4,
          kInRow: 3,
          firstPlayer: 'X',
          mode: 'human-vs-human'
        };
        
        const state4x4 = engine.initialState(config4x4);
        expect(state4x4.board).toHaveLength(16);
        
        // Verify they don't interfere with each other
        expect(engine.legalMoves(state3x3)).toHaveLength(9);
        expect(engine.legalMoves(state4x4)).toHaveLength(16);
      });
    });
  });
});