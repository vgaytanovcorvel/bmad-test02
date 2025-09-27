/**
 * Core Game Types
 * 
 * This module defines the fundamental types used across the tic-tac-toe game system.
 * These types represent the basic building blocks of the game logic.
 * 
 * @since 2.1.0
 */

/**
 * Represents a player in the tic-tac-toe game.
 * 
 * @example
 * ```typescript
 * const currentPlayer: Player = 'X';
 * const nextPlayer: Player = 'O';
 * ```
 */
export type Player = 'X' | 'O';

/**
 * Represents the state of a single cell on the game board.
 * A cell can either contain a player's mark or be empty (null).
 * 
 * @example
 * ```typescript
 * const emptyCell: Cell = null;
 * const occupiedCell: Cell = 'X';
 * ```
 */
export type Cell = Player | null;

/**
 * Supported board sizes for the tic-tac-toe game.
 * Currently supports 3x3, 4x4, and 7x7 boards.
 * 
 * @example
 * ```typescript
 * const standardBoard: BoardSize = 3; // 3x3 board
 * const extendedBoard: BoardSize = 4; // 4x4 board
 * const largeBoard: BoardSize = 7; // 7x7 board
 * ```
 */
export type BoardSize = 3 | 4 | 7;

/**
 * Available game modes that determine the type of players involved.
 * 
 * @example
 * ```typescript
 * const pvp: GameMode = 'human-vs-human';
 * const pvc: GameMode = 'human-vs-computer';
 * const cvc: GameMode = 'computer-vs-computer';
 * ```
 */
export type GameMode = 'human-vs-human' | 'human-vs-computer' | 'computer-vs-computer';