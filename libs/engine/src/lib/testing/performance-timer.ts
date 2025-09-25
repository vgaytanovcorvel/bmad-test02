/**
 * Performance Timer Utility
 * 
 * Provides timing measurement utilities for engine performance testing.
 * Supports optional timing assertions with configurable thresholds.
 * Designed for both unit testing and performance monitoring.
 * 
 * @since 2.8.0 (Performance simplified implementation)
 */

/**
 * Performance measurement result containing operation result and timing data.
 */
export interface PerformanceResult<T> {
  /** The result of the measured operation */
  result: T;
  /** Duration in milliseconds */
  duration: number;
  /** Timestamp when measurement started */
  startTime: number;
  /** Timestamp when measurement completed */
  endTime: number;
}

/**
 * Performance timing utility for engine operations.
 * Provides measurement and optional assertion capabilities for move calculations.
 */
export class PerformanceTimer {
  
  /**
   * Measures the execution time of an operation.
   * Uses high-resolution timing for accurate measurement.
   * 
   * @param operation - Function to measure
   * @returns Performance result with timing data and operation result
   * 
   * @example
   * ```typescript
   * const { result, duration } = PerformanceTimer.measureOperation(
   *   () => engine.legalMoves(gameState)
   * );
   * console.log(`Legal moves calculated in ${duration.toFixed(2)}ms`);
   * ```
   */
  static measureOperation<T>(operation: () => T): PerformanceResult<T> {
    const startTime = performance.now();
    const result = operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    return {
      result,
      duration,
      startTime,
      endTime
    };
  }
  
  /**
   * Measures operation with optional timing assertion.
   * Provides performance warning when target threshold is exceeded.
   * Designed for CI/CD performance monitoring without failing tests.
   * 
   * @param operation - Function to measure and assert timing for
   * @param maxDurationMs - Maximum acceptable duration in milliseconds
   * @param description - Description of the operation being measured
   * @returns The result of the operation
   * 
   * @example
   * ```typescript
   * const moves = PerformanceTimer.assertTiming(
   *   () => engine.legalMoves(gameState),
   *   10,
   *   '3x3 legal moves calculation'
   * );
   * ```
   */
  static assertTiming<T>(
    operation: () => T, 
    maxDurationMs: number, 
    description: string
  ): T {
    const { result, duration } = this.measureOperation(operation);
    
    // Optional assertion - provides warning but doesn't fail tests
    if (duration > maxDurationMs) {
      console.warn(
        `Performance warning: ${description} took ${duration.toFixed(2)}ms ` +
        `(target: ${maxDurationMs}ms, exceeded by ${(duration - maxDurationMs).toFixed(2)}ms)`
      );
    }
    
    return result;
  }
  
  /**
   * Runs multiple performance samples and returns statistical analysis.
   * Useful for performance benchmarking and regression detection.
   * 
   * @param operation - Function to measure multiple times
   * @param sampleCount - Number of samples to collect (default: 10)
   * @returns Performance statistics including min, max, average, and median
   * 
   * @example
   * ```typescript
   * const stats = PerformanceTimer.benchmark(
   *   () => engine.isTerminal(gameState),
   *   100
   * );
   * console.log(`Average: ${stats.average.toFixed(2)}ms, Median: ${stats.median.toFixed(2)}ms`);
   * ```
   */
  static benchmark<T>(
    operation: () => T,
    sampleCount = 10
  ): PerformanceBenchmark {
    if (sampleCount <= 0) {
      throw new Error('Sample count must be greater than 0');
    }
    
    const durations: number[] = [];
    let lastResult: T | undefined;
    
    // Collect timing samples
    for (let i = 0; i < sampleCount; i++) {
      const { result, duration } = this.measureOperation(operation);
      durations.push(duration);
      lastResult = result;
    }
    
    // Calculate statistics
    const sortedDurations = durations.slice().sort((a, b) => a - b);
    const min = sortedDurations[0] || 0;
    const max = sortedDurations[sortedDurations.length - 1] || 0;
    const average = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
    const median = sortedDurations[Math.floor(sortedDurations.length / 2)] || 0;
    
    return {
      sampleCount,
      durations,
      min,
      max,
      average,
      median,
      lastResult: lastResult as T // We know it exists because sampleCount > 0
    };
  }
  
  /**
   * Creates a performance profiler for repeated measurements.
   * Useful for tracking performance over multiple operations.
   * 
   * @param name - Name identifier for the profiler
   * @returns Performance profiler instance
   * 
   * @example
   * ```typescript
   * const profiler = PerformanceTimer.createProfiler('move-calculations');
   * 
   * const moves1 = profiler.measure(() => engine.legalMoves(state1));
   * const moves2 = profiler.measure(() => engine.legalMoves(state2));
   * 
   * console.log(profiler.getReport());
   * ```
   */
  static createProfiler(name: string): PerformanceProfiler {
    return new PerformanceProfiler(name);
  }
}

/**
 * Performance benchmark result with statistical analysis.
 */
export interface PerformanceBenchmark {
  /** Number of samples collected */
  sampleCount: number;
  /** Array of all duration measurements */
  durations: number[];
  /** Minimum duration recorded */
  min: number;
  /** Maximum duration recorded */
  max: number;
  /** Average duration across all samples */
  average: number;
  /** Median duration value */
  median: number;
  /** Result from the last operation (for validation) */
  lastResult: unknown;
}

/**
 * Performance profiler for tracking multiple measurements.
 */
export class PerformanceProfiler {
  private measurements: PerformanceResult<unknown>[] = [];
  
  constructor(private readonly name: string) {}
  
  /**
   * Measures and records a single operation.
   * 
   * @param operation - Function to measure
   * @returns The result of the operation
   */
  measure<T>(operation: () => T): T {
    const result = PerformanceTimer.measureOperation(operation);
    this.measurements.push(result);
    return result.result;
  }
  
  /**
   * Gets performance report for all measurements.
   * 
   * @returns Formatted performance report string
   */
  getReport(): string {
    if (this.measurements.length === 0) {
      return `Performance Report [${this.name}]: No measurements recorded`;
    }
    
    const durations = this.measurements.map(m => m.duration);
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const total = durations.reduce((sum, d) => sum + d, 0);
    
    return (
      `Performance Report [${this.name}]:\n` +
      `  Measurements: ${this.measurements.length}\n` +
      `  Total Time: ${total.toFixed(2)}ms\n` +
      `  Average: ${average.toFixed(2)}ms\n` +
      `  Min: ${min.toFixed(2)}ms\n` +
      `  Max: ${max.toFixed(2)}ms`
    );
  }
  
  /**
   * Clears all recorded measurements.
   */
  reset(): void {
    this.measurements = [];
  }
  
  /**
   * Gets the number of measurements recorded.
   */
  get count(): number {
    return this.measurements.length;
  }
  
  /**
   * Gets all recorded measurements.
   */
  get allMeasurements(): readonly PerformanceResult<unknown>[] {
    return [...this.measurements]; // Return a copy to prevent mutation
  }
}