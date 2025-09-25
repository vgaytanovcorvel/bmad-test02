/**
 * Legacy Types Export
 * 
 * @deprecated Use imports from '@libs/shared' instead.
 * This file is maintained for backward compatibility and will be removed in a future version.
 * 
 * @example
 * ```typescript
 * // OLD (deprecated)
 * import { Player } from '@libs/shared/lib/types';
 * 
 * // NEW (preferred)
 * import { Player } from '@libs/shared';
 * ```
 * 
 * @since 1.0.0
 * @deprecated 2.1.0
 */

// Re-export all types from the new types directory for backward compatibility
export * from './types/game-types';
export * from './types/game-state-types';
export * from './types/move-types';

// Legacy type aliases for backward compatibility
export type CellValue = import('./types/game-types').Cell;
export type Board = readonly import('./types/game-types').Cell[];