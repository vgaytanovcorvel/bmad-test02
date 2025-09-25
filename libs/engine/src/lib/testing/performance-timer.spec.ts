/**
 * Performance Timer Tests
 * 
 * Comprehensive test suite for performance timing utilities.
 * Validates timing accuracy, assertion behavior, and benchmarking functionality.
 * 
 * @since 2.8.0
 */

import { PerformanceTimer, PerformanceProfiler } from './performance-timer';

describe('PerformanceTimer', () => {
  
  describe('measureOperation', () => {
    it('should measure operation duration accurately', () => {
      const operation = () => {
        // Simulate work with a loop
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };
      
      const result = PerformanceTimer.measureOperation(operation);
      
      expect(result.result).toBe(499500); // Expected sum result
      expect(result.duration).toBeGreaterThan(0);
      expect(result.startTime).toBeLessThan(result.endTime);
      expect(result.endTime - result.startTime).toBeCloseTo(result.duration, 1);
    });
    
    it('should handle operations returning different types', () => {
      const stringResult = PerformanceTimer.measureOperation(() => 'test');
      const numberResult = PerformanceTimer.measureOperation(() => 42);
      const booleanResult = PerformanceTimer.measureOperation(() => true);
      
      expect(stringResult.result).toBe('test');
      expect(numberResult.result).toBe(42);
      expect(booleanResult.result).toBe(true);
      
      expect(stringResult.duration).toBeGreaterThanOrEqual(0);
      expect(numberResult.duration).toBeGreaterThanOrEqual(0);
      expect(booleanResult.duration).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle operations that throw errors', () => {
      const operation = () => {
        throw new Error('Test error');
      };
      
      expect(() => PerformanceTimer.measureOperation(operation)).toThrow('Test error');
    });
  });
  
  describe('assertTiming', () => {
    let consoleSpy: jest.SpyInstance;
    
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });
    
    afterEach(() => {
      consoleSpy.mockRestore();
    });
    
    it('should return operation result without warning when under threshold', () => {
      const operation = () => 'fast operation';
      
      const result = PerformanceTimer.assertTiming(operation, 100, 'test operation');
      
      expect(result).toBe('fast operation');
      expect(consoleSpy).not.toHaveBeenCalled();
    });
    
    it('should warn when operation exceeds threshold', async () => {
      const operation = () => {
        // Force a delay to exceed threshold
        const start = performance.now();
        while (performance.now() - start < 50) {
          // Busy wait
        }
        return 'slow operation';
      };
      
      const result = PerformanceTimer.assertTiming(operation, 10, 'slow test operation');
      
      expect(result).toBe('slow operation');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performance warning: slow test operation took')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('target: 10ms')
      );
    });
    
    it('should handle operations returning complex types', () => {
      const complexResult = { data: [1, 2, 3], status: 'success' };
      const operation = () => complexResult;
      
      const result = PerformanceTimer.assertTiming(operation, 100, 'complex operation');
      
      expect(result).toEqual(complexResult);
      expect(result).toBe(complexResult); // Should return exact same reference
    });
  });
  
  describe('benchmark', () => {
    it('should collect multiple performance samples', () => {
      let counter = 0;
      const operation = () => {
        counter++;
        return counter * 2;
      };
      
      const benchmark = PerformanceTimer.benchmark(operation, 5);
      
      expect(benchmark.sampleCount).toBe(5);
      expect(benchmark.durations).toHaveLength(5);
      expect(benchmark.lastResult).toBe(10); // 5 * 2
      expect(benchmark.min).toBeGreaterThanOrEqual(0);
      expect(benchmark.max).toBeGreaterThanOrEqual(benchmark.min);
      expect(benchmark.average).toBeGreaterThanOrEqual(0);
      expect(benchmark.median).toBeGreaterThanOrEqual(0);
      expect(counter).toBe(5);
    });
    
    it('should calculate statistics correctly', () => {
      // Mock performance.now to return predictable values
      const originalNow = performance.now;
      let timeStep = 0;
      performance.now = jest.fn(() => {
        timeStep += 10; // Each call advances by 10ms
        return timeStep;
      });
      
      try {
        const operation = () => 'test';
        const benchmark = PerformanceTimer.benchmark(operation, 3);
        
        expect(benchmark.sampleCount).toBe(3);
        expect(benchmark.durations).toEqual([10, 10, 10]); // Each operation takes 10ms
        expect(benchmark.min).toBe(10);
        expect(benchmark.max).toBe(10);
        expect(benchmark.average).toBe(10);
        expect(benchmark.median).toBe(10);
      } finally {
        performance.now = originalNow;
      }
    });
    
    it('should use default sample count when not specified', () => {
      const operation = () => 'default test';
      const benchmark = PerformanceTimer.benchmark(operation);
      
      expect(benchmark.sampleCount).toBe(10);
      expect(benchmark.durations).toHaveLength(10);
    });
  });
  
  describe('createProfiler', () => {
    it('should create profiler with correct name', () => {
      const profiler = PerformanceTimer.createProfiler('test-profiler');
      
      expect(profiler).toBeInstanceOf(PerformanceProfiler);
      expect(profiler.count).toBe(0);
    });
  });
});

describe('PerformanceProfiler', () => {
  let profiler: PerformanceProfiler;
  
  beforeEach(() => {
    profiler = new PerformanceProfiler('test-profiler');
  });
  
  describe('measure', () => {
    it('should measure and record operations', () => {
      const result1 = profiler.measure(() => 'first');
      const result2 = profiler.measure(() => 42);
      
      expect(result1).toBe('first');
      expect(result2).toBe(42);
      expect(profiler.count).toBe(2);
    });
    
    it('should accumulate measurements', () => {
      expect(profiler.count).toBe(0);
      
      profiler.measure(() => 1);
      expect(profiler.count).toBe(1);
      
      profiler.measure(() => 2);
      expect(profiler.count).toBe(2);
      
      profiler.measure(() => 3);
      expect(profiler.count).toBe(3);
    });
  });
  
  describe('getReport', () => {
    it('should generate report with no measurements', () => {
      const report = profiler.getReport();
      
      expect(report).toContain('test-profiler');
      expect(report).toContain('No measurements recorded');
    });
    
    it('should generate report with measurements', () => {
      profiler.measure(() => 'test1');
      profiler.measure(() => 'test2');
      
      const report = profiler.getReport();
      
      expect(report).toContain('test-profiler');
      expect(report).toContain('Measurements: 2');
      expect(report).toContain('Total Time:');
      expect(report).toContain('Average:');
      expect(report).toContain('Min:');
      expect(report).toContain('Max:');
    });
  });
  
  describe('reset', () => {
    it('should clear all measurements', () => {
      profiler.measure(() => 'test1');
      profiler.measure(() => 'test2');
      expect(profiler.count).toBe(2);
      
      profiler.reset();
      expect(profiler.count).toBe(0);
      
      const report = profiler.getReport();
      expect(report).toContain('No measurements recorded');
    });
  });
  
  describe('allMeasurements', () => {
    it('should return all recorded measurements', () => {
      profiler.measure(() => 'first');
      profiler.measure(() => 'second');
      
      const measurements = profiler.allMeasurements;
      
      expect(measurements).toHaveLength(2);
      expect(measurements[0]?.result).toBe('first');
      expect(measurements[1]?.result).toBe('second');
      
      // Verify the profiler still has the correct count
      expect(profiler.count).toBe(2);
    });
  });
});