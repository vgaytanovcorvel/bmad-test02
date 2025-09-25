/**
 * Win Detector Unit Tests
 * 
 * Comprehensive test suite for k-in-row detection covering all winning scenarios,
 * edge cases, and performance requirements for 3x3 tic-tac-toe boards.
 * 
 * @since 2.2.0
 */

import { WinDetector } from './win-detector';
import type { Cell, GameState, GameConfig } from '@libs/shared';

describe('WinDetector', () => {
  let winDetector: WinDetector;
  
  beforeEach(() => {
    winDetector = new WinDetector();
  });
  
  /**
   * Helper function to create 3x3 GameState for testing
   */
  function createGameState(board: Cell[]): GameState {
    const config: GameConfig = {
      boardSize: 3,
      kInRow: 3,
      firstPlayer: 'X',
      mode: 'human-vs-human'
    };
    
    return {
      board: board as readonly Cell[],
      currentPlayer: 'X',
      moveHistory: [],
      status: 'playing',
      winner: null,
      winningLine: null,
      config,
      startTime: Date.now()
    };
  }

  /**
   * Helper function to create 4x4 GameState for testing
   */
  function createGameState4x4(board: Cell[]): GameState {
    const config: GameConfig = {
      boardSize: 4,
      kInRow: 3,
      firstPlayer: 'X',
      mode: 'human-vs-human'
    };
    
    return {
      board: board as readonly Cell[],
      currentPlayer: 'X',
      moveHistory: [],
      status: 'playing',
      winner: null,
      winningLine: null,
      config,
      startTime: Date.now()
    };
  }
  
  describe('Row Win Detection', () => {
    describe('checkRows method', () => {
      it('should detect top row win [0,1,2] with X', () => {
        const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([[0, 1, 2]]);
      });
      
      it('should detect top row win [0,1,2] with O', () => {
        const board: Cell[] = ['O', 'O', 'O', null, null, null, null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([[0, 1, 2]]);
      });
      
      it('should detect middle row win [3,4,5]', () => {
        const board: Cell[] = [null, null, null, 'X', 'X', 'X', null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([[3, 4, 5]]);
      });
      
      it('should detect bottom row win [6,7,8]', () => {
        const board: Cell[] = [null, null, null, null, null, null, 'O', 'O', 'O'];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([[6, 7, 8]]);
      });
      
      it('should detect multiple row wins', () => {
        const board: Cell[] = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual([0, 1, 2]);
        expect(result).toContainEqual([3, 4, 5]);
      });
      
      it('should not detect incomplete rows (2 in a row)', () => {
        const board: Cell[] = ['X', 'X', null, 'O', 'O', null, null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([]);
      });
      
      it('should not detect mixed player rows', () => {
        const board: Cell[] = ['X', 'O', 'X', null, null, null, null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([]);
      });
      
      it('should handle empty board', () => {
        const board: Cell[] = [null, null, null, null, null, null, null, null, null];
        const result = winDetector.checkRows(board);
        expect(result).toEqual([]);
      });
    });
  });
  
  describe('Column Win Detection', () => {
    describe('checkColumns method', () => {
      it('should detect left column win [0,3,6]', () => {
        const board: Cell[] = ['X', null, null, 'X', null, null, 'X', null, null];
        const result = winDetector.checkColumns(board);
        expect(result).toEqual([[0, 3, 6]]);
      });
      
      it('should detect middle column win [1,4,7]', () => {
        const board: Cell[] = [null, 'O', null, null, 'O', null, null, 'O', null];
        const result = winDetector.checkColumns(board);
        expect(result).toEqual([[1, 4, 7]]);
      });
      
      it('should detect right column win [2,5,8]', () => {
        const board: Cell[] = [null, null, 'X', null, null, 'X', null, null, 'X'];
        const result = winDetector.checkColumns(board);
        expect(result).toEqual([[2, 5, 8]]);
      });
      
      it('should detect multiple column wins', () => {
        const board: Cell[] = ['X', 'O', null, 'X', 'O', null, 'X', 'O', null];
        const result = winDetector.checkColumns(board);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual([0, 3, 6]);
        expect(result).toContainEqual([1, 4, 7]);
      });
      
      it('should not detect incomplete columns (2 in a column)', () => {
        const board: Cell[] = ['X', null, null, 'X', null, null, null, null, null];
        const result = winDetector.checkColumns(board);
        expect(result).toEqual([]);
      });
      
      it('should not detect mixed player columns', () => {
        const board: Cell[] = ['X', null, null, 'O', null, null, 'X', null, null];
        const result = winDetector.checkColumns(board);
        expect(result).toEqual([]);
      });
    });
  });
  
  describe('Diagonal Win Detection', () => {
    describe('checkDiagonals method', () => {
      it('should detect main diagonal win [0,4,8]', () => {
        const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X'];
        const result = winDetector.checkDiagonals(board);
        expect(result).toEqual([[0, 4, 8]]);
      });
      
      it('should detect anti-diagonal win [2,4,6]', () => {
        const board: Cell[] = [null, null, 'O', null, 'O', null, 'O', null, null];
        const result = winDetector.checkDiagonals(board);
        expect(result).toEqual([[2, 4, 6]]);
      });
      
      it('should detect both diagonal wins simultaneously', () => {
        const board: Cell[] = ['X', null, 'X', null, 'X', null, 'X', null, 'X'];
        const result = winDetector.checkDiagonals(board);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual([0, 4, 8]);
        expect(result).toContainEqual([2, 4, 6]);
      });
      
      it('should not detect incomplete diagonals', () => {
        const board: Cell[] = ['X', null, null, null, 'X', null, null, null, null];
        const result = winDetector.checkDiagonals(board);
        expect(result).toEqual([]);
      });
      
      it('should not detect mixed player diagonals', () => {
        const board: Cell[] = ['X', null, null, null, 'O', null, null, null, 'X'];
        const result = winDetector.checkDiagonals(board);
        expect(result).toEqual([]);
      });
    });
  });
  
  describe('Combined k-in-row Detection', () => {
    describe('kInRow method', () => {
      it('should return all winning lines when multiple exist', () => {
        // Board with row and column win
        const board: Cell[] = ['X', 'X', 'X', 'X', 'O', 'O', 'X', null, null];
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual([0, 1, 2]); // Row win
        expect(result).toContainEqual([0, 3, 6]); // Column win
      });
      
      it('should return empty array for no winning lines', () => {
        const board: Cell[] = ['X', 'O', null, 'O', 'X', null, null, null, null];
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        expect(result).toEqual([]);
      });
      
      it('should handle complex multiple win scenario', () => {
        // X wins with row, column, and diagonal: X X X | X X O | X O X
        const board: Cell[] = ['X', 'X', 'X', 'X', 'X', 'O', 'X', 'O', 'X'];
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        
        expect(result.length).toBeGreaterThanOrEqual(3);
        expect(result).toContainEqual([0, 1, 2]); // Top row
        expect(result).toContainEqual([0, 3, 6]); // Left column
        expect(result).toContainEqual([0, 4, 8]); // Main diagonal
      });
      
      it('should handle empty board', () => {
        const board: Cell[] = [null, null, null, null, null, null, null, null, null];
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        expect(result).toEqual([]);
      });
      
      it('should handle single move board', () => {
        const board: Cell[] = ['X', null, null, null, null, null, null, null, null];
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        expect(result).toEqual([]);
      });
    });
  });
  
  describe('Draw Detection', () => {
    describe('isDraw method', () => {
      it('should detect draw when board is full with no winner', () => {
        const board: Cell[] = ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
        const state = createGameState(board);
        expect(winDetector.isDraw(state)).toBe(true);
      });
      
      it('should not detect draw when board has winner', () => {
        const board: Cell[] = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
        const state = createGameState(board);
        expect(winDetector.isDraw(state)).toBe(false);
      });
      
      it('should not detect draw when board is not full', () => {
        const board: Cell[] = ['X', 'O', null, 'O', 'X', null, null, null, null];
        const state = createGameState(board);
        expect(winDetector.isDraw(state)).toBe(false);
      });
      
      it('should handle empty board as not draw', () => {
        const board: Cell[] = [null, null, null, null, null, null, null, null, null];
        const state = createGameState(board);
        expect(winDetector.isDraw(state)).toBe(false);
      });
      
      it('should detect another draw scenario', () => {
        const board: Cell[] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
        const state = createGameState(board);
        expect(winDetector.isDraw(state)).toBe(true);
      });
    });
  });
  
  describe('Edge Cases and Near-Miss Scenarios', () => {
    it('should not detect win with 2 in a row plus empty', () => {
      const board: Cell[] = ['X', 'X', null, null, null, null, null, null, null];
      const result = winDetector.checkRows(board);
      expect(result).toEqual([]);
    });
    
    it('should not detect win with 2 in a row plus opponent', () => {
      const board: Cell[] = ['X', 'X', 'O', null, null, null, null, null, null];
      const result = winDetector.checkRows(board);
      expect(result).toEqual([]);
    });
    
    it('should handle alternating pattern correctly', () => {
      const board: Cell[] = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
      const state = createGameState(board);
      
      const winningLines = winDetector.kInRow(state);
      expect(winningLines).toEqual([]);
      
      const isDraw = winDetector.isDraw(state);
      expect(isDraw).toBe(true);
    });
    
    it('should correctly identify complex near-miss scenarios', () => {
      // Almost diagonal win but blocked
      const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'O'];
      const state = createGameState(board);
      const result = winDetector.kInRow(state);
      expect(result).toEqual([]);
    });
  });
  
  describe('Performance Tests', () => {
    it('should complete detection in under 1ms for multiple scenarios', () => {
      const scenarios = [
        [null, null, null, null, null, null, null, null, null], // Empty
        ['X', 'X', 'X', null, null, null, null, null, null],     // Row win
        ['X', null, null, 'X', null, null, 'X', null, null],     // Column win
        ['X', null, null, null, 'X', null, null, null, 'X'],     // Diagonal win
        ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O']           // Draw
      ];
      
      scenarios.forEach(boardScenario => {
        const state = createGameState(boardScenario as Cell[]);
        
        const startTime = performance.now();
        winDetector.kInRow(state);
        const endTime = performance.now();
        
        const duration = endTime - startTime;
        expect(duration).toBeLessThan(1); // Less than 1ms
      });
    });
    
    it('should handle repeated detection calls efficiently', () => {
      const board: Cell[] = ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
      const state = createGameState(board);
      
      const startTime = performance.now();
      
      // Run detection 100 times
      for (let i = 0; i < 100; i++) {
        winDetector.kInRow(state);
      }
      
      const endTime = performance.now();
      const avgDuration = (endTime - startTime) / 100;
      
      expect(avgDuration).toBeLessThan(1); // Average under 1ms
    });
  });
  
  describe('All 8 Winning Line Combinations', () => {
    const winningCombinations = [
      { name: 'Top Row [0,1,2]', positions: [0, 1, 2] },
      { name: 'Middle Row [3,4,5]', positions: [3, 4, 5] },
      { name: 'Bottom Row [6,7,8]', positions: [6, 7, 8] },
      { name: 'Left Column [0,3,6]', positions: [0, 3, 6] },
      { name: 'Middle Column [1,4,7]', positions: [1, 4, 7] },
      { name: 'Right Column [2,5,8]', positions: [2, 5, 8] },
      { name: 'Main Diagonal [0,4,8]', positions: [0, 4, 8] },
      { name: 'Anti-diagonal [2,4,6]', positions: [2, 4, 6] }
    ];
    
    winningCombinations.forEach(combo => {
      it(`should detect ${combo.name} win with X`, () => {
        const board: Cell[] = new Array(9).fill(null);
        combo.positions.forEach(pos => board[pos] = 'X');
        
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(combo.positions);
      });
      
      it(`should detect ${combo.name} win with O`, () => {
        const board: Cell[] = new Array(9).fill(null);
        combo.positions.forEach(pos => board[pos] = 'O');
        
        const state = createGameState(board);
        const result = winDetector.kInRow(state);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(combo.positions);
      });
    });
  });

  describe('4x4 Board Support', () => {
    describe('4x4 Row Win Detection', () => {
      describe('checkRows4x4 method', () => {
        it('should detect row 0 win [0,1,2]', () => {
          const board: Cell[] = [
            'X', 'X', 'X', null,
            null, null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[0, 1, 2]]);
        });

        it('should detect row 0 win [1,2,3]', () => {
          const board: Cell[] = [
            null, 'O', 'O', 'O',
            null, null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[1, 2, 3]]);
        });

        it('should detect row 1 win [4,5,6]', () => {
          const board: Cell[] = [
            null, null, null, null,
            'X', 'X', 'X', null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[4, 5, 6]]);
        });

        it('should detect row 1 win [5,6,7]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, 'O', 'O', 'O',
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[5, 6, 7]]);
        });

        it('should detect row 2 win [8,9,10]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, null,
            'X', 'X', 'X', null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[8, 9, 10]]);
        });

        it('should detect row 2 win [9,10,11]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, null,
            null, 'O', 'O', 'O',
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[9, 10, 11]]);
        });

        it('should detect row 3 win [12,13,14]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, null,
            null, null, null, null,
            'X', 'X', 'X', null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[12, 13, 14]]);
        });

        it('should detect row 3 win [13,14,15]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, null,
            null, null, null, null,
            null, 'O', 'O', 'O'
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([[13, 14, 15]]);
        });

        it('should detect overlapping row wins [0,1,2] and [1,2,3]', () => {
          const board: Cell[] = [
            'X', 'X', 'X', 'X',
            null, null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toHaveLength(2);
          expect(result).toContainEqual([0, 1, 2]);
          expect(result).toContainEqual([1, 2, 3]);
        });

        it('should detect multiple separate row wins', () => {
          const board: Cell[] = [
            'X', 'X', 'X', null,
            'O', 'O', 'O', null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toHaveLength(2);
          expect(result).toContainEqual([0, 1, 2]);
          expect(result).toContainEqual([4, 5, 6]);
        });

        it('should not detect incomplete rows (2 in a row)', () => {
          const board: Cell[] = [
            'X', 'X', null, null,
            null, 'O', 'O', null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([]);
        });

        it('should not detect mixed player rows', () => {
          const board: Cell[] = [
            'X', 'O', 'X', null,
            null, null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkRows4x4(board);
          expect(result).toEqual([]);
        });
      });
    });

    describe('4x4 Column Win Detection', () => {
      describe('checkColumns4x4 method', () => {
        it('should detect column 0 win [0,4,8]', () => {
          const board: Cell[] = [
            'X', null, null, null,
            'X', null, null, null,
            'X', null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[0, 4, 8]]);
        });

        it('should detect column 0 win [4,8,12]', () => {
          const board: Cell[] = [
            null, null, null, null,
            'O', null, null, null,
            'O', null, null, null,
            'O', null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[4, 8, 12]]);
        });

        it('should detect column 1 win [1,5,9]', () => {
          const board: Cell[] = [
            null, 'X', null, null,
            null, 'X', null, null,
            null, 'X', null, null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[1, 5, 9]]);
        });

        it('should detect column 1 win [5,9,13]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, 'O', null, null,
            null, 'O', null, null,
            null, 'O', null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[5, 9, 13]]);
        });

        it('should detect column 2 win [2,6,10]', () => {
          const board: Cell[] = [
            null, null, 'X', null,
            null, null, 'X', null,
            null, null, 'X', null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[2, 6, 10]]);
        });

        it('should detect column 2 win [6,10,14]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, 'O', null,
            null, null, 'O', null,
            null, null, 'O', null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[6, 10, 14]]);
        });

        it('should detect column 3 win [3,7,11]', () => {
          const board: Cell[] = [
            null, null, null, 'X',
            null, null, null, 'X',
            null, null, null, 'X',
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[3, 7, 11]]);
        });

        it('should detect column 3 win [7,11,15]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, 'O',
            null, null, null, 'O',
            null, null, null, 'O'
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([[7, 11, 15]]);
        });

        it('should detect overlapping column wins [0,4,8] and [4,8,12]', () => {
          const board: Cell[] = [
            'X', null, null, null,
            'X', null, null, null,
            'X', null, null, null,
            'X', null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toHaveLength(2);
          expect(result).toContainEqual([0, 4, 8]);
          expect(result).toContainEqual([4, 8, 12]);
        });

        it('should detect multiple separate column wins', () => {
          const board: Cell[] = [
            'X', 'O', null, null,
            'X', 'O', null, null,
            'X', 'O', null, null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toHaveLength(2);
          expect(result).toContainEqual([0, 4, 8]);
          expect(result).toContainEqual([1, 5, 9]);
        });

        it('should not detect incomplete columns (2 in a column)', () => {
          const board: Cell[] = [
            'X', null, null, null,
            'X', null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([]);
        });

        it('should not detect mixed player columns', () => {
          const board: Cell[] = [
            'X', null, null, null,
            'O', null, null, null,
            'X', null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkColumns4x4(board);
          expect(result).toEqual([]);
        });
      });
    });

    describe('4x4 Diagonal Win Detection', () => {
      describe('checkDiagonals4x4 method', () => {
        it('should detect main diagonal win [0,5,10]', () => {
          const board: Cell[] = [
            'X', null, null, null,
            null, 'X', null, null,
            null, null, 'X', null,
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[0, 5, 10]]);
        });

        it('should detect main diagonal win [1,6,11]', () => {
          const board: Cell[] = [
            null, 'O', null, null,
            null, null, 'O', null,
            null, null, null, 'O',
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[1, 6, 11]]);
        });

        it('should detect main diagonal win [4,9,14]', () => {
          const board: Cell[] = [
            null, null, null, null,
            'X', null, null, null,
            null, 'X', null, null,
            null, null, 'X', null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[4, 9, 14]]);
        });

        it('should detect main diagonal win [5,10,15]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, 'O', null, null,
            null, null, 'O', null,
            null, null, null, 'O'
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[5, 10, 15]]);
        });

        it('should detect anti-diagonal win [2,5,8]', () => {
          const board: Cell[] = [
            null, null, 'X', null,
            null, 'X', null, null,
            'X', null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[2, 5, 8]]);
        });

        it('should detect anti-diagonal win [3,6,9]', () => {
          const board: Cell[] = [
            null, null, null, 'O',
            null, null, 'O', null,
            null, 'O', null, null,
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[3, 6, 9]]);
        });

        it('should detect anti-diagonal win [6,9,12]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, 'X', null,
            null, 'X', null, null,
            'X', null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[6, 9, 12]]);
        });

        it('should detect anti-diagonal win [7,10,13]', () => {
          const board: Cell[] = [
            null, null, null, null,
            null, null, null, 'O',
            null, null, 'O', null,
            null, 'O', null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([[7, 10, 13]]);
        });

        it('should detect multiple diagonal wins simultaneously', () => {
          const board: Cell[] = [
            'X', null, null, 'X',
            null, 'X', 'X', null,
            null, 'X', 'X', null,
            'X', null, null, 'X'
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result.length).toBeGreaterThan(0);
          // Multiple diagonals should be detected
        });

        it('should not detect incomplete diagonals', () => {
          const board: Cell[] = [
            'X', null, null, null,
            null, 'X', null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([]);
        });

        it('should not detect mixed player diagonals', () => {
          const board: Cell[] = [
            'X', null, null, null,
            null, 'O', null, null,
            null, null, 'X', null,
            null, null, null, null
          ];
          const result = winDetector.checkDiagonals4x4(board);
          expect(result).toEqual([]);
        });
      });
    });

    describe('4x4 Combined k-in-row Detection', () => {
      describe('kInRow method with 4x4 board', () => {
        it('should route to 4x4 detection methods', () => {
          const board: Cell[] = [
            'X', 'X', 'X', null,
            null, null, null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          expect(result).toEqual([[0, 1, 2]]);
        });

        it('should return all winning lines when multiple exist in 4x4', () => {
          const board: Cell[] = [
            'X', 'X', 'X', null,
            'X', 'O', 'O', null,
            'X', null, null, null,
            null, null, null, null
          ];
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          
          expect(result).toHaveLength(2);
          expect(result).toContainEqual([0, 1, 2]); // Row win
          expect(result).toContainEqual([0, 4, 8]); // Column win
        });

        it('should handle complex multiple win scenario in 4x4', () => {
          const board: Cell[] = [
            'X', 'X', 'X', 'X',
            'X', 'O', 'O', null,
            'X', null, null, null,
            'X', null, null, null
          ];
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          
          expect(result.length).toBeGreaterThanOrEqual(3);
          expect(result).toContainEqual([0, 1, 2]); // Row win [0,1,2]
          expect(result).toContainEqual([1, 2, 3]); // Row win [1,2,3]
          expect(result).toContainEqual([0, 4, 8]); // Column win [0,4,8]
        });

        it('should return empty array for no winning lines in 4x4', () => {
          const board: Cell[] = [
            'X', 'O', null, null,
            'O', 'X', null, null,
            null, null, null, null,
            null, null, null, null
          ];
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          expect(result).toEqual([]);
        });

        it('should handle empty 4x4 board', () => {
          const board: Cell[] = new Array(16).fill(null);
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          expect(result).toEqual([]);
        });

        it('should handle single move in 4x4 board', () => {
          const board: Cell[] = ['X', ...new Array(15).fill(null)];
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          expect(result).toEqual([]);
        });
      });
    });

    describe('4x4 Draw Detection', () => {
      describe('isDraw method with 4x4 board', () => {
      it('should detect draw when 4x4 board is full with no winner', () => {
        const board: Cell[] = [
          'X', 'O', 'X', 'O',
          'O', 'X', 'O', 'X',
          'O', 'X', 'O', 'X',
          'X', 'O', 'X', 'O'
        ];
        const state = createGameState4x4(board);
        expect(winDetector.isDraw(state)).toBe(true);
      });        it('should not detect draw when 4x4 board has winner', () => {
          const board: Cell[] = [
            'X', 'X', 'X', 'O',
            'O', 'X', 'O', 'X',
            'X', 'O', 'X', 'O',
            'O', 'X', 'O', 'X'
          ];
          const state = createGameState4x4(board);
          expect(winDetector.isDraw(state)).toBe(false);
        });

        it('should not detect draw when 4x4 board is not full', () => {
          const board: Cell[] = [
            'X', 'O', null, 'O',
            'O', 'X', null, 'X',
            null, null, null, null,
            null, null, null, null
          ];
          const state = createGameState4x4(board);
          expect(winDetector.isDraw(state)).toBe(false);
        });

        it('should handle empty 4x4 board as not draw', () => {
          const board: Cell[] = new Array(16).fill(null);
          const state = createGameState4x4(board);
          expect(winDetector.isDraw(state)).toBe(false);
        });

        it('should detect another 4x4 draw scenario', () => {
          const board: Cell[] = [
            'X', 'O', 'O', 'X',
            'O', 'X', 'X', 'O',
            'X', 'O', 'O', 'X',
            'O', 'X', 'X', 'O'
          ];
          const state = createGameState4x4(board);
          expect(winDetector.isDraw(state)).toBe(true);
        });
      });
    });

    describe('4x4 Performance Tests', () => {
      it('should complete 4x4 detection in under 1ms', () => {
        const scenarios = [
          new Array(16).fill(null), // Empty 4x4
          ['X', 'X', 'X', null, ...new Array(12).fill(null)], // Row win
          ['X', null, null, null, 'X', null, null, null, 'X', ...new Array(7).fill(null)], // Column win
          ['X', null, null, null, null, 'X', null, null, null, null, 'X', ...new Array(5).fill(null)] // Diagonal win
        ];
        
        scenarios.forEach(boardScenario => {
          const state = createGameState4x4(boardScenario as Cell[]);
          
          const startTime = performance.now();
          winDetector.kInRow(state);
          const endTime = performance.now();
          
          const duration = endTime - startTime;
          expect(duration).toBeLessThan(1); // Less than 1ms
        });
      });
    });

    describe('All 28 4x4 Winning Line Combinations', () => {
      const winning4x4Combinations = [
        // Row wins (8 total)
        { name: 'Row 0 [0,1,2]', positions: [0, 1, 2] },
        { name: 'Row 0 [1,2,3]', positions: [1, 2, 3] },
        { name: 'Row 1 [4,5,6]', positions: [4, 5, 6] },
        { name: 'Row 1 [5,6,7]', positions: [5, 6, 7] },
        { name: 'Row 2 [8,9,10]', positions: [8, 9, 10] },
        { name: 'Row 2 [9,10,11]', positions: [9, 10, 11] },
        { name: 'Row 3 [12,13,14]', positions: [12, 13, 14] },
        { name: 'Row 3 [13,14,15]', positions: [13, 14, 15] },
        
        // Column wins (8 total)
        { name: 'Col 0 [0,4,8]', positions: [0, 4, 8] },
        { name: 'Col 0 [4,8,12]', positions: [4, 8, 12] },
        { name: 'Col 1 [1,5,9]', positions: [1, 5, 9] },
        { name: 'Col 1 [5,9,13]', positions: [5, 9, 13] },
        { name: 'Col 2 [2,6,10]', positions: [2, 6, 10] },
        { name: 'Col 2 [6,10,14]', positions: [6, 10, 14] },
        { name: 'Col 3 [3,7,11]', positions: [3, 7, 11] },
        { name: 'Col 3 [7,11,15]', positions: [7, 11, 15] },
        
        // Main diagonal wins (4 total)
        { name: 'Main Diag [0,5,10]', positions: [0, 5, 10] },
        { name: 'Main Diag [1,6,11]', positions: [1, 6, 11] },
        { name: 'Main Diag [4,9,14]', positions: [4, 9, 14] },
        { name: 'Main Diag [5,10,15]', positions: [5, 10, 15] },
        
        // Anti-diagonal wins (4 total)
        { name: 'Anti-diag [2,5,8]', positions: [2, 5, 8] },
        { name: 'Anti-diag [3,6,9]', positions: [3, 6, 9] },
        { name: 'Anti-diag [6,9,12]', positions: [6, 9, 12] },
        { name: 'Anti-diag [7,10,13]', positions: [7, 10, 13] }
      ];
      
      winning4x4Combinations.forEach(combo => {
        it(`should detect 4x4 ${combo.name} win with X`, () => {
          const board: Cell[] = new Array(16).fill(null);
          combo.positions.forEach(pos => board[pos] = 'X');
          
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          
          expect(result).toHaveLength(1);
          expect(result[0]).toEqual(combo.positions);
        });
        
        it(`should detect 4x4 ${combo.name} win with O`, () => {
          const board: Cell[] = new Array(16).fill(null);
          combo.positions.forEach(pos => board[pos] = 'O');
          
          const state = createGameState4x4(board);
          const result = winDetector.kInRow(state);
          
          expect(result).toHaveLength(1);
          expect(result[0]).toEqual(combo.positions);
        });
      });
    });

    describe('4x4 Near-Miss Scenarios', () => {
      it('should not detect win with 2 in a row plus empty in 4x4', () => {
        const board: Cell[] = [
          'X', 'X', null, null,
          null, null, null, null,
          null, null, null, null,
          null, null, null, null
        ];
        const result = winDetector.checkRows4x4(board);
        expect(result).toEqual([]);
      });
      
      it('should not detect win with 2 in a row plus opponent in 4x4', () => {
        const board: Cell[] = [
          'X', 'X', 'O', null,
          null, null, null, null,
          null, null, null, null,
          null, null, null, null
        ];
        const result = winDetector.checkRows4x4(board);
        expect(result).toEqual([]);
      });
      
      it('should handle alternating pattern correctly in 4x4', () => {
        const board: Cell[] = [
          'X', 'O', 'X', 'O',
          'O', 'X', 'O', 'X',
          'O', 'X', 'O', 'X',
          'X', 'O', 'X', 'O'
        ];
        const state = createGameState4x4(board);
        
        const winningLines = winDetector.kInRow(state);
        expect(winningLines).toEqual([]);
        
        const isDraw = winDetector.isDraw(state);
        expect(isDraw).toBe(true);
      });
      
      it('should correctly identify complex 4x4 near-miss scenarios', () => {
        // Almost diagonal win but blocked
        const board: Cell[] = [
          'X', null, null, null,
          null, 'X', null, null,
          null, null, 'O', null,
          null, null, null, null
        ];
        const state = createGameState4x4(board);
        const result = winDetector.kInRow(state);
        expect(result).toEqual([]);
      });
    });

    describe('Cross-Board Size Compatibility', () => {
      it('should maintain 3x3 functionality after 4x4 implementation', () => {
        // Test that 3x3 still works exactly as before
        const board3x3: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
        const state3x3 = createGameState(board3x3);
        const result3x3 = winDetector.kInRow(state3x3);
        expect(result3x3).toEqual([[0, 1, 2]]);
        
        // Test that 4x4 works correctly  
        const board4x4: Cell[] = ['X', 'X', 'X', null, ...new Array(12).fill(null)];
        const state4x4 = createGameState4x4(board4x4);
        const result4x4 = winDetector.kInRow(state4x4);
        expect(result4x4).toEqual([[0, 1, 2]]);
      });

      it('should handle GameConfig integration correctly', () => {
        // Verify board size detection works correctly
        const board3x3: Cell[] = new Array(9).fill(null);
        const state3x3 = createGameState(board3x3);
        expect(state3x3.config.boardSize).toBe(3);
        
        const board4x4: Cell[] = new Array(16).fill(null);
        const state4x4 = createGameState4x4(board4x4);
        expect(state4x4.config.boardSize).toBe(4);
      });
    });
  });
});