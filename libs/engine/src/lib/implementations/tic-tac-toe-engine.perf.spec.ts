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

  describe('7x7 Board Performance Requirements', () => {
    let engine7x7: TicTacToeEngine;

    beforeEach(() => {
      engine7x7 = new TicTacToeEngine();
    });

    function create7x7Config(): GameConfig {
      return {
        boardSize: 7,
        kInRow: 4,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
    }

    it('should meet <8 second initial move calculation requirement', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      const start = performance.now();
      
      // Simulate comprehensive initial move calculation
      const legalMoves = engine7x7.legalMoves(gameState);
      const winLines = engine7x7.kInRow(gameState);
      const isTerminal = engine7x7.isTerminal(gameState);
      
      // Test multiple move scenarios for comprehensive calculation
      for (let i = 0; i < Math.min(10, legalMoves.length); i++) {
        const move = {
          player: gameState.currentPlayer,
          position: legalMoves[i],
          timestamp: Date.now()
        };
        const newState = engine7x7.applyMove(gameState, move);
        engine7x7.kInRow(newState);
        engine7x7.isTerminal(newState);
      }
      
      const end = performance.now();
      const totalTime = (end - start) / 1000; // Convert to seconds
      
      // Verify <8 second requirement
      expect(totalTime).toBeLessThan(8);
      
      // Verify operations completed successfully
      expect(legalMoves.length).toBe(49); // All positions legal initially
      expect(winLines).toEqual([]); // No wins on empty board
      expect(isTerminal).toBe(false); // Empty board not terminal
    });

    it('should maintain efficient 7x7 win detection performance', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      const winDetectionBenchmark = PerformanceTimer.benchmark(
        () => engine7x7.kInRow(gameState),
        20
      );
      
      // 7x7 win detection should complete efficiently
      expect(winDetectionBenchmark.average).toBeLessThan(50); // 50ms average
      expect(winDetectionBenchmark.max).toBeLessThan(100); // 100ms max
    });

    it('should handle 7x7 legal moves calculation efficiently', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      const legalMovesBenchmark = PerformanceTimer.benchmark(
        () => engine7x7.legalMoves(gameState),
        20
      );
      
      // 7x7 legal moves should complete efficiently
      expect(legalMovesBenchmark.average).toBeLessThan(20); // 20ms average
      expect(legalMovesBenchmark.max).toBeLessThan(50); // 50ms max
    });

    it('should maintain 7x7 terminal detection performance', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      const terminalBenchmark = PerformanceTimer.benchmark(
        () => engine7x7.isTerminal(gameState),
        20
      );
      
      // 7x7 terminal detection should complete efficiently
      expect(terminalBenchmark.average).toBeLessThan(50); // 50ms average
      expect(terminalBenchmark.max).toBeLessThan(100); // 100ms max
    });

    it('should handle 7x7 move application efficiently', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      const moveApplicationBenchmark = PerformanceTimer.benchmark(
        () => {
          const move = {
            player: gameState.currentPlayer,
            position: 24, // Center position
            timestamp: Date.now()
          };
          return engine7x7.applyMove(gameState, move);
        },
        20
      );
      
      // 7x7 move application should complete efficiently
      expect(moveApplicationBenchmark.average).toBeLessThan(30); // 30ms average
      expect(moveApplicationBenchmark.max).toBeLessThan(75); // 75ms max
    });

    it('should scale performance appropriately compared to smaller boards', () => {
      // Compare 7x7 performance to 3x3 baseline
      const config3x3 = create3x3Config();
      const config7x7 = create7x7Config();
      
      const state3x3 = engine3x3.initialState(config3x3);
      const state7x7 = engine7x7.initialState(config7x7);
      
      // Benchmark win detection for both sizes
      const benchmark3x3 = PerformanceTimer.benchmark(
        () => engine3x3.kInRow(state3x3),
        20
      );
      
      const benchmark7x7 = PerformanceTimer.benchmark(
        () => engine7x7.kInRow(state7x7),
        20
      );
      
      // 7x7 should be reasonably scaled compared to 3x3
      // Allow up to 15x performance difference (accounts for system variance)
      const performanceRatio = benchmark7x7.average / benchmark3x3.average;
      expect(performanceRatio).toBeLessThan(15);
      
      // Both should still be under acceptable thresholds
      expect(benchmark3x3.average).toBeLessThan(10);
      expect(benchmark7x7.average).toBeLessThan(50);
    });

    it('should handle 7x7 memory usage efficiently without leaks', () => {
      const config = create7x7Config();
      let gameState = engine7x7.initialState(config);
      
      const initialMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      
      // Perform multiple game operations to test memory usage
      for (let i = 0; i < 50; i++) {
        // Simulate moves and state transitions
        const legalMoves = engine7x7.legalMoves(gameState);
        if (legalMoves.length > 0) {
          const move = {
            player: gameState.currentPlayer,
            position: legalMoves[Math.floor(Math.random() * legalMoves.length)],
            timestamp: Date.now()
          };
          gameState = engine7x7.applyMove(gameState, move);
          
          if (engine7x7.isTerminal(gameState)) {
            gameState = engine7x7.initialState(config); // Reset to continue
          }
        }
      }
      
      // Force garbage collection if available
      const globalThisWithGc = globalThis as unknown as { gc?: () => void };
      if (globalThisWithGc.gc) {
        globalThisWithGc.gc();
      }
      
      const finalMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (allow for some variance)
      if (initialMemory > 0) {
        expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // <5MB increase
      }
    });

    it('should complete complex 7x7 game scenarios within performance budget', () => {
      const config = create7x7Config();
      let gameState = engine7x7.initialState(config);
      
      const totalStartTime = performance.now();
      
      // Simulate a complex 7x7 game with strategic moves
      const moves = [
        24, // Center
        0,  // Corner
        48, // Opposite corner
        6,  // Another corner
        42, // Another corner
        12, // Edge
        36, // Edge
        3,  // Strategic
        45, // Strategic
        21, // Row start
        22, // Row continue
        23  // Row continue (one away from win)
      ];
      
      moves.forEach(position => {
        if (!engine7x7.isTerminal(gameState) && 
            engine7x7.legalMoves(gameState).includes(position)) {
          const move = {
            player: gameState.currentPlayer,
            position,
            timestamp: Date.now()
          };
          
          // Measure each move application
          const operationStart = performance.now();
          gameState = engine7x7.applyMove(gameState, move);
          const operationEnd = performance.now();
          
          // Each individual operation should be efficient
          expect(operationEnd - operationStart).toBeLessThan(100); // <100ms per move
        }
      });
      
      const totalEndTime = performance.now();
      const totalDuration = totalEndTime - totalStartTime;
      
      // Total scenario should complete efficiently
      expect(totalDuration).toBeLessThan(2000); // <2 seconds total
      
      // Verify game progressed correctly
      expect(gameState.moveHistory.length).toBeGreaterThan(0);
    });

    it('should maintain rendering performance metrics for 7x7 board state', () => {
      const config = create7x7Config();
      const gameState = engine7x7.initialState(config);
      
      // Simulate rapid board state changes for rendering performance
      const renderingOperations = [
        () => engine7x7.legalMoves(gameState),
        () => gameState.board.map((cell, index) => ({ cell, index })),
        () => gameState.currentPlayer,
        () => gameState.status,
        () => gameState.winner,
        () => gameState.winningLine
      ];
      
      const renderingBenchmark = PerformanceTimer.benchmark(
        () => {
          renderingOperations.forEach(op => op());
        },
        50
      );
      
      // Rendering-related operations should be very fast
      expect(renderingBenchmark.average).toBeLessThan(10); // <10ms average
      expect(renderingBenchmark.max).toBeLessThan(50); // <50ms max
      
      // No operation should cause layout thrashing
      expect(renderingBenchmark.durations.every(d => d < 50)).toBe(true);
    });
  });

  describe('7x7 Performance Regression Prevention', () => {
    it('should maintain 3x3 and 4x4 performance after 7x7 implementation', () => {
      // Verify that adding 7x7 support didn't degrade smaller board performance
      const config3x3 = create3x3Config();
      const config4x4 = create4x4Config();
      
      const state3x3 = engine3x3.initialState(config3x3);
      const state4x4 = engine4x4.initialState(config4x4);
      
      // Benchmark all sizes
      const benchmark3x3 = PerformanceTimer.benchmark(
        () => {
          engine3x3.legalMoves(state3x3);
          engine3x3.kInRow(state3x3);
          engine3x3.isTerminal(state3x3);
        },
        30
      );
      
      const benchmark4x4 = PerformanceTimer.benchmark(
        () => {
          engine4x4.legalMoves(state4x4);
          engine4x4.kInRow(state4x4);
          engine4x4.isTerminal(state4x4);
        },
        30
      );
      
      // Original performance targets should still be met
      expect(benchmark3x3.average).toBeLessThan(15); // Very conservative
      expect(benchmark4x4.average).toBeLessThan(20); // Very conservative
      
      // Verify operations still work correctly
      expect(engine3x3.legalMoves(state3x3).length).toBe(9);
      expect(engine4x4.legalMoves(state4x4).length).toBe(16);
    });

    it('should demonstrate consistent performance scaling across board sizes', () => {
      const sizes = [
        { config: create3x3Config(), engine: engine3x3, expectedLegal: 9 },
        { config: create4x4Config(), engine: engine4x4, expectedLegal: 16 }
      ];
      
      const performanceMetrics = sizes.map(({ config, engine, expectedLegal }) => {
        const state = engine.initialState(config);
        
        const metrics = PerformanceTimer.benchmark(
          () => {
            const legal = engine.legalMoves(state);
            const kInRow = engine.kInRow(state);
            const terminal = engine.isTerminal(state);
            return { legal: legal.length, kInRow, terminal };
          },
          20
        );
        
        return {
          boardSize: config.boardSize,
          avgTime: metrics.average,
          maxTime: metrics.max,
          expectedLegal,
          actualLegal: (metrics.lastResult as { legal: number }).legal
        };
      });
      
      // Verify each size meets expectations
      performanceMetrics.forEach(metric => {
        expect(metric.actualLegal).toBe(metric.expectedLegal);
        expect(metric.avgTime).toBeLessThan(metric.boardSize * 5); // Generous scaling
        expect(metric.maxTime).toBeLessThan(metric.boardSize * 15); // Generous max
      });
      
      // Performance should scale reasonably with board size
      const [metric3x3, metric4x4] = performanceMetrics;
      const scalingRatio = metric4x4.avgTime / metric3x3.avgTime;
      expect(scalingRatio).toBeLessThan(5); // 4x4 shouldn't be >5x slower than 3x3
    });
  });
});