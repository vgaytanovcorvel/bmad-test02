/**
 * Game Engine Interface
 * 
 * This interface defines the contract for the core game engine that manages
 * game state transitions, move validation, and game flow. The engine provides
 * pure functional methods for game state management with immutable state objects.
 * 
 * @since 2.1.0
 */

import type { GameState, GameConfig, Move, Player } from '@libs/shared';

/**
 * Core game engine interface for tic-tac-toe games.
 * Provides pure functional methods for game state management with no side effects.
 * All methods return new state instances, ensuring immutability.
 * 
 * @example
 * ```typescript
 * const engine: Engine = new TicTacToeEngine();
 * 
 * // Create a new game
 * const config: GameConfig = {
 *   boardSize: 3,
 *   kInRow: 3,
 *   firstPlayer: 'X',
 *   mode: 'human-vs-human'
 * };
 * const initialState = engine.initialState(config);
 * 
 * // Make moves
 * const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
 * const newState = engine.applyMove(initialState, move);
 * 
 * // Check game status
 * if (engine.isTerminal(newState)) {
 *   const winner = engine.winner(newState);
 * }
 * ```
 */
export interface Engine {
  /**
   * Creates initial game state from configuration.
   * Generates a new, clean game state ready for the first move.
   * 
   * @param config - Game configuration settings
   * @returns New game state initialized according to configuration
   * 
   * @example
   * ```typescript
   * const config: GameConfig = {
   *   boardSize: 3,
   *   kInRow: 3,
   *   firstPlayer: 'X',
   *   mode: 'human-vs-computer'
   * };
   * const gameState = engine.initialState(config);
   * ```
   */
  initialState(config: GameConfig): GameState;
  
  /**
   * Gets all legal moves for the current player.
   * Returns an array of board positions where the current player can legally move.
   * 
   * @param state - Current game state
   * @returns Array of legal move positions (0-based board indices)
   * 
   * @example
   * ```typescript
   * const legalMoves = engine.legalMoves(gameState);
   * // Returns: [0, 2, 5, 6, 7, 8] for available positions
   * ```
   */
  legalMoves(state: GameState): number[];
  
  /**
   * Applies a move to the game state and returns the new state.
   * Creates a new immutable game state with the move applied.
   * Updates the board, switches players, and checks for game ending conditions.
   * 
   * @param state - Current game state
   * @param move - Move to apply
   * @returns New game state after move application
   * 
   * @throws {Error} If move is illegal (invalid position, cell occupied, game over)
   * @throws {Error} If move player doesn't match current player
   * 
   * @example
   * ```typescript
   * const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
   * const newState = engine.applyMove(gameState, move);
   * ```
   */
  applyMove(state: GameState, move: Move): GameState;
  
  /**
   * Checks if the game is in a terminal state.
   * A game is terminal when there is a winner or the board is full (draw).
   * 
   * @param state - Game state to check
   * @returns true if game is over (won or draw), false if still playing
   * 
   * @example
   * ```typescript
   * if (engine.isTerminal(gameState)) {
   *   console.log('Game over!');
   * }
   * ```
   */
  isTerminal(state: GameState): boolean;
  
  /**
   * Gets the winner of a terminal game.
   * Should only be called on terminal game states.
   * 
   * @param state - Terminal game state
   * @returns Winner player or null for draw games
   * 
   * @throws {Error} If called on a non-terminal game state
   * 
   * @example
   * ```typescript
   * if (engine.isTerminal(gameState)) {
   *   const winner = engine.winner(gameState);
   *   if (winner) {
   *     console.log(`${winner} wins!`);
   *   } else {
   *     console.log('Draw!');
   *   }
   * }
   * ```
   */
  winner(state: GameState): Player | null;
  
  /**
   * Gets all k-in-row winning lines in the current state.
   * Returns all sequences of positions that form winning combinations.
   * 
   * @param state - Game state to analyze
   * @returns Array containing all winning line coordinates
   * 
   * @example
   * ```typescript
   * const winningLines = engine.kInRow(gameState);
   * // Returns: [[0, 1, 2]] for top row win
   * // Returns: [[0, 4, 8], [2, 4, 6]] for multiple wins
   * // Returns: [] for no winning lines
   * ```
   */
  kInRow(state: GameState): number[][];
}