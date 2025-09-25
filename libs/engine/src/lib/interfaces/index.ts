/**
 * Engine Interfaces Barrel Export
 * 
 * This module exports all engine interfaces used across the tic-tac-toe game engine.
 * Import from this barrel to access engine interface contracts.
 * 
 * @example
 * ```typescript
 * import { Engine, RuleSet } from '@libs/engine';
 * ```
 * 
 * @since 2.1.0
 */

// Core engine interface
export * from './engine.interface';

// Rule validation interface
export * from './ruleset.interface';