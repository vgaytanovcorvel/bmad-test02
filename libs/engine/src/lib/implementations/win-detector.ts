/**
 * Win Detector Utility
 * 
 * Provides efficient k-in-row detection for tic-tac-toe boards.
 * Supports both 3x3 and 4x4 board sizes with k=3 win condition.
 * Implements separate methods for rows, columns, and diagonals detection
 * following enterprise standards with small, focused methods.
 * 
 * @since 2.2.0 (3x3 support)
 * @since 2.3.0 (4x4 support)
 */

import type { Cell, GameState } from '@libs/shared';

/**
 * Utility class for detecting winning lines in tic-tac-toe games.
 * Supports both 3x3 and 4x4 boards with k=3 consecutive cells to win.
 * Automatically routes to appropriate detection methods based on board size.
 */
export class WinDetector {
  
  /**
   * Checks all rows for winning lines in a 3x3 board.
   * Iterates through rows 0-2, checking positions [0,1,2], [3,4,5], [6,7,8].
   * 
   * @param board - The current board state (9-element array)
   * @returns Array of winning row coordinates, empty if no row wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, null];
   * const detector = new WinDetector();
   * const result = detector.checkRows(board);
   * // Returns: [[0, 1, 2]]
   * ```
   */
  checkRows(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Check each row: [0,1,2], [3,4,5], [6,7,8]
    for (let row = 0; row < 3; row++) {
      const startIndex = row * 3;
      const positions = [startIndex, startIndex + 1, startIndex + 2];
      
      if (this.isWinningLine(board, positions)) {
        winningLines.push(positions);
      }
    }
    
    return winningLines;
  }
  
  /**
   * Checks all columns for winning lines in a 3x3 board.
   * Iterates through columns 0-2, checking positions [0,3,6], [1,4,7], [2,5,8].
   * 
   * @param board - The current board state (9-element array)
   * @returns Array of winning column coordinates, empty if no column wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', null, null, 'X', null, null, 'X', null, null];
   * const detector = new WinDetector();
   * const result = detector.checkColumns(board);
   * // Returns: [[0, 3, 6]]
   * ```
   */
  checkColumns(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Check each column: [0,3,6], [1,4,7], [2,5,8]
    for (let col = 0; col < 3; col++) {
      const positions = [col, col + 3, col + 6];
      
      if (this.isWinningLine(board, positions)) {
        winningLines.push(positions);
      }
    }
    
    return winningLines;
  }
  
  /**
   * Checks both diagonals for winning lines in a 3x3 board.
   * Checks main diagonal [0,4,8] and anti-diagonal [2,4,6].
   * 
   * @param board - The current board state (9-element array)
   * @returns Array of winning diagonal coordinates, empty if no diagonal wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X'];
   * const detector = new WinDetector();
   * const result = detector.checkDiagonals(board);
   * // Returns: [[0, 4, 8]]
   * ```
   */
  checkDiagonals(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Main diagonal: [0,4,8]
    const mainDiagonal = [0, 4, 8];
    if (this.isWinningLine(board, mainDiagonal)) {
      winningLines.push(mainDiagonal);
    }
    
    // Anti-diagonal: [2,4,6]
    const antiDiagonal = [2, 4, 6];
    if (this.isWinningLine(board, antiDiagonal)) {
      winningLines.push(antiDiagonal);
    }
    
    return winningLines;
  }
  
  /**
   * Checks all rows for winning lines in a 4x4 board.
   * Uses sliding window pattern to check 2 win positions per row.
   * Row 0: [0,1,2], [1,2,3] - Row 1: [4,5,6], [5,6,7], etc.
   * 
   * @param board - The current board state (16-element array)
   * @returns Array of winning row coordinates, empty if no row wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', 'X', 'X', null, null, null, null, null, ...];
   * const detector = new WinDetector();
   * const result = detector.checkRows4x4(board);
   * // Returns: [[0, 1, 2]]
   * ```
   */
  checkRows4x4(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Check each row with sliding window of size 3
    for (let row = 0; row < 4; row++) {
      for (let startCol = 0; startCol <= 1; startCol++) { // 2 windows per row
        const baseIndex = row * 4 + startCol;
        const positions = [baseIndex, baseIndex + 1, baseIndex + 2];
        
        if (this.isWinningLine(board, positions)) {
          winningLines.push(positions);
        }
      }
    }
    
    return winningLines;
  }

  /**
   * Checks all columns for winning lines in a 4x4 board.
   * Uses sliding window pattern to check 2 win positions per column.
   * Col 0: [0,4,8], [4,8,12] - Col 1: [1,5,9], [5,9,13], etc.
   * 
   * @param board - The current board state (16-element array)
   * @returns Array of winning column coordinates, empty if no column wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', null, null, null, 'X', null, null, null, 'X', ...];
   * const detector = new WinDetector();
   * const result = detector.checkColumns4x4(board);
   * // Returns: [[0, 4, 8]]
   * ```
   */
  checkColumns4x4(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Check each column with sliding window of size 3
    for (let col = 0; col < 4; col++) {
      for (let startRow = 0; startRow <= 1; startRow++) { // 2 windows per column
        const baseIndex = startRow * 4 + col;
        const positions = [baseIndex, baseIndex + 4, baseIndex + 8];
        
        if (this.isWinningLine(board, positions)) {
          winningLines.push(positions);
        }
      }
    }
    
    return winningLines;
  }

