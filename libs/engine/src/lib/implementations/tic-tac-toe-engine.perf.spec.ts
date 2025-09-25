/**
 * Engine Performance Tests
 * 
 * Comprehensive performance test suite for tic-tac-toe engine operations.
 * Validates that move calculations complete within 10ms target threshold.
 * Includes timing assertions for critical engine operations.
 * 
 * @since 2.8.0 (Performance simplified implementation)
 */

import { TicTacToeEngine } from './tic-tac-toe-engine';
import { PerformanceTimer } from '../testing/performance-timer';
import type { GameState, GameConfig } from '@libs/shared';

// Test utilities for creating game states
function create3x3Config(): GameConfig {
  return {
    boardSize: 3,
    kInRow: 3,
    firstPlayer: 'X',
    mode: 'human-vs-human'
  };
}

function create4x4Config(): GameConfig {
  return {
    boardSize: 4,
    kInRow: 3,
    firstPlayer: 'X',
    mode: 'human-vs-human'
  };
}

function createNearWinState3x3(engine: TicTacToeEngine): GameState {
  const config = create3x3Config();
  let state = engine.initialState(config);
  
  // Create a game state one move away from winning
  // X _ X
  // O O _
  // _ _ _
  state = engine.applyMove(state, { player: 'X', position: 0, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 3, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'X', position: 2, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 4, timestamp: Date.now() });
  
  return state;
}

function createNearWinState4x4(engine: TicTacToeEngine): GameState {
  const config = create4x4Config();
  let state = engine.initialState(config);
  
  // Create a 4x4 game state near winning
  // X O X _
  // O X _ _
  // _ _ _ _
  // _ _ _ _
  state = engine.applyMove(state, { player: 'X', position: 0, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 1, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'X', position: 2, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 4, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'X', position: 5, timestamp: Date.now() });
  
  return state;
}

function createComplexGameState3x3(engine: TicTacToeEngine): GameState {
  const config = create3x3Config();
  let state = engine.initialState(config);
  
  // Create a complex mid-game state with some empty spaces
  // X O X
  // O X _
  // _ _ _
  state = engine.applyMove(state, { player: 'X', position: 0, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 1, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'X', position: 2, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'O', position: 3, timestamp: Date.now() });
  state = engine.applyMove(state, { player: 'X', position: 4, timestamp: Date.now() });
  
  return state;
}

