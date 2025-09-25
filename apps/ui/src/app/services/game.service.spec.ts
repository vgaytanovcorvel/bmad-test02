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
});