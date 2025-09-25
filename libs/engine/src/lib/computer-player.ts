import { GameState, Player, Cell } from '@libs/shared';
import { isCellEmpty } from '@libs/shared';

export class ComputerPlayer {
  private readonly WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  calculateNextMove(state: GameState): number {
    const player = state.currentPlayer;
    const opponent = player === 'X' ? 'O' : 'X';
    
    // 1. Check if we can win
    const winningMove = this.findWinningMove(state.board, player);
    if (winningMove !== -1) return winningMove;
    
    // 2. Check if we need to block opponent's win
    const blockingMove = this.findWinningMove(state.board, opponent);
    if (blockingMove !== -1) return blockingMove;
    
    // 3. Take center if available
    if (isCellEmpty(state.board, 4)) return 4;
    
    // 4. Take corners
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (isCellEmpty(state.board, corner)) return corner;
    }
    
    // 5. Take any available spot
    return this.getFirstAvailableMove(state.board);
  }

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