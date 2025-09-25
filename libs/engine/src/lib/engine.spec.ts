import { GameEngine } from './engine';
import { GameState, Move, GameConfig, Cell } from '@libs/shared';

describe('GameEngine', () => {
  let engine: GameEngine;

  // Helper function to create test configuration
  function createTestConfig(overrides: Partial<GameConfig> = {}): GameConfig {
    return {
      boardSize: 3,
      kInRow: 3,
      firstPlayer: 'X',
      mode: 'human-vs-human',
      ...overrides
    };
  }

  // Helper function to create test GameState
  function createTestGameState(board: readonly Cell[], overrides: Partial<GameState> = {}): GameState {
    return {
      board,
      currentPlayer: 'X',
      moveHistory: [],
      status: 'playing',
      winner: null,
      winningLine: null,
      config: createTestConfig(),
      startTime: Date.now(),
      ...overrides
    };
  }

  beforeEach(() => {
    engine = new GameEngine();
  });

  describe('createInitialState', () => {
    it('should create initial game state with X as default first player', () => {
      const state = engine.createInitialState();

      expect(state.board).toHaveLength(9);
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.winner).toBeNull();
      expect(state.status).toBe('playing');
      expect(state.moveHistory).toHaveLength(0);
      expect(state.winningLine).toBeNull();
    });

    it('should create initial game state with specified first player', () => {
      const state = engine.createInitialState('O');

      expect(state.currentPlayer).toBe('O');
    });
  });

  describe('isValidMove', () => {
    it('should return true for empty positions in playing game', () => {
      const state = engine.createInitialState();

      expect(engine.isValidMove(state, 0)).toBe(true);
      expect(engine.isValidMove(state, 4)).toBe(true);
      expect(engine.isValidMove(state, 8)).toBe(true);
    });

    it('should return false for occupied positions', () => {
      const board: readonly Cell[] = [
        'X', null, null,
        null, 'O', null,
        null, null, null
      ];
      const state = createTestGameState(board);

      expect(engine.isValidMove(state, 0)).toBe(false);
      expect(engine.isValidMove(state, 4)).toBe(false);
      expect(engine.isValidMove(state, 1)).toBe(true);
    });

    it('should return false for terminal state', () => {
      const board: readonly Cell[] = [
        'X', 'X', 'X',
        null, 'O', null,
        null, null, null
      ];
      const state = createTestGameState(board, { status: 'won', winner: 'X' });

      expect(engine.isValidMove(state, 3)).toBe(false);
    });
  });

  describe('checkWinner', () => {
    it('should detect row wins', () => {
      const board: readonly Cell[] = [
        'X', 'X', 'X',
        null, 'O', null,
        'O', null, null
      ];

      expect(engine.checkWinner(board)).toBe('X');
    });

    it('should detect column wins', () => {
      const board: readonly Cell[] = [
        'O', 'X', null,
        'O', 'X', null,
        'O', null, 'X'
      ];

      expect(engine.checkWinner(board)).toBe('O');
    });

    it('should detect diagonal wins', () => {
      const board: readonly Cell[] = [
        'X', 'O', 'O',
        'O', 'X', null,
        null, null, 'X'
      ];

      expect(engine.checkWinner(board)).toBe('X');
    });

    it('should return null when no winner', () => {
      const board: readonly Cell[] = [
        'X', 'O', 'X',
        'O', 'O', 'X',
        'O', 'X', null
      ];

      expect(engine.checkWinner(board)).toBeNull();
    });
  });

  describe('processMove', () => {
    it('should process valid move and update state', () => {
      const state = engine.createInitialState();
      const move: Move = {
        player: 'X',
        position: 0,
        timestamp: Date.now()
      };

      const newState = engine.processMove(state, move);

      expect(newState.board[0]).toBe('X');
      expect(newState.currentPlayer).toBe('O');
      expect(newState.moveHistory).toHaveLength(1);
      expect(newState.moveHistory[0]).toEqual(move);
      expect(newState.status).toBe('playing');
    });

    it('should not process invalid move', () => {
      const board: readonly Cell[] = [
        'O', null, null,
        null, null, null,
        null, null, null
      ];
      const state = createTestGameState(board);
      const move: Move = {
        player: 'X',
        position: 0, // Already occupied
        timestamp: Date.now()
      };
      
      const newState = engine.processMove(state, move);
      
      expect(newState).toBe(state); // Should return same state for invalid move
    });

    it('should detect winner after move', () => {
      const board: readonly Cell[] = [
        'X', 'X', null,
        'O', 'O', null,
        null, null, null
      ];
      const state = createTestGameState(board);
      
      const winningMove: Move = {
        player: 'X',
        position: 2,
        timestamp: Date.now()
      };

      const newState = engine.processMove(state, winningMove);

      expect(newState.winner).toBe('X');
      expect(newState.status).toBe('won');
      expect(newState.winningLine).toEqual([0, 1, 2]);
    });

    it('should detect draw when board is full', () => {
      const board: readonly Cell[] = [
        'X', 'O', 'X',
        'O', 'O', 'X',
        'O', 'X', null
      ];
      const state = createTestGameState(board, { currentPlayer: 'O' });
      
      const drawMove: Move = {
        player: 'O',
        position: 8,
        timestamp: Date.now()
      };

      const newState = engine.processMove(state, drawMove);

      expect(newState.winner).toBeNull();
      expect(newState.status).toBe('draw');
    });
  });


});
