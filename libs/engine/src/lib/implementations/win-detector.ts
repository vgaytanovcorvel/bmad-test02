/**
 * Win Detector Utility
 * 
 * Provides efficient k-in-row detection for 3x3 tic-tac-toe boards.
 * Implements separate methods for rows, columns, and diagonals detection
 * following enterprise standards with small, focused methods.
 * 
 * @since 2.2.0
 */

import type { Cell, GameState } from '@libs/shared';

/**
 * Utility class for detecting winning lines in tic-tac-toe games.
 * Optimized for 3x3 boards with k=3 consecutive cells to win.
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
   * Combines all k-in-row detection methods to find all winning lines.
   * Integrates results from row, column, and diagonal detection.
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
    const allWinningLines: number[][] = [];
    
    // Combine results from all detection methods
    allWinningLines.push(...this.checkRows(state.board));
    allWinningLines.push(...this.checkColumns(state.board));
    allWinningLines.push(...this.checkDiagonals(state.board));
    
    return allWinningLines;
  }
  
  /**
   * Checks if board is in a draw state.
   * Draw occurs when all positions are occupied but no winning lines exist.
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
    // Check if board is full
    const isBoardFull = state.board.every(cell => cell !== null);
    
    // Check if no winning lines exist
    const winningLines = this.kInRow(state);
    const hasWinner = winningLines.length > 0;
    
    return isBoardFull && !hasWinner;
  }
  
  /**
   * Utility method to check if a specific line of positions forms a win.
   * Validates that all positions contain the same non-null player.
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
    
    // Check if all positions have same non-null player
    return positions.every(pos => board[pos] === firstCell);
  }
}