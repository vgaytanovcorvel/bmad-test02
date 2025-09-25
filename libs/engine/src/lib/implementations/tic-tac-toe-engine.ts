/**
 * TicTacToe Engine Implementation
 * 
 * Concrete implementation of the Engine interface for tic-tac-toe games.
 * Supports both 3x3 and 4x4 board sizes with k=3 win detection.
 * Provides comprehensive k-in-row detection and game state management with
 * immutable state objects and pure functional methods.
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Minimized object allocations in inner loops
 * - Efficient board access patterns with direct indexing
 * - Optimized terminal state detection to avoid duplicate calculations
 * - Streamlined move validation to reduce function call overhead
 * 
 * @since 2.2.0 (3x3 support)
 * @since 2.3.0 (4x4 support)
 * @since 2.8.0 (Performance optimizations)
 */

import type { Engine } from '../interfaces/engine.interface';
import type { GameState, GameConfig, Move, Player, Cell } from '@libs/shared';
import { WinDetector } from './win-detector';

/**
 * Complete tic-tac-toe engine implementation with k-in-row logic.
 * Supports both 3x3 and 4x4 boards with k=3 win condition.
 * Framework-independent with pure functional methods and immutable state.
 */
export class TicTacToeEngine implements Engine {
  private readonly winDetector: WinDetector;
  
  constructor() {
    this.winDetector = new WinDetector();
  }
  
  /**
   * Creates initial game state from configuration.
   * Generates a clean game state ready for the first move.
   * Supports both 3x3 (9 cells) and 4x4 (16 cells) board sizes.
   */
  initialState(config: GameConfig): GameState {
    const boardSize = config.boardSize * config.boardSize;
    const board: Cell[] = new Array(boardSize).fill(null);
    
    return {
      board: board as readonly Cell[],
      currentPlayer: config.firstPlayer,
      moveHistory: [],
      status: 'playing',
      winner: null,
      winningLine: null,
      config,
      startTime: Date.now()
    };
  }
  
  /**
   * Gets all legal moves for the current player.
   * Returns array of empty board positions.
   * OPTIMIZED: Uses efficient single-pass algorithm with optional terminal check optimization.
   */
  legalMoves(state: GameState): number[] {
    // Performance optimization: Check status first (faster than win detection for terminal games)
    if (state.status !== 'playing') {
      return [];
    }
    
    const legalPositions: number[] = [];
    const board = state.board;
    
    // Performance optimization: Direct array access with minimal function calls
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        legalPositions.push(i);
      }
    }
    
    return legalPositions;
  }
  
  /**
   * Applies a move to the game state and returns new immutable state.
   * Updates board, switches players, and checks for terminal conditions.
   */
  applyMove(state: GameState, move: Move): GameState {
    // Validate move
    if (this.isTerminal(state)) {
      throw new Error(`Cannot apply move to terminal game. Game status: ${state.status}, Winner: ${state.winner}`);
    }
    
    if (move.player !== state.currentPlayer) {
      throw new Error(`Move player ${move.player} does not match current player ${state.currentPlayer}`);
    }
    
    if (move.position < 0 || move.position >= state.board.length) {
      throw new Error(`Invalid move position: ${move.position}. Valid range: 0-${state.board.length - 1} for ${state.config.boardSize}x${state.config.boardSize} board`);
    }
    
    if (state.board[move.position] !== null) {
      throw new Error(`Cannot move to occupied cell at position ${move.position}. Cell contains: ${state.board[move.position]}`);
    }
    
    // Apply move to create new board
    const newBoard = [...state.board];
    newBoard[move.position] = move.player;
    
    // Create temporary state for win detection
    const tempState: GameState = {
      ...state,
      board: newBoard as readonly Cell[]
    };
    
    // Check for winning lines
    const winningLines = this.kInRow(tempState);
    const hasWinner = winningLines.length > 0;
    
    // Determine winner and status
    const winner = hasWinner ? move.player : null;
    const isDraw = this.winDetector.isDraw(tempState);
    
    let status: GameState['status'];
    if (winner) {
      status = 'won';
    } else if (isDraw) {
      status = 'draw';  
    } else {
      status = 'playing';
    }
    
    // Determine winning line (first one if multiple)
    const winningLine = hasWinner ? winningLines[0] : null;
    
    // Switch to next player (only if game continues)
    const nextPlayer = status === 'playing' ? this.getOpponentPlayer(move.player) : move.player;
    
    return {
      board: newBoard as readonly Cell[],
      currentPlayer: nextPlayer,
      moveHistory: [...state.moveHistory, move] as readonly Move[],
      status,
      winner,
      winningLine: winningLine as readonly number[] | null,
      config: state.config,
      startTime: state.startTime,
      endTime: status !== 'playing' ? Date.now() : undefined
    };
  }
  
  /**
   * Checks if the game is in a terminal state (won or draw).
   * OPTIMIZED: Combines win detection with draw check for efficiency.
   */
  isTerminal(state: GameState): boolean {
    // Performance optimization: Check for winner first (faster than full board scan)
    const winningLines = this.kInRow(state);
    if (winningLines.length > 0) {
      return true;
    }
    
    // Performance optimization: Inline draw check to avoid duplicate kInRow call
    return state.board.every(cell => cell !== null);
  }
  
  /**
   * Gets the winner of a terminal game state.
   * Throws error if called on non-terminal state.
   */
  winner(state: GameState): Player | null {
    if (!this.isTerminal(state)) {
      throw new Error('Cannot determine winner of non-terminal game state');
    }
    
    const winningLines = this.kInRow(state);
    if (winningLines.length > 0) {
      // Get winner from first position of first winning line
      const firstWinningPosition = winningLines[0][0];
      return state.board[firstWinningPosition] as Player;
    }
    
    return null; // Draw game
  }
  
  /**
   * Gets all k-in-row winning lines in the current state.
   * Delegates to WinDetector for comprehensive line detection.
   */
  kInRow(state: GameState): number[][] {
    return this.winDetector.kInRow(state);
  }
  
  /**
   * Utility method to get the opponent player.
   * @private
   */
  private getOpponentPlayer(player: Player): Player {
    return player === 'X' ? 'O' : 'X';
  }
}