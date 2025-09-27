/**
 * Game Types Unit Tests
 * 
 * Tests for core game type definitions and their constraints.
 * Validates type safety, immutability, and correct type assignments.
 * 
 * @since 2.1.0
 */

import { Player, Cell, BoardSize, GameMode } from './game-types';

describe('Core Game Types', () => {
  describe('Player Type', () => {
    it('should accept valid player values', () => {
      const playerX: Player = 'X';
      const playerO: Player = 'O';
      
      expect(playerX).toBe('X');
      expect(playerO).toBe('O');
    });

    it('should be assignable to valid string values', () => {
      const players: Player[] = ['X', 'O'];
      
      expect(players).toHaveLength(2);
      expect(players).toContain('X');
      expect(players).toContain('O');
    });

    it('should work in switch statements for type discrimination', () => {
      const testPlayer = (player: Player): string => {
        switch (player) {
          case 'X':
            return 'Player X';
          case 'O':
            return 'Player O';
          default: {
            // TypeScript should ensure this is never reached
            const exhaustiveCheck: never = player;
            return exhaustiveCheck;
          }
        }
      };

      expect(testPlayer('X')).toBe('Player X');
      expect(testPlayer('O')).toBe('Player O');
    });
  });

  describe('Cell Type', () => {
    it('should accept player values', () => {
      const cellWithX: Cell = 'X';
      const cellWithO: Cell = 'O';
      
      expect(cellWithX).toBe('X');
      expect(cellWithO).toBe('O');
    });

    it('should accept null for empty cells', () => {
      const emptyCell: Cell = null;
      
      expect(emptyCell).toBeNull();
    });

    it('should work in type guards', () => {
      const isEmptyCell = (cell: Cell): cell is null => cell === null;
      const isOccupiedCell = (cell: Cell): cell is Player => cell !== null;

      expect(isEmptyCell(null)).toBe(true);
      expect(isEmptyCell('X')).toBe(false);
      expect(isOccupiedCell('X')).toBe(true);
      expect(isOccupiedCell(null)).toBe(false);
    });

    it('should work with array operations', () => {
      const board: Cell[] = [null, 'X', null, 'O', null, null, null, null, null];
      
      const occupiedCells = board.filter((cell): cell is Player => cell !== null);
      const emptyCells = board.filter(cell => cell === null);
      
      expect(occupiedCells).toEqual(['X', 'O']);
      expect(emptyCells).toHaveLength(7);
    });
  });

  describe('BoardSize Type', () => {
    it('should accept valid board sizes', () => {
      const standardBoard: BoardSize = 3;
      const extendedBoard: BoardSize = 4;
      
      expect(standardBoard).toBe(3);
      expect(extendedBoard).toBe(4);
    });

    it('should work in calculations', () => {
      const calculateBoardCells = (size: BoardSize): number => size * size;
      
      expect(calculateBoardCells(3)).toBe(9);
      expect(calculateBoardCells(4)).toBe(16);
    });

    it('should work in type discrimination', () => {
      const getBoardDescription = (size: BoardSize): string => {
        switch (size) {
          case 3:
            return 'Standard 3x3 board';
          case 4:
            return 'Extended 4x4 board';
          case 7:
            return 'Large 7x7 board';
          default: {
            const exhaustiveCheck: never = size;
            return exhaustiveCheck;
          }
        }
      };

      expect(getBoardDescription(3)).toBe('Standard 3x3 board');
      expect(getBoardDescription(4)).toBe('Extended 4x4 board');
      expect(getBoardDescription(7)).toBe('Large 7x7 board');
    });
  });

  describe('GameMode Type', () => {
    it('should accept all valid game modes', () => {
      const humanVsHuman: GameMode = 'human-vs-human';
      const humanVsComputer: GameMode = 'human-vs-computer';
      const computerVsComputer: GameMode = 'computer-vs-computer';
      
      expect(humanVsHuman).toBe('human-vs-human');
      expect(humanVsComputer).toBe('human-vs-computer');
      expect(computerVsComputer).toBe('computer-vs-computer');
    });

    it('should work with array operations', () => {
      const allModes: GameMode[] = [
        'human-vs-human',
        'human-vs-computer',
        'computer-vs-computer'
      ];
      
      expect(allModes).toHaveLength(3);
      expect(allModes).toContain('human-vs-human');
    });

    it('should support mode detection logic', () => {
      const isComputerInvolved = (mode: GameMode): boolean => {
        return mode.includes('computer');
      };

      expect(isComputerInvolved('human-vs-human')).toBe(false);
      expect(isComputerInvolved('human-vs-computer')).toBe(true);
      expect(isComputerInvolved('computer-vs-computer')).toBe(true);
    });
  });

  describe('Type Integration', () => {
    it('should work together in complex type structures', () => {
      interface TestGameConfig {
        players: [Player, Player];
        board: Cell[];
        size: BoardSize;
        mode: GameMode;
      }

      const config: TestGameConfig = {
        players: ['X', 'O'],
        board: Array(9).fill(null),
        size: 3,
        mode: 'human-vs-computer'
      };

      expect(config.players).toEqual(['X', 'O']);
      expect(config.board).toHaveLength(9);
      expect(config.size).toBe(3);
      expect(config.mode).toBe('human-vs-computer');
    });

    it('should maintain type safety in function parameters', () => {
      const processGameMove = (
        player: Player,
        position: number,
        board: Cell[],
        boardSize: BoardSize
      ): boolean => {
        return position >= 0 && 
               position < boardSize * boardSize && 
               board[position] === null &&
               (player === 'X' || player === 'O');
      };

      const result = processGameMove('X', 4, Array(9).fill(null), 3);
      expect(result).toBe(true);
    });
  });
});