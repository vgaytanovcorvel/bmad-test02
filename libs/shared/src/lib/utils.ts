import { Board, Player } from './types';

// Utility Functions
export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function isValidPosition(position: number): boolean {
  return Number.isInteger(position) && position >= 0 && position < 9;
}

export function formatPlayerSymbol(player: Player | null): string {
  if (player === null) return '';
  return player === 'X' ? '❌' : '⭕';
}

export function isCellEmpty(board: Board, position: number): boolean {
  return isValidPosition(position) && board[position] === null;
}

export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}