  /**
   * Checks both main and anti-diagonals for winning lines in a 4x4 board.
   * Main diagonals: [0,5,10], [1,6,11], [4,9,14], [5,10,15]
   * Anti-diagonals: [2,5,8], [3,6,9], [6,9,12], [7,10,13]
   * OPTIMIZED: Avoids array spread and forEach for better performance.
   * 
   * @param board - The current board state (16-element array)
   * @returns Array of winning diagonal coordinates, empty if no diagonal wins
   * 
   * @example
   * ```typescript
   * const board: Cell[] = ['X', null, null, null, null, 'X', null, null, null, null, 'X', ...];
   * const detector = new WinDetector();
   * const result = detector.checkDiagonals4x4(board);
   * // Returns: [[0, 5, 10]]
   * ```
   */
  checkDiagonals4x4(board: readonly Cell[]): number[][] {
    const winningLines: number[][] = [];
    
    // Performance optimization: Direct array access instead of spread operations
    // Main diagonals (top-left to bottom-right)
    const mainDiagonals = [
      [0, 5, 10], [1, 6, 11], [4, 9, 14], [5, 10, 15]
    ];
    
    // Anti-diagonals (top-right to bottom-left)  
    const antiDiagonals = [
      [2, 5, 8], [3, 6, 9], [6, 9, 12], [7, 10, 13]
    ];
    
    // Performance optimization: Manual loops instead of forEach
    for (let i = 0; i < mainDiagonals.length; i++) {
      if (this.isWinningLine(board, mainDiagonals[i])) {
        winningLines.push(mainDiagonals[i]);
      }
    }
    
    for (let i = 0; i < antiDiagonals.length; i++) {
      if (this.isWinningLine(board, antiDiagonals[i])) {
        winningLines.push(antiDiagonals[i]);
      }
    }
    
    return winningLines;
  }

  /**
   * Combines all k-in-row detection methods to find all winning lines.
   * Integrates results from row, column, and diagonal detection.
   * Automatically detects board size and routes to appropriate methods.
   * OPTIMIZED: Avoids spread operator and minimizes array allocations.
   * 
   * @param state - Current game state to analyze
   * @returns Array containing all winning line coordinates
   * 
   * @example
   * ```typescript
   * const detector = new WinDetector();
   * const winningLines = detector.kInRow(gameState);
   * // Returns: [[0, 1, 2]] for single row win
   * // Returns: [[0, 1, 2], [0, 3, 6]] for multiple wins
   * ```
   */
  kInRow(state: GameState): number[][] {
    const boardSize = state.config.boardSize;
    const allWinningLines: number[][] = [];
    
    if (boardSize === 3) {
      // Performance optimization: Direct method calls without intermediate arrays
      this.collectWinningLines(allWinningLines, this.checkRows(state.board));
      this.collectWinningLines(allWinningLines, this.checkColumns(state.board));
      this.collectWinningLines(allWinningLines, this.checkDiagonals(state.board));
    } else if (boardSize === 4) {
      // Performance optimization: Direct method calls without intermediate arrays
      this.collectWinningLines(allWinningLines, this.checkRows4x4(state.board));
      this.collectWinningLines(allWinningLines, this.checkColumns4x4(state.board));
      this.collectWinningLines(allWinningLines, this.checkDiagonals4x4(state.board));
    }
    
    return allWinningLines;
  }
  
  /**
   * Checks if board is in a draw state.
   * Draw occurs when all positions are occupied but no winning lines exist.
   * Works for both 3x3 (9 cells) and 4x4 (16 cells) boards.
   * 
   * @param state - Current game state to check
   * @returns true if game is a draw, false otherwise
   * 
   * @example
   * ```typescript
   * const detector = new WinDetector();
   * const isDrawState = detector.isDraw(gameState);
   * ```
   */
  isDraw(state: GameState): boolean {
    // Check if board is full (works for both 3x3 and 4x4)
    const isBoardFull = state.board.every(cell => cell !== null);
    
    // Check if no winning lines exist (updated kInRow handles both sizes)
    const winningLines = this.kInRow(state);
    const hasWinner = winningLines.length > 0;
    
    return isBoardFull && !hasWinner;
  }
  
  /**
   * Utility method to check if a specific line of positions forms a win.
   * Validates that all positions contain the same non-null player.
   * OPTIMIZED: Uses manual loop instead of array.every() for better performance.
   * 
   * @param board - The current board state
   * @param positions - Array of board positions to check
   * @returns true if positions form a winning line, false otherwise
   * 
   * @private
   */
  private isWinningLine(board: readonly Cell[], positions: number[]): boolean {
    const firstCell = board[positions[0]];
    
    // Empty cell cannot form winning line
    if (firstCell === null) {
      return false;
    }
    
    // Performance optimization: Manual loop avoids function call overhead
    for (let i = 1; i < positions.length; i++) {
      if (board[positions[i]] !== firstCell) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Utility method to efficiently collect winning lines without spread operations.
   * OPTIMIZED: Avoids array spread operations that create intermediate arrays.
   * 
   * @param target - Target array to collect winning lines into
   * @param source - Source array containing winning lines to collect
   * 
   * @private
   */
  private collectWinningLines(target: number[][], source: number[][]): void {
    for (let i = 0; i < source.length; i++) {
      target.push(source[i]);
    }
  }
}