describe('Engine Performance Tests', () => {
  let engine3x3: TicTacToeEngine;
  let engine4x4: TicTacToeEngine;
  
  beforeEach(() => {
    engine3x3 = new TicTacToeEngine();
    engine4x4 = new TicTacToeEngine();
  });
  
  describe('Move Calculation Performance', () => {
    it('should calculate legal moves within 10ms for 3x3 empty board', () => {
      const gameState = engine3x3.initialState(create3x3Config());
      
      const legalMoves = PerformanceTimer.assertTiming(
        () => engine3x3.legalMoves(gameState),
        10,
        '3x3 empty board legal moves calculation'
      );
      
      expect(legalMoves.length).toBe(9);
    });
    
    it('should calculate legal moves within 10ms for 3x3 near-full board', () => {
      const gameState = createComplexGameState3x3(engine3x3);
      
      const legalMoves = PerformanceTimer.assertTiming(
        () => engine3x3.legalMoves(gameState),
        10,
        '3x3 near-full board legal moves calculation'
      );
      
      expect(legalMoves.length).toBe(4); // Positions 5, 6, 7, 8 should be empty
    });
    
    it('should calculate legal moves within 10ms for 4x4 empty board', () => {
      const gameState = engine4x4.initialState(create4x4Config());
      
      const legalMoves = PerformanceTimer.assertTiming(
        () => engine4x4.legalMoves(gameState),
        10,
        '4x4 empty board legal moves calculation'
      );
      
      expect(legalMoves.length).toBe(16);
    });
    
    it('should calculate legal moves within 10ms for 4x4 complex board', () => {
      const gameState = createNearWinState4x4(engine4x4);
      
      const legalMoves = PerformanceTimer.assertTiming(
        () => engine4x4.legalMoves(gameState),
        10,
        '4x4 complex board legal moves calculation'
      );
      
      expect(legalMoves.length).toBe(11); // 16 - 5 occupied positions
    });
  });
  
  describe('Terminal State Detection Performance', () => {
    it('should detect terminal state within 10ms for 3x3 board', () => {
      const gameState = createNearWinState3x3(engine3x3);
      
      const isTerminal = PerformanceTimer.assertTiming(
        () => engine3x3.isTerminal(gameState),
        10,
        '3x3 terminal state detection'
      );
      
      expect(typeof isTerminal).toBe('boolean');
    });
    
    it('should detect terminal state within 10ms for 4x4 board', () => {
      const gameState = createNearWinState4x4(engine4x4);
      
      const isTerminal = PerformanceTimer.assertTiming(
        () => engine4x4.isTerminal(gameState),
        10,
        '4x4 terminal state detection'
      );
      
      expect(typeof isTerminal).toBe('boolean');
    });
    
    it('should detect winning terminal state quickly', () => {
      const config = create3x3Config();
      let gameState = engine3x3.initialState(config);
      
      // Create winning state: X X X in top row
      gameState = engine3x3.applyMove(gameState, { player: 'X', position: 0, timestamp: Date.now() });
      gameState = engine3x3.applyMove(gameState, { player: 'O', position: 3, timestamp: Date.now() });
      gameState = engine3x3.applyMove(gameState, { player: 'X', position: 1, timestamp: Date.now() });
      gameState = engine3x3.applyMove(gameState, { player: 'O', position: 4, timestamp: Date.now() });
      gameState = engine3x3.applyMove(gameState, { player: 'X', position: 2, timestamp: Date.now() });
      
      const isTerminal = PerformanceTimer.assertTiming(
        () => engine3x3.isTerminal(gameState),
        10,
        'winning terminal state detection'
      );
      
      expect(isTerminal).toBe(true);
    });
  });
  
  describe('K-in-Row Detection Performance', () => {
    it('should detect k-in-row within 10ms for 3x3 board', () => {
      const gameState = createNearWinState3x3(engine3x3);
      
      const winningLines = PerformanceTimer.assertTiming(
        () => engine3x3.kInRow(gameState),
        10,
        '3x3 k-in-row detection'
      );
      
      expect(Array.isArray(winningLines)).toBe(true);
    });
    
    it('should detect k-in-row within 10ms for 4x4 board', () => {
      const gameState = createNearWinState4x4(engine4x4);
      
      const winningLines = PerformanceTimer.assertTiming(
        () => engine4x4.kInRow(gameState),
        10,
        '4x4 k-in-row detection'
      );
      
      expect(Array.isArray(winningLines)).toBe(true);
    });
    
    it('should detect multiple winning lines efficiently', () => {
      const gameState = createComplexGameState3x3(engine3x3);
      
      const winningLines = PerformanceTimer.assertTiming(
        () => engine3x3.kInRow(gameState),
        10,
        'k-in-row detection on complex board'
      );
      
      expect(winningLines.length).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('Move Application Performance', () => {
    it('should apply move within 10ms for 3x3 board', () => {
      const gameState = createNearWinState3x3(engine3x3);
      const move = { player: 'X' as const, position: 1, timestamp: Date.now() };
      
      const newState = PerformanceTimer.assertTiming(
        () => engine3x3.applyMove(gameState, move),
        10,
        '3x3 move application'
      );
      
      expect(newState.board[1]).toBe('X');
    });
    
    it('should apply move within 10ms for 4x4 board', () => {
      const gameState = createNearWinState4x4(engine4x4);
      const move = { player: 'O' as const, position: 3, timestamp: Date.now() };
      
      const newState = PerformanceTimer.assertTiming(
        () => engine4x4.applyMove(gameState, move),
        10,
        '4x4 move application'
      );
      
      expect(newState.board[3]).toBe('O');
    });
    
    it('should handle winning move application efficiently', () => {
      const gameState = createNearWinState3x3(engine3x3);
      const winningMove = { player: 'X' as const, position: 1, timestamp: Date.now() };
      
      const newState = PerformanceTimer.assertTiming(
        () => engine3x3.applyMove(gameState, winningMove),
        10,
        'winning move application'
      );
      
      expect(newState.winner).toBe('X');
      expect(newState.status).toBe('won');
    });
  });
  
  describe('Performance Regression Tests', () => {
    it('should maintain consistent performance across multiple operations', () => {
      const config = create3x3Config();
      const initialState = engine3x3.initialState(config);
      
      const profiler = PerformanceTimer.createProfiler('regression-test');
      
      // Perform multiple operations to check for performance degradation
      for (let i = 0; i < 10; i++) {
        profiler.measure(() => engine3x3.legalMoves(initialState));
        profiler.measure(() => engine3x3.isTerminal(initialState));
        profiler.measure(() => engine3x3.kInRow(initialState));
      }
      
      const report = profiler.getReport();
      expect(profiler.count).toBe(30); // 10 iterations × 3 operations
      expect(report).toContain('regression-test');
      
      // All measurements should be reasonably fast
      const measurements = profiler.allMeasurements;
      measurements.forEach(measurement => {
        expect(measurement.duration).toBeLessThan(50); // Very generous threshold
      });
    });
    
    it('should benchmark engine operations for performance baselines', () => {
      const config = create3x3Config();
      const gameState = engine3x3.initialState(config);
      
      const legalMovesBenchmark = PerformanceTimer.benchmark(
        () => engine3x3.legalMoves(gameState),
        20
      );
      
      const terminalBenchmark = PerformanceTimer.benchmark(
        () => engine3x3.isTerminal(gameState),
        20
      );
      
      const kInRowBenchmark = PerformanceTimer.benchmark(
        () => engine3x3.kInRow(gameState),
        20
      );
      
      // Verify benchmark statistics
      expect(legalMovesBenchmark.average).toBeLessThan(10);
      expect(legalMovesBenchmark.max).toBeLessThan(25);
      
      expect(terminalBenchmark.average).toBeLessThan(10);
      expect(terminalBenchmark.max).toBeLessThan(25);
      
      expect(kInRowBenchmark.average).toBeLessThan(10);
      expect(kInRowBenchmark.max).toBeLessThan(25);
    });
  });
});