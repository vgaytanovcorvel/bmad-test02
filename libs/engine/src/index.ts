/**
 * Engine Library Public API
 * 
 * This module exports the complete public API of the engine library.
 * All engine interfaces, implementations, and functionality are available through this barrel.
 * 
 * @example
 * ```typescript
 * import { Engine, RuleSet, TicTacToeEngine } from '@libs/engine';
 * ```
 * 
 * @since 2.1.0
 */

// Export interfaces
export * from './lib/interfaces';

// Export implementations
export * from './lib/engine';
export * from './lib/computer-player';
export * from './lib/implementations';

// Export factories
export * from './lib/factories';

// Export testing utilities
export * from './lib/testing/performance-timer';
