/**
 * Test Data Factories for Game State
 * 
 * Provides factory functions to create consistent test data for various game scenarios.
 * All factories create immutable GameState objects for reliable testing.
 */

import { GameState, Player } from '@libs/shared';

export class GameStateFactory {
  /**
   * Creates a fresh, initial game state for testing
   */
  static createInitial(): GameState {
    return {
      board: Array(9).fill(null),
      currentPlayer: 'X' as Player,
      status: 'playing',
      winner: null,
      winningLine: null,
      moveHistory: [],
      config: {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human'
      },
      startTime: Date.now()
    };
  }
  
  /**
   * Creates a game state where X has won with top row [0,1,2]
   */
  static createXWinScenario(): GameState {
    return {
      ...this.createInitial(),
      board: ['X', 'X', 'X', 'O', 'O', null, null, null, null] as const,
      status: 'won',
      winner: 'X' as Player,
      winningLine: [0, 1, 2],
      moveHistory: [
        { player: 'X' as Player, position: 0, timestamp: Date.now() - 500 },
        { player: 'O' as Player, position: 3, timestamp: Date.now() - 400 },
        { player: 'X' as Player, position: 1, timestamp: Date.now() - 300 },
        { player: 'O' as Player, position: 4, timestamp: Date.now() - 200 },
        { player: 'X' as Player, position: 2, timestamp: Date.now() - 100 }
      ],
      currentPlayer: 'O' as Player,
      endTime: Date.now()
    };
  }
  
  /**
   * Creates a game state for human vs computer mode
   */
  static createHumanVsComputerMode(): GameState {
    return {
      ...this.createInitial(),
      config: {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-computer'
      }
    };
  }
  
  /**
   * Creates a game state where computer has a win opportunity
   */
  static createComputerWinOpportunity(): GameState {
    return {
      ...this.createHumanVsComputerMode(),
      board: ['X', 'X', null, 'O', 'O', null, null, null, null] as const,
      currentPlayer: 'O' as Player,
      moveHistory: [
        { player: 'X' as Player, position: 0, timestamp: Date.now() - 400 },
        { player: 'O' as Player, position: 3, timestamp: Date.now() - 300 },
        { player: 'X' as Player, position: 1, timestamp: Date.now() - 200 },
        { player: 'O' as Player, position: 4, timestamp: Date.now() - 100 }
      ]
    };
  }
  
  /**
   * Creates a game state where computer needs to block opponent win
   */
  static createComputerBlockScenario(): GameState {
    return {
      ...this.createHumanVsComputerMode(),
      board: ['O', 'O', null, 'X', null, null, null, null, null] as const,
      currentPlayer: 'X' as Player,
      moveHistory: [
        { player: 'X' as Player, position: 3, timestamp: Date.now() - 300 },
        { player: 'O' as Player, position: 0, timestamp: Date.now() - 200 },
        { player: 'O' as Player, position: 1, timestamp: Date.now() - 100 }
      ]
    };
  }
  
  /**
   * Creates a game state for 4x4 board
   */
  static create4x4Board(): GameState {
    return {
      ...this.createInitial(),
      board: Array(16).fill(null),
      config: {
        boardSize: 4,
        kInRow: 3,
        firstPlayer: 'X' as Player,
        mode: 'human-vs-human'
      }
    };
  }
  
  /**
   * Creates a draw game scenario
   */
  static createDrawScenario(): GameState {
    return {
      ...this.createInitial(),
      board: ['X', 'O', 'X', 'O', 'O', 'X', 'O', 'X', 'O'] as const,
      status: 'draw',
      winner: null,
      winningLine: null,
      currentPlayer: 'X' as Player,
      moveHistory: Array(9).fill(null).map((_, i) => ({
        player: (i % 2 === 0 ? 'X' : 'O') as Player,
        position: i,
        timestamp: Date.now() - (900 - i * 100)
      })),
      endTime: Date.now()
    };
  }
}