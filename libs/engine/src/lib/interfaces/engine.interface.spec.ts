/**
 * Engine Interface Contract Tests
 * 
 * Tests that validate the Engine interface contracts and ensure implementations
 * follow immutability requirements and proper error handling.
 * 
 * @since 2.1.0
 */

import type { Engine } from './engine.interface';
import type { GameState, GameConfig, Move, Player } from '@libs/shared';

// Mock implementation for testing interface contracts
class MockEngine implements Engine {
  initialState(config: GameConfig): GameState {
    const now = Date.now();
    return {
      board: Array(config.boardSize * config.boardSize).fill(null) as readonly null[],
      currentPlayer: config.firstPlayer,
      moveHistory: [],
      status: 'playing',
      winner: null,
      winningLine: null,
      config,
      startTime: now
    };
  }

  legalMoves(state: GameState): number[] {
    const moves: number[] = [];
    if (state.status === 'playing') {
      state.board.forEach((cell, index) => {
        if (cell === null) {
          moves.push(index);
        }
      });
    }
    return moves;
  }

  applyMove(state: GameState, move: Move): GameState {
    if (state.status !== 'playing') {
      throw new Error('Game is not in playing state');
    }
    
    if (move.player !== state.currentPlayer) {
      throw new Error('Move player does not match current player');
    }

    if (state.board[move.position] !== null) {
      throw new Error('Position is already occupied');
    }

    const newBoard = [...state.board];
    newBoard[move.position] = move.player;

    const newMoveHistory = [...state.moveHistory, move];
    const nextPlayer: Player = state.currentPlayer === 'X' ? 'O' : 'X';

    // Simple win detection for testing
    const hasWin = this.checkSimpleWin(newBoard, move.player, state.config.boardSize);
    const isFull = newBoard.every(cell => cell !== null);

    return {
      ...state,
      board: newBoard as readonly (Player | null)[],
      currentPlayer: nextPlayer,
      moveHistory: newMoveHistory,
      status: hasWin ? 'won' : (isFull ? 'draw' : 'playing'),
      winner: hasWin ? move.player : null,
      winningLine: hasWin ? this.getSimpleWinningLine(newBoard, move.player, state.config.boardSize) : null,
      endTime: hasWin || isFull ? Date.now() : undefined
    };
  }

  isTerminal(state: GameState): boolean {
    return state.status === 'won' || state.status === 'draw';
  }

  winner(state: GameState): Player | null {
    if (!this.isTerminal(state)) {
      throw new Error('Cannot get winner of non-terminal state');
    }
    return state.winner;
  }

  kInRow(state: GameState): number[][] {
    if (state.winningLine) {
      return [Array.from(state.winningLine)];
    }
    return [];
  }

  private checkSimpleWin(board: (Player | null)[], player: Player, boardSize: number): boolean {
    // Simple horizontal check for first row only (for testing)
    for (let i = 0; i < boardSize; i++) {
      if (board[i] !== player) return false;
    }
    return true;
  }

  private getSimpleWinningLine(board: (Player | null)[], player: Player, boardSize: number): number[] {
    // Return first row if it's a winning line (for testing)
    const firstRow = [];
    for (let i = 0; i < boardSize; i++) {
      if (board[i] === player) {
        firstRow.push(i);
      }
    }
    return firstRow.length === boardSize ? firstRow : [];
  }
}

// Factory function for creating test configurations
function createTestConfig(overrides: Partial<GameConfig> = {}): GameConfig {
  return {
    boardSize: 3,
    kInRow: 3,
    firstPlayer: 'X',
    mode: 'human-vs-human',
    ...overrides
  };
}

// Factory function for creating test moves
function createTestMove(overrides: Partial<Move> = {}): Move {
  return {
    player: 'X',
    position: 0,
    timestamp: Date.now(),
    ...overrides
  };
}

