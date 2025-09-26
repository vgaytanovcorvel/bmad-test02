import { GameState, Player, Cell } from '@libs/shared';
import { isCellEmpty } from '@libs/shared';

export class ComputerPlayer {
  /**
   * Check if there's a win starting from a given position in a specific direction.
   * Much more efficient than precalculating all combinations.
   */
  private checkLineWin(
    board: readonly Cell[], 
    startPos: number, 
    deltaRow: number, 
    deltaCol: number, 
    boardSize: number, 
    kInRow: number
  ): Player | null {
    const startRow = Math.floor(startPos / boardSize);
    const startCol = startPos % boardSize;
    
    // Check if we can fit k-in-a-row from this position in this direction
    const endRow = startRow + (kInRow - 1) * deltaRow;
    const endCol = startCol + (kInRow - 1) * deltaCol;
    
    if (endRow < 0 || endRow >= boardSize || endCol < 0 || endCol >= boardSize) {
      return null; // Line goes out of bounds
    }
    
    // Check if all positions in the line have the same non-null symbol
    const firstSymbol = board[startPos];
    if (!firstSymbol) return null;
    
    for (let i = 1; i < kInRow; i++) {
      const row = startRow + i * deltaRow;
      const col = startCol + i * deltaCol;
      const pos = row * boardSize + col;
      
      if (board[pos] !== firstSymbol) {
        return null;
      }
    }
    
    return firstSymbol as Player;
  }

  /**
   * Check for any winning line on the board.
   * Checks all four directions: horizontal, vertical, diagonal, anti-diagonal.
   */
  private findWinner(board: readonly Cell[], boardSize: number, kInRow: number): Player | null {
    // Direction vectors: [deltaRow, deltaCol]
    const directions = [
      [0, 1],   // Horizontal (right)
      [1, 0],   // Vertical (down)  
      [1, 1],   // Diagonal (down-right)
      [1, -1]   // Anti-diagonal (down-left)
    ];
    
    for (let pos = 0; pos < board.length; pos++) {
      if (!board[pos]) continue; // Skip empty cells
      
      for (const [deltaRow, deltaCol] of directions) {
        const winner = this.checkLineWin(board, pos, deltaRow, deltaCol, boardSize, kInRow);
        if (winner) {
          return winner;
        }
      }
    }
    
    return null;
  }

  /**
   * Calculate the best move using minimax exhaustive search algorithm.
   * Per FR4: Uses exhaustive search of possible continuations for perfect play.
   */
  calculateNextMove(state: GameState): number {
    const availableMoves = this.getAvailableMoves(state.board);
    
    if (availableMoves.length === 0) {
      return -1; // No moves available
    }
    
    if (availableMoves.length === 1) {
      return availableMoves[0]; // Only one move, no need for minimax
    }
    
    let bestMove = availableMoves[0];
    let bestScore = -Infinity;
    
    // Adjust max depth based on board size for performance
    const maxDepth = state.config.boardSize <= 3 ? 15 : Math.max(4, 16 - availableMoves.length);
    
    // Try each available move and evaluate using minimax
    for (const move of availableMoves) {
      const newBoard = this.makeMove(state.board, move, state.currentPlayer);
      const score = this.minimax(
        newBoard, 
        this.getOpponent(state.currentPlayer), 
        false, 
        0,
        state.config.boardSize,
        state.config.kInRow,
        -Infinity,
        Infinity,
        maxDepth // Dynamic depth based on board size
      );
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    
    return bestMove;
  }

  /**
   * Minimax algorithm for exhaustive search of game tree.
   * Returns the evaluation score for the current position.
   */
  private minimax(
    board: readonly Cell[], 
    currentPlayer: Player, 
    isMaximizing: boolean, 
    depth: number,
    boardSize: number,
    kInRow: number,
    alpha = -Infinity,
    beta = Infinity,
    maxDepth = 15
  ): number {
    // Prevent infinite recursion
    if (depth >= maxDepth) {
      return 0; // Return neutral score at max depth
    }
    
    const result = this.evaluateBoard(board, boardSize, kInRow);
    
    // Terminal states
    if (result !== null) {
      if (result === 'draw') return 0;
      // Return score adjusted by depth to prefer quicker wins/losses
      return isMaximizing ? (result === currentPlayer ? 10 - depth : -10 + depth) 
                          : (result === currentPlayer ? -10 + depth : 10 - depth);
    }
    
    const availableMoves = this.getAvailableMoves(board);
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of availableMoves) {
        const newBoard = this.makeMove(board, move, currentPlayer);
        const score = this.minimax(
          newBoard, 
          this.getOpponent(currentPlayer), 
          false, 
          depth + 1,
          boardSize,
          kInRow,
          alpha,
          beta,
          maxDepth
        );
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of availableMoves) {
        const newBoard = this.makeMove(board, move, currentPlayer);
        const score = this.minimax(
          newBoard, 
          this.getOpponent(currentPlayer), 
          true, 
          depth + 1,
          boardSize,
          kInRow,
          alpha,
          beta,
          maxDepth
        );
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      return minScore;
    }
  }

  /**
   * Evaluate the current board state.
   * Returns the winner ('X' or 'O'), 'draw', or null if game is ongoing.
   */
  private evaluateBoard(board: readonly Cell[], boardSize: number, kInRow: number): Player | 'draw' | null {
    // Check for winner using efficient line checking
    const winner = this.findWinner(board, boardSize, kInRow);
    if (winner) return winner;
    
    // Check for draw (board full with no winner)
    if (board.every(cell => cell !== null)) {
      return 'draw';
    }
    
    // Game is still ongoing
    return null;
  }

  /**
   * Get all available moves (empty cells) on the board.
   */
  private getAvailableMoves(board: readonly Cell[]): number[] {
    const moves: number[] = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        moves.push(i);
      }
    }
    return moves;
  }

  /**
   * Create a new board with the specified move applied.
   */
  private makeMove(board: readonly Cell[], position: number, player: Player): readonly Cell[] {
    const newBoard = [...board];
    newBoard[position] = player;
    return newBoard;
  }

  /**
   * Get the opponent player.
   */
  private getOpponent(player: Player): Player {
    return player === 'X' ? 'O' : 'X';
  }

  // Legacy methods kept for backward compatibility with existing tests
  private findWinningMove(board: readonly Cell[], player: Player, boardSize = 3, kInRow = 3): number {
    // Try each empty position to see if it creates a win
    for (let pos = 0; pos < board.length; pos++) {
      if (board[pos] !== null) continue; // Skip occupied cells
      
      // Temporarily place the player's symbol
      const testBoard = [...board];
      testBoard[pos] = player;
      
      // Check if this creates a win
      if (this.findWinner(testBoard, boardSize, kInRow) === player) {
        return pos;
      }
    }
    return -1;
  }

  private getFirstAvailableMove(board: readonly Cell[]): number {
    for (let i = 0; i < board.length; i++) {
      if (isCellEmpty(board, i)) return i;
    }
    return -1; // Should never happen in a valid game state
  }
}