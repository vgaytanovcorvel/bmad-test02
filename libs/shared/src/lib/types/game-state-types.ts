/**
 * Game State Types
 * 
 * This module defines types related to game configuration and state management.
 * These types represent the structure of game settings and current game state.
 * 
 * @since 2.1.0
 */

import { Player, Cell, BoardSize, GameMode } from './game-types';
import { Move } from './move-types';

/**
 * Configuration settings for initializing a new game.
 * Defines the parameters that determine how a game should be set up.
 * 
 * @example
 * ```typescript
 * const config: GameConfig = {
 *   boardSize: 3,
 *   kInRow: 3,
 *   firstPlayer: 'X',
 *   mode: 'human-vs-human'
 * };
 * ```
 */
export interface GameConfig {
  /** The size of the game board (3 for 3x3, 4 for 4x4) */
  readonly boardSize: BoardSize;
  
  /** Number of consecutive marks needed to win (always 3 for both board sizes) */
  readonly kInRow: number;
  
  /** Which player goes first */
  readonly firstPlayer: Player;
  
  /** The type of game being played */
  readonly mode: GameMode;
}

/**
 * Represents the complete state of a game at any point in time.
 * This is the core data structure that captures all information about a game.
 * All properties are readonly to ensure immutability.
 * 
 * @example
 * ```typescript
 * const gameState: GameState = {
 *   board: [null, 'X', null, 'O', null, null, null, null, null],
 *   currentPlayer: 'X',
 *   moveHistory: [
 *     { player: 'X', position: 1, timestamp: 1234567890 },
 *     { player: 'O', position: 3, timestamp: 1234567895 }
 *   ],
 *   status: 'playing',
 *   winner: null,
 *   winningLine: null,
 *   config: { boardSize: 3, kInRow: 3, firstPlayer: 'X', mode: 'human-vs-human' },
 *   startTime: 1234567880,
 *   endTime: undefined
 * };
 * ```
 */
export interface GameState {
  /** 
   * The current state of all cells on the board.
   * Array length is boardSize^2. Index 0 = top-left, increases left-to-right, top-to-bottom.
   */
  readonly board: readonly Cell[];
  
  /** The player whose turn it currently is */
  readonly currentPlayer: Player;
  
  /** Complete history of all moves made in the game */
  readonly moveHistory: readonly Move[];
  
  /** Current status of the game */
  readonly status: 'playing' | 'won' | 'draw';
  
  /** The winning player, or null if no winner yet */
  readonly winner: Player | null;
  
  /** 
   * Array of board positions that form the winning line.
   * null if no winning line exists yet.
   */
  readonly winningLine: readonly number[] | null;
  
  /** The configuration used to create this game */
  readonly config: GameConfig;
  
  /** Timestamp when the game was started (milliseconds since epoch) */
  readonly startTime: number;
  
  /** Timestamp when the game ended (milliseconds since epoch), undefined if still playing */
  readonly endTime?: number;
}