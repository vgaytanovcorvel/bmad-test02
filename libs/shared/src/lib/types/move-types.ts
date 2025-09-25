/**
 * Move and Result Types
 * 
 * This module defines types related to player moves and game results.
 * These types represent actions taken by players and outcomes of games.
 * 
 * @since 2.1.0
 */

import { Player, GameMode } from './game-types';

/**
 * Represents a single move made by a player during the game.
 * Contains all information needed to track and replay player actions.
 * 
 * @example
 * ```typescript
 * const move: Move = {
 *   player: 'X',
 *   position: 4, // Center position on 3x3 board
 *   timestamp: Date.now()
 * };
 * ```
 */
export interface Move {
  /** The player who made this move */
  readonly player: Player;
  
  /** 
   * The board position where the move was made.
   * For a 3x3 board: 0-8 (left-to-right, top-to-bottom)
   * For a 4x4 board: 0-15 (left-to-right, top-to-bottom)
   */
  readonly position: number;
  
  /** Timestamp when the move was made (milliseconds since epoch) */
  readonly timestamp: number;
}

/**
 * Represents the final result of a completed game.
 * Contains statistics and outcome information for analysis and display.
 * 
 * @example
 * ```typescript
 * const result: GameResult = {
 *   winner: 'X',
 *   winningLine: [0, 1, 2], // Top row
 *   totalMoves: 5,
 *   gameDuration: 45000, // 45 seconds
 *   gameMode: 'human-vs-computer'
 * };
 * ```
 */
export interface GameResult {
  /** The winning player, or null if the game was a draw */
  readonly winner: Player | null;
  
  /** 
   * Array of board positions that form the winning line.
   * null if the game was a draw.
   */
  readonly winningLine: readonly number[] | null;
  
  /** Total number of moves made during the game */
  readonly totalMoves: number;
  
  /** Duration of the game in milliseconds */
  readonly gameDuration: number;
  
  /** The mode the game was played in */
  readonly gameMode: GameMode;
}