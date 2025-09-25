// Game Types
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameStatus = 'playing' | 'won' | 'draw' | 'loading';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  status: GameStatus;
  moveHistory: Move[];
  winningLine?: number[];
}

export interface Move {
  player: Player;
  position: number;
  timestamp: number;
}