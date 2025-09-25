import { GameState, Move, Player, Cell, GameConfig } from '@libs/shared';
import { createEmptyBoard, getOpponent, isCellEmpty } from '@libs/shared';

export class GameEngine {
  private readonly WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns  
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  createInitialState(firstPlayer: Player = 'X'): GameState {
    const config: GameConfig = {
      boardSize: 3,
      kInRow: 3,
      firstPlayer,
      mode: 'human-vs-human'
    };

    return {
      board: createEmptyBoard(),
      currentPlayer: firstPlayer,
      winner: null,
      status: 'playing',
      moveHistory: [],
      winningLine: null,
      config,
      startTime: Date.now()
    };
  }

  processMove(state: GameState, move: Move): GameState {
    if (!this.isValidMove(state, move.position)) {
      return state;
    }

    const newBoard = [...state.board];
    newBoard[move.position] = move.player;

    const winner = this.checkWinner(newBoard);
    const winningLine = winner ? this.getWinningLine(newBoard) : null;
    const isBoardFull = newBoard.every(cell => cell !== null);

    let status: GameState['status'];
    if (winner) {
      status = 'won';
    } else if (isBoardFull) {
      status = 'draw';
    } else {
      status = 'playing';
    }

    return {
      ...state,
      board: newBoard,
      currentPlayer: getOpponent(state.currentPlayer),
      winner,
      status,
      moveHistory: [...state.moveHistory, move],
      winningLine,
      endTime: (status === 'won' || status === 'draw') ? Date.now() : undefined
    };
  }

  isValidMove(state: GameState, position: number): boolean {
    return state.status === 'playing' && isCellEmpty(state.board, position);
  }

  checkWinner(board: readonly Cell[]): Player | null {
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }
    return null;
  }

  private getWinningLine(board: readonly Cell[]): number[] | null {
    for (const combination of this.WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combination;
      }
    }
    return null;
  }
}
