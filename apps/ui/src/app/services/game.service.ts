import { Injectable, signal, computed } from '@angular/core';
import { GameEngine, ComputerPlayer } from '@libs/engine';
import { GameState, Move } from '@libs/shared';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private engine = new GameEngine();
  private computer = new ComputerPlayer();
  
  private _gameState = signal<GameState>(this.engine.createInitialState());
  
  // Public readonly signals
  gameState = computed(() => this._gameState());
  isTerminal = computed(() => {
    const state = this._gameState();
    return state.status === 'won' || state.status === 'draw';
  });
  currentPlayer = computed(() => this._gameState().currentPlayer);
  winner = computed(() => this._gameState().winner);
  status = computed(() => this._gameState().status);

  makeMove(position: number): void {
    const currentState = this._gameState();
    
    if (!this.engine.isValidMove(currentState, position)) {
      return;
    }

    const move: Move = {
      player: currentState.currentPlayer,
      position,
      timestamp: Date.now()
    };

    const newState = this.engine.processMove(currentState, move);
    this._gameState.set(newState);

    // If game is still playing and it's computer's turn, make computer move
    if (newState.status === 'playing' && newState.currentPlayer === 'O') {
      setTimeout(() => this.makeComputerMove(), 500); // Small delay for UX
    }
  }

  private makeComputerMove(): void {
    const currentState = this._gameState();
    
    if (currentState.status !== 'playing' || currentState.currentPlayer !== 'O') {
      return;
    }

    const position = this.computer.calculateNextMove(currentState);
    
    if (position >= 0) {
      const move: Move = {
        player: 'O',
        position,
        timestamp: Date.now()
      };

      const newState = this.engine.processMove(currentState, move);
      this._gameState.set(newState);
    }
  }

  resetGame(): void {
    this._gameState.set(this.engine.createInitialState());
  }

  isCellDisabled(position: number): boolean {
    const state = this._gameState();
    return !this.engine.isValidMove(state, position);
  }

  getCellValue(position: number): string {
    const state = this._gameState();
    const value = state.board[position];
    return value || '';
  }
}