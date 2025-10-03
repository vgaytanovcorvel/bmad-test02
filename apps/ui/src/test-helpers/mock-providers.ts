/**
 * Mock Service Providers for Testing
 * 
 * Provides factory functions to create mock services with proper jest spy setup.
 * All mocks include the necessary methods and signals for reliable testing.
 */

import { signal } from '@angular/core';
import { GameState, Player } from '@libs/shared';
import { GameStateFactory } from './game-state-factories';

/**
 * Creates a mock GameService with all necessary methods and signals
 */
export function createMockGameService() {
  const initialState = GameStateFactory.createInitial();
  
  const gameStateSignal = signal(initialState);
  const currentPlayerSignal = signal(initialState.currentPlayer);
  const boardSignal = signal(initialState.board);
  const isTerminalSignal = signal(false);
  const winnerSignal = signal<Player | null>(null);
  const winningLineSignal = signal<readonly number[] | null>(null);
  const legalMovesSignal = signal<readonly number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const statusSignal = signal<'playing' | 'won' | 'draw'>('playing');
  
  const boardSizeChangeTriggerSignal = signal(0);
  
  // Color signals for Story 7.1
  const xColorSignal = signal('#22d3ee');
  const oColorSignal = signal('#f9a8d4');

  const mockService = {
    // Signals
    gameState: gameStateSignal,
    currentPlayer: currentPlayerSignal,
    board: boardSignal,
    isTerminal: isTerminalSignal,
    winner: winnerSignal,
    winningLine: winningLineSignal,
    legalMoves: legalMovesSignal,
    status: statusSignal,
    boardSizeChangeTrigger: boardSizeChangeTriggerSignal.asReadonly(),
    
    // Color signals for Story 7.1
    currentXColor: xColorSignal.asReadonly(),
    currentOColor: oColorSignal.asReadonly(),
    
    // Methods
    makeMove: jest.fn().mockReturnValue(true),
    resetGame: jest.fn(),
    startNewGame: jest.fn(),
    isCellDisabled: jest.fn().mockReturnValue(false),
    getCellValue: jest.fn().mockReturnValue(''),
    isValidMove: jest.fn().mockReturnValue(true),
    changeGameMode: jest.fn(),
    changeBoardSize: jest.fn(),
    hasGameStarted: jest.fn().mockReturnValue(false),
    isGameInProgress: jest.fn().mockReturnValue(false),
    
    // Color methods for Story 7.1
    changeXColor: jest.fn(),
    changeOColor: jest.fn()
  };
  
  return mockService;
}

/**
 * Creates a mock VisualEnhancementService
 */
export function createMockVisualEnhancementService() {
  return {
    enhancementsEnabled: jest.fn().mockReturnValue(false),
    toggleEnhancements: jest.fn()
  };
}

/**
 * Creates a mock ComputerPlayer
 */
export function createMockComputerPlayer() {
  return {
    calculateNextMove: jest.fn().mockReturnValue(0)
  };
}

/**
 * Helper function to update mock GameService state
 */
export function updateMockGameServiceState(
  mockService: ReturnType<typeof createMockGameService>,
  newState: GameState
): void {
  mockService.gameState.set(newState);
  mockService.currentPlayer.set(newState.currentPlayer);
  mockService.board.set(newState.board);
  mockService.isTerminal.set(newState.status !== 'playing');
  mockService.winner.set(newState.winner);
  mockService.winningLine.set(newState.winningLine);
  mockService.status.set(newState.status);
  
  // Update legal moves based on board state
  const legalMoves = newState.board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
  mockService.legalMoves.set(legalMoves);
}

/**
 * Helper function to set up a winning scenario in mock service
 */
export function setupMockWinScenario(
  mockService: ReturnType<typeof createMockGameService>
): void {
  const winState = GameStateFactory.createXWinScenario();
  updateMockGameServiceState(mockService, winState);
}

/**
 * Helper function to set up human vs computer mode in mock service
 */
export function setupMockHumanVsComputerMode(
  mockService: ReturnType<typeof createMockGameService>
): void {
  const hvcState = GameStateFactory.createHumanVsComputerMode();
  updateMockGameServiceState(mockService, hvcState);
}