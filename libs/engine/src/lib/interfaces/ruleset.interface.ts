/**
 * Rule Set Interface
 * 
 * This interface defines the contract for game rule validation and terminal state detection.
 * Implementations of this interface encapsulate all game-specific rules and logic
 * for determining valid moves, game endings, and winners.
 * 
 * @since 2.1.0
 */

import type { GameState, Move, Player } from '@libs/shared';

/**
 * Interface for game rule validation and state analysis.
 * Provides methods to validate moves, detect game endings, and determine winners
 * according to tic-tac-toe game rules.
 * 
 * @example
 * ```typescript
 * const ruleSet: RuleSet = new TicTacToeRuleSet();
 * 
 * // Check if a move is legal
 * const isValid = ruleSet.isLegalMove(gameState, move);
 * 
 * // Get all possible moves
 * const validPositions = ruleSet.getLegalMoves(gameState);
 * 
 * // Check if game is over
 * if (ruleSet.isTerminal(gameState)) {
 *   const winner = ruleSet.getWinner(gameState);
 * }
 * ```
 */
export interface RuleSet {
  /**
   * Validates if a move is legal in the current game state.
   * Checks that the position is valid, the cell is empty, and the game is still active.
   * 
   * @param state - Current game state
   * @param move - Proposed move to validate
   * @returns true if the move is legal, false otherwise
   * 
   * @example
   * ```typescript
   * const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
   * const isValid = ruleSet.isLegalMove(gameState, move);
   * ```
   */
  isLegalMove(state: GameState, move: Move): boolean;
  
  /**
   * Gets all legal move positions for the current player.
   * Returns an array of board positions where the current player can legally move.
   * 
   * @param state - Current game state
   * @returns Array of valid position indices (empty cells)
   * 
   * @example
   * ```typescript
   * const legalMoves = ruleSet.getLegalMoves(gameState);
   * // Returns: [0, 2, 5, 6, 7, 8] for positions that are empty
   * ```
   */
  getLegalMoves(state: GameState): number[];
  
  /**
   * Checks if the game has reached a terminal state (won or draw).
   * A game is terminal when there is a winner or no more legal moves available.
   * 
   * @param state - Current game state
   * @returns true if game is over (win or draw), false if still playing
   * 
   * @example
   * ```typescript
   * if (ruleSet.isTerminal(gameState)) {
   *   console.log('Game over!');
   * }
   * ```
   */
  isTerminal(state: GameState): boolean;
  
  /**
   * Determines the winner of a terminal game state.
   * Should only be called on terminal states. Returns null for draw games.
   * 
   * @param state - Terminal game state
   * @returns Winning player or null for draw
   * 
   * @throws {Error} If called on a non-terminal game state
   * 
   * @example
   * ```typescript
   * if (ruleSet.isTerminal(gameState)) {
   *   const winner = ruleSet.getWinner(gameState);
   *   if (winner) {
   *     console.log(`${winner} wins!`);
   *   } else {
   *     console.log('Draw game!');
   *   }
   * }
   * ```
   */
  getWinner(state: GameState): Player | null;
  
  /**
   * Finds all winning lines in the current state.
   * Returns all sequences of positions that form winning combinations (k-in-a-row).
   * 
   * @param state - Game state to analyze
   * @returns Array of winning line position arrays, or empty array if no wins
   * 
   * @example
   * ```typescript
   * const winningLines = ruleSet.getWinningLines(gameState);
   * // Returns: [[0, 1, 2]] for top row win
   * // Returns: [[0, 4, 8], [2, 4, 6]] for multiple winning lines
   * // Returns: [] for no wins
   * ```
   */
  getWinningLines(state: GameState): number[][];
}