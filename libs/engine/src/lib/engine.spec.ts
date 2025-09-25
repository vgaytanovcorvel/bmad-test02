import { GameEngine } from './engine';
import { GameState, Move, Board } from '@libs/shared';

describe('GameEngine', () => {
  let engine: GameEngine;

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
      expect(state.winningLine).toBeUndefined();
    });

    it('should create initial game state with specified first player', () => {
      const state = engine.createInitialState('O');

      expect(state.currentPlayer).toBe('O');
    });
  });

  describe('isValidMove', () => {
    let state: GameState;

    beforeEach(() => {
      state = engine.createInitialState();
    });

    it('should return true for empty cell in playing game', () => {
      expect(engine.isValidMove(state, 0)).toBe(true);
      expect(engine.isValidMove(state, 4)).toBe(true);
      expect(engine.isValidMove(state, 8)).toBe(true);
    });

    it('should return false for occupied cell', () => {
      state.board[0] = 'X';
      
      expect(engine.isValidMove(state, 0)).toBe(false);
    });

    it('should return false for invalid position', () => {
      expect(engine.isValidMove(state, -1)).toBe(false);
      expect(engine.isValidMove(state, 9)).toBe(false);
    });

    it('should return false when game is not playing', () => {
      state.status = 'won';
      
      expect(engine.isValidMove(state, 0)).toBe(false);
    });
  });

  describe('checkWinner', () => {
    it('should detect row wins', () => {
      const board: Board = [
        'X', 'X', 'X',
        null, 'O', null,
        'O', null, null
      ];

      expect(engine.checkWinner(board)).toBe('X');
    });

    it('should detect column wins', () => {
      const board: Board = [
        'O', 'X', null,
        'O', 'X', null,
        'O', null, 'X'
      ];

      expect(engine.checkWinner(board)).toBe('O');
    });

    it('should detect diagonal wins', () => {
      const board: Board = [
        'X', 'O', 'O',
        'O', 'X', null,
        null, null, 'X'
      ];

      expect(engine.checkWinner(board)).toBe('X');
    });

    it('should return null when no winner', () => {
      const board: Board = [
        'X', 'O', 'X',
        'O', 'O', 'X',
        'O', 'X', null
      ];

      expect(engine.checkWinner(board)).toBeNull();
    });
  });

  describe('processMove', () => {
    let state: GameState;
    let move: Move;

    beforeEach(() => {
      state = engine.createInitialState();
      move = {
        player: 'X',
        position: 0,
        timestamp: Date.now()
      };
    });

    it('should process valid move and update state', () => {
      const newState = engine.processMove(state, move);

      expect(newState.board[0]).toBe('X');
      expect(newState.currentPlayer).toBe('O');
      expect(newState.moveHistory).toHaveLength(1);
      expect(newState.moveHistory[0]).toEqual(move);
      expect(newState.status).toBe('playing');
    });

    it('should not process invalid move', () => {
      state.board[0] = 'O'; // Occupy the cell
      
      const newState = engine.processMove(state, move);

      expect(newState).toBe(state); // Should return same state
    });

    it('should detect winner after move', () => {
      state.board = [
        'X', 'X', null,
        'O', 'O', null,
        null, null, null
      ];
      
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
      state.board = [
        'X', 'O', 'X',
        'O', 'O', 'X',
        'O', 'X', null
      ];
      
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
