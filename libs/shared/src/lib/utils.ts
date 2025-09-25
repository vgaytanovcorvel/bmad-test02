import { Cell, Player } from './types';

// Utility Functions

/**
 * Creates an empty tic-tac-toe board.
 * @returns Array of 9 null values representing an empty 3x3 board
 */
export function createEmptyBoard(): readonly Cell[] {
  return Array(9).fill(null);
}

/**
 * Validates if a position is within valid board bounds.
 * @param position - Board position to validate (0-8 for 3x3 board)
 * @returns true if position is valid, false otherwise
 */
export function isValidPosition(position: number): boolean {
  return Number.isInteger(position) && position >= 0 && position < 9;
}

/**
 * Formats a player value for display.
 * @param player - Player value or null for empty cell
 * @returns Emoji representation of the player or empty string
 */
export function formatPlayerSymbol(player: Player | null): string {
  if (player === null) return '';
  return player === 'X' ? '❌' : '⭕';
}

/**
 * Checks if a board cell is empty at the given position.
 * @param board - Game board array
 * @param position - Position to check
 * @returns true if cell is empty and position is valid
 */
export function isCellEmpty(board: readonly Cell[], position: number): boolean {
  return isValidPosition(position) && board[position] === null;
}

/**
 * Gets the opposing player.
 * @param player - Current player
 * @returns The opponent player
 */
export function getOpponent(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}