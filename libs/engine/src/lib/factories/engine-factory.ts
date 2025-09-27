/**
 * Engine Factory Pattern
 * 
 * Factory class for creating configured Engine instances with validation.
 * Provides static methods for creating engines with GameConfig parameters,
 * including pre-configured factory methods for common game modes.
 * 
 * @since 2.7.0
 */

import type { Engine } from '../interfaces/engine.interface';
import type { GameConfig, Player, BoardSize, GameMode } from '@libs/shared';
import { TicTacToeEngine } from '../implementations/tic-tac-toe-engine';

/**
 * Factory for creating and configuring game engine instances.
 * Provides validation and convenience methods for engine creation.
 * 
 * @example
 * ```typescript
 * // Create engine with custom configuration
 * const config: GameConfig = {
 *   boardSize: 3,
 *   kInRow: 3,
 *   firstPlayer: 'X',
 *   mode: 'human-vs-human'
 * };
 * const engine = EngineFactory.createEngine(config);
 * 
 * // Create pre-configured engines
 * const engine3x3 = EngineFactory.create3x3Engine();
 * const engine4x4 = EngineFactory.create4x4Engine('O');
 * ```
 */
export class EngineFactory {
  /**
   * Creates a new Engine instance with the given configuration.
   * Validates configuration before creating engine instance.
   * 
   * @param config - Game configuration for engine initialization
   * @returns Configured engine instance ready for game creation
   * @throws {Error} If configuration is invalid
   * 
   * @example
   * ```typescript
   * const config: GameConfig = {
   *   boardSize: 4,
   *   kInRow: 3,
   *   firstPlayer: 'O',
   *   mode: 'human-vs-computer'
   * };
   * const engine = EngineFactory.createEngine(config);
   * const gameState = engine.initialState(config);
   * ```
   */
  static createEngine(config: GameConfig): Engine {
    this.validateConfig(config);
    return new TicTacToeEngine();
  }
  
  /**
   * Creates a pre-configured 3x3 engine with default settings.
   * Uses human-vs-human mode and specified first player.
   * 
   * @param firstPlayer - Player who moves first (defaults to 'X')
   * @returns Engine configured for 3x3 game
   * 
   * @example
   * ```typescript
   * const engine = EngineFactory.create3x3Engine();
   * const engineWithO = EngineFactory.create3x3Engine('O');
   * ```
   */
  static create3x3Engine(firstPlayer: Player = 'X'): Engine {
    const config: GameConfig = {
      boardSize: 3 as BoardSize,
      kInRow: 3,
      firstPlayer,
      mode: 'human-vs-human' as GameMode
    };
    return this.createEngine(config);
  }
  
  /**
   * Creates a pre-configured 4x4 engine with default settings.
   * Uses human-vs-human mode and specified first player.
   * 
   * @param firstPlayer - Player who moves first (defaults to 'X')
   * @returns Engine configured for 4x4 game
   * 
   * @example
   * ```typescript
   * const engine = EngineFactory.create4x4Engine();
   * const engineWithO = EngineFactory.create4x4Engine('O');
   * ```
   */
  static create4x4Engine(firstPlayer: Player = 'X'): Engine {
    const config: GameConfig = {
      boardSize: 4 as BoardSize,
      kInRow: 3,
      firstPlayer,
      mode: 'human-vs-human' as GameMode
    };
    return this.createEngine(config);
  }
  
  /**
   * Creates a pre-configured 7x7 engine with default settings.
   * Uses human-vs-human mode, k=4 win condition, and specified first player.
   * 
   * @param firstPlayer - Player who moves first (defaults to 'X')
   * @returns Engine configured for 7x7 game with 4-in-a-row win condition
   * 
   * @example
   * ```typescript
   * const engine = EngineFactory.create7x7Engine();
   * const engineWithO = EngineFactory.create7x7Engine('O');
   * ```
   */
  static create7x7Engine(firstPlayer: Player = 'X'): Engine {
    const config: GameConfig = {
      boardSize: 7 as BoardSize,
      kInRow: 4,
      firstPlayer,
      mode: 'human-vs-human' as GameMode
    };
    return this.createEngine(config);
  }
  
  /**
   * Creates an engine configured for human vs computer gameplay.
   * Supports 3x3, 4x4, and 7x7 board sizes with appropriate k values.
   * 
   * @param boardSize - Size of the game board (3, 4, or 7)
   * @param firstPlayer - Player who moves first (defaults to 'X')
   * @returns Engine configured for human vs computer mode
   * 
   * @example
   * ```typescript
   * const engine3x3 = EngineFactory.createHumanVsComputerEngine(3, 'X');
   * const engine4x4 = EngineFactory.createHumanVsComputerEngine(4, 'O');
   * const engine7x7 = EngineFactory.createHumanVsComputerEngine(7, 'X');
   * ```
   */
  static createHumanVsComputerEngine(boardSize: BoardSize, firstPlayer: Player = 'X'): Engine {
    const kInRow = boardSize === 7 ? 4 : 3;
    const config: GameConfig = {
      boardSize,
      kInRow,
      firstPlayer,
      mode: 'human-vs-computer' as GameMode
    };
    return this.createEngine(config);
  }
  
  /**
   * Validates game configuration parameters.
   * Ensures all configuration values are within acceptable ranges and types.
   * 
   * @param config - Configuration to validate
   * @throws {Error} If any configuration parameter is invalid
   * 
   * @private
   */
  private static validateConfig(config: GameConfig): void {
    if (!config) {
      throw new Error('GameConfig is required');
    }
    
    if (config.boardSize !== 3 && config.boardSize !== 4 && config.boardSize !== 7) {
      throw new Error(`Invalid board size: ${config.boardSize}. Must be 3, 4, or 7`);
    }
    
    if ((config.boardSize === 3 || config.boardSize === 4) && config.kInRow !== 3) {
      throw new Error(`Invalid k value: ${config.kInRow}. Must be 3 for 3x3 and 4x4 boards`);
    }
    
    if (config.boardSize === 7 && config.kInRow !== 4) {
      throw new Error(`Invalid k value: ${config.kInRow}. Must be 4 for 7x7 board`);
    }
    
    if (config.firstPlayer !== 'X' && config.firstPlayer !== 'O') {
      throw new Error(`Invalid first player: ${config.firstPlayer}. Must be 'X' or 'O'`);
    }
    
    if (!this.isValidGameMode(config.mode)) {
      throw new Error(`Invalid game mode: ${config.mode}. Must be 'human-vs-human', 'human-vs-computer', or 'computer-vs-computer'`);
    }
  }
  
  /**
   * Validates game mode parameter.
   * 
   * @param mode - Game mode to validate
   * @returns true if mode is valid, false otherwise
   * 
   * @private
   */
  private static isValidGameMode(mode: GameMode): boolean {
    const validModes: GameMode[] = ['human-vs-human', 'human-vs-computer', 'computer-vs-computer'];
    return validModes.includes(mode);
  }
}