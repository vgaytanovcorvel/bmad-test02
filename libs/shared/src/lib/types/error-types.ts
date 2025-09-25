/**
 * Error Types
 * 
 * This module defines custom error types used throughout the game system.
 * These errors provide specific context for game-related failures.
 * 
 * @since 2.4.0
 */

/**
 * Custom error class for game-related operations.
 * Provides detailed context about game errors with error codes and additional information.
 * 
 * @example
 * ```typescript
 * throw new GameError(
 *   'Cannot apply move to terminal game',
 *   'TERMINAL_STATE_MOVE',
 *   { gameStatus: 'won', attemptedPosition: 5 }
 * );
 * ```
 */
export class GameError extends Error {
  /**
   * Creates a new GameError with detailed context information.
   * 
   * @param message - Human-readable error message
   * @param code - Specific error code for programmatic handling
   * @param context - Optional additional context information
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, GameError.prototype);
  }
}
