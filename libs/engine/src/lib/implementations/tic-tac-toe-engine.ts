/**
 * TicTacToe Engine Implementation
 * 
 * Concrete implementation of the Engine interface for 3x3 tic-tac-toe games.
 * Provides comprehensive k-in-row detection and game state management with
 * immutable state objects and pure functional methods.
 * 
 * @since 2.2.0
 */

import type { Engine } from '../interfaces/engine.interface';
import type { GameState, GameConfig, Move, Player, Cell } from '@libs/shared';
import { WinDetector } from './win-detector';

/**
 * Complete tic-tac-toe engine implementation with k-in-row logic.
 * Framework-independent with pure functional methods and immutable state.
 */
export class TicTacToeEngine implements Engine {
  private readonly winDetector: WinDetector;
  
  constructor() {
    this.winDetector = new WinDetector();
  }
  
  /**
   * Creates initial game state from configuration.
   * Generates a clean 3x3 game state ready for the first move.
   */
  initialState(config: GameConfig): GameState {
    const board: Cell[] = new Array(9).fill(null);
    
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
   */
  legalMoves(state: GameState): number[] {
    if (this.isTerminal(state)) {
      return [];
    }
    
    const legalPositions: number[] = [];
    for (let i = 0; i < state.board.length; i++) {
      if (state.board[i] === null) {
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
      throw new Error('Cannot apply move to terminal game state');
    }
    
    if (move.player !== state.currentPlayer) {
      throw new Error(`Move player ${move.player} does not match current player ${state.currentPlayer}`);
    }
    
    if (move.position < 0 || move.position >= state.board.length) {
      throw new Error(`Invalid position ${move.position} for board size ${state.board.length}`);
    }
    
    if (state.board[move.position] !== null) {
      throw new Error(`Position ${move.position} is already occupied`);
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
   */
  isTerminal(state: GameState): boolean {
    const winningLines = this.kInRow(state);
    const hasWinner = winningLines.length > 0;
    const isDraw = this.winDetector.isDraw(state);
    
    return hasWinner || isDraw;
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