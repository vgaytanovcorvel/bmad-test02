import { GameState, Player, Cell } from '@libs/shared';
import { isCellEmpty } from '@libs/shared';

export class ComputerPlayer {
  private readonly WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

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
    
    // Try each available move and evaluate using minimax
    for (const move of availableMoves) {
      const newBoard = this.makeMove(state.board, move, state.currentPlayer);
      const score = this.minimax(
        newBoard, 
        this.getOpponent(state.currentPlayer), 
        false, 
        0
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
    alpha = -Infinity,
    beta = Infinity
  ): number {
    const result = this.evaluateBoard(board);
    
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
          alpha,
          beta
        );
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
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
          alpha,
          beta
        );
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minScore;
    }
  }

  /**
   * Evaluate the current board state.
   * Returns the winner ('X' or 'O'), 'draw', or null if game is ongoing.
   */
  private evaluateBoard(board: readonly Cell[]): Player | 'draw' | null {
    // Check for wins
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return board[a] as Player;
      }
    }
    
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
  private findWinningMove(board: readonly Cell[], player: Player): number {
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      const values = [board[a], board[b], board[c]];
      const playerCount = values.filter(v => v === player).length;
      const emptyCount = values.filter(v => v === null).length;
      
      if (playerCount === 2 && emptyCount === 1) {
        if (board[a] === null) return a;
        if (board[b] === null) return b;
        if (board[c] === null) return c;
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