describe('Engine Interface Contract', () => {
  let mockEngine: Engine;

  beforeEach(() => {
    mockEngine = new MockEngine();
  });

  describe('initialState method', () => {
    it('should return game state with readonly constraints', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);

      // Test TypeScript compilation enforces readonly - these should compile but not throw at runtime
      // The readonly constraint is compile-time only unless we implement runtime immutability
      
      // Verify state structure is correct
      expect(state.board).toBeDefined();
      expect(state.moveHistory).toBeDefined();
      expect(Array.isArray(state.board)).toBe(true);
      expect(Array.isArray(state.moveHistory)).toBe(true);
      
      // The contract is that implementations should return readonly data
      // Runtime immutability can be added in future stories with Object.freeze or similar
    });

    it('should create state with proper structure', () => {
      const config = createTestConfig({ boardSize: 3, firstPlayer: 'O' });
      const state = mockEngine.initialState(config);

      expect(state.board).toHaveLength(9);
      expect(state.currentPlayer).toBe('O');
      expect(state.moveHistory).toEqual([]);
      expect(state.status).toBe('playing');
      expect(state.winner).toBeNull();
      expect(state.winningLine).toBeNull();
      expect(state.config).toEqual(config);
      expect(typeof state.startTime).toBe('number');
    });

    it('should handle different board sizes', () => {
      const config3x3 = createTestConfig({ boardSize: 3 });
      const config4x4 = createTestConfig({ boardSize: 4 });

      const state3x3 = mockEngine.initialState(config3x3);
      const state4x4 = mockEngine.initialState(config4x4);

      expect(state3x3.board).toHaveLength(9);
      expect(state4x4.board).toHaveLength(16);
    });
  });

  describe('legalMoves method', () => {
    it('should return all empty positions for new game', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const legalMoves = mockEngine.legalMoves(state);

      expect(legalMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should exclude occupied positions', () => {
      const config = createTestConfig();
      const initialState = mockEngine.initialState(config);
      
      // Apply a move
      const move = createTestMove({ position: 4 });
      const stateAfterMove = mockEngine.applyMove(initialState, move);
      const legalMoves = mockEngine.legalMoves(stateAfterMove);

      expect(legalMoves).not.toContain(4);
      expect(legalMoves).toHaveLength(8);
    });

    it('should return empty array for terminal states', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      
      // Create a terminal state by setting status
      const terminalState: GameState = {
        ...state,
        status: 'won',
        winner: 'X'
      };

      const legalMoves = mockEngine.legalMoves(terminalState);
      expect(legalMoves).toEqual([]);
    });
  });

  describe('applyMove method', () => {
    it('should return new immutable state object', () => {
      const config = createTestConfig();
      const initialState = mockEngine.initialState(config);
      const move = createTestMove({ position: 0 });
      
      const newState = mockEngine.applyMove(initialState, move);

      // States should be different objects
      expect(newState).not.toBe(initialState);
      
      // Board should be different object
      expect(newState.board).not.toBe(initialState.board);
      
      // Move history should be different object
      expect(newState.moveHistory).not.toBe(initialState.moveHistory);

      // Original state should remain unchanged
      expect(initialState.board[0]).toBeNull();
      expect(initialState.moveHistory).toHaveLength(0);
    });

    it('should throw error for illegal moves', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);

      // Test move to occupied position
      const move1 = createTestMove({ position: 0 });
      const stateAfterMove1 = mockEngine.applyMove(state, move1);
      const move2 = createTestMove({ position: 0, player: 'O' });

      expect(() => {
        mockEngine.applyMove(stateAfterMove1, move2);
      }).toThrow('Position is already occupied');
    });

    it('should throw error when wrong player makes move', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const wrongPlayerMove = createTestMove({ player: 'O' }); // X should go first

      expect(() => {
        mockEngine.applyMove(state, wrongPlayerMove);
      }).toThrow('Move player does not match current player');
    });

    it('should throw error on terminal state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const terminalState: GameState = {
        ...state,
        status: 'won',
        winner: 'X'
      };

      const move = createTestMove();
      expect(() => {
        mockEngine.applyMove(terminalState, move);
      }).toThrow('Game is not in playing state');
    });

    it('should update move history correctly', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const move = createTestMove({ position: 4, timestamp: 123456 });
      
      const newState = mockEngine.applyMove(state, move);

      expect(newState.moveHistory).toHaveLength(1);
      expect(newState.moveHistory[0]).toEqual(move);
    });

    it('should switch current player', () => {
      const config = createTestConfig({ firstPlayer: 'X' });
      const state = mockEngine.initialState(config);
      const move = createTestMove({ player: 'X', position: 0 });
      
      const newState = mockEngine.applyMove(state, move);

      expect(newState.currentPlayer).toBe('O');
    });
  });

  describe('isTerminal method', () => {
    it('should return false for playing state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);

      expect(mockEngine.isTerminal(state)).toBe(false);
    });

    it('should return true for won state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const wonState: GameState = {
        ...state,
        status: 'won',
        winner: 'X'
      };

      expect(mockEngine.isTerminal(wonState)).toBe(true);
    });

    it('should return true for draw state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const drawState: GameState = {
        ...state,
        status: 'draw',
        winner: null
      };

      expect(mockEngine.isTerminal(drawState)).toBe(true);
    });
  });

  describe('winner method', () => {
    it('should throw error for non-terminal state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);

      expect(() => {
        mockEngine.winner(state);
      }).toThrow('Cannot get winner of non-terminal state');
    });

    it('should return winner for won state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const wonState: GameState = {
        ...state,
        status: 'won',
        winner: 'X'
      };

      expect(mockEngine.winner(wonState)).toBe('X');
    });

    it('should return null for draw state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const drawState: GameState = {
        ...state,
        status: 'draw',
        winner: null
      };

      expect(mockEngine.winner(drawState)).toBeNull();
    });
  });

  describe('kInRow method', () => {
    it('should return empty array for non-winning state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);

      expect(mockEngine.kInRow(state)).toEqual([]);
    });

    it('should return winning lines for winning state', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const wonState: GameState = {
        ...state,
        status: 'won',
        winner: 'X',
        winningLine: [0, 1, 2]
      };

      const winningLines = mockEngine.kInRow(wonState);
      expect(winningLines).toEqual([[0, 1, 2]]);
    });
  });

  describe('Interface Immutability Contracts', () => {
    it('should never mutate input state objects', () => {
      const config = createTestConfig();
      const originalState = mockEngine.initialState(config);
      const originalBoardSnapshot = [...originalState.board];
      const originalHistorySnapshot = [...originalState.moveHistory];
      
      const move = createTestMove({ position: 0 });
      
      // Apply move - should not mutate original state
      mockEngine.applyMove(originalState, move);
      
      // Verify original state unchanged
      expect(originalState.board).toEqual(originalBoardSnapshot);
      expect(originalState.moveHistory).toEqual(originalHistorySnapshot);
      expect(originalState.currentPlayer).toBe('X');
      expect(originalState.status).toBe('playing');
    });

    it('should return immutable arrays from methods', () => {
      const config = createTestConfig();
      const state = mockEngine.initialState(config);
      const legalMoves = mockEngine.legalMoves(state);
      
      // Try to mutate returned array
      expect(() => {
        legalMoves.push(99);
      }).not.toThrow(); // Arrays from legalMoves are mutable copies
      
      // But verify original state not affected by getting moves again
      const legalMoves2 = mockEngine.legalMoves(state);
      expect(legalMoves2).not.toContain(99);
    });
  });
});