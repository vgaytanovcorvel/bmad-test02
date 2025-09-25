import { createEmptyBoard, isValidPosition, formatPlayerSymbol, isCellEmpty, getOpponent } from './utils';
import { Cell } from './types';

describe('Utils', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with 9 null cells', () => {
      const board = createEmptyBoard();
      
      expect(board).toHaveLength(9);
      expect(board.every(cell => cell === null)).toBe(true);
    });
  });

  describe('isValidPosition', () => {
    it('should return true for valid positions (0-8)', () => {
      for (let i = 0; i < 9; i++) {
        expect(isValidPosition(i)).toBe(true);
      }
    });

    it('should return false for invalid positions', () => {
      expect(isValidPosition(-1)).toBe(false);
      expect(isValidPosition(9)).toBe(false);
      expect(isValidPosition(10)).toBe(false);
      expect(isValidPosition(1.5)).toBe(false);
      expect(isValidPosition(NaN)).toBe(false);
    });
  });

  describe('formatPlayerSymbol', () => {
    it('should format player X as ❌', () => {
      expect(formatPlayerSymbol('X')).toBe('❌');
    });

    it('should format player O as ⭕', () => {
      expect(formatPlayerSymbol('O')).toBe('⭕');
    });

    it('should return empty string for null', () => {
      expect(formatPlayerSymbol(null)).toBe('');
    });
  });

  describe('isCellEmpty', () => {
    it('should return true for empty cells', () => {
      const board = createEmptyBoard();
      expect(isCellEmpty(board, 0)).toBe(true);
      expect(isCellEmpty(board, 4)).toBe(true);
      expect(isCellEmpty(board, 8)).toBe(true);
    });

    it('should return false for occupied cells', () => {
      // Create a mutable board for testing
      const mutableBoard: Cell[] = Array(9).fill(null);
      mutableBoard[0] = 'X';
      mutableBoard[4] = 'O';
      
      // Convert to readonly for function call
      const board = mutableBoard as readonly Cell[];
      
      expect(isCellEmpty(board, 0)).toBe(false);
      expect(isCellEmpty(board, 4)).toBe(false);
    });

    it('should return false for invalid positions', () => {
      const board = createEmptyBoard();
      expect(isCellEmpty(board, -1)).toBe(false);
      expect(isCellEmpty(board, 9)).toBe(false);
    });
  });

  describe('getOpponent', () => {
    it('should return O for X', () => {
      expect(getOpponent('X')).toBe('O');
    });

    it('should return X for O', () => {
      expect(getOpponent('O')).toBe('X');
    });
  });
});