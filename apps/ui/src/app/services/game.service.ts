import { Injectable, signal, computed } from '@angular/core';
import { EngineFactory, Engine } from '@libs/engine';
import { GameState, GameConfig, Move } from '@libs/shared';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private engine!: Engine;
  private _gameState = signal<GameState | null>(null);
  
  // Public reactive state
  gameState = computed(() => this._gameState() ?? this.createInitialState());
  currentPlayer = computed(() => this.gameState().currentPlayer);
  board = computed(() => this.gameState().board);
  isTerminal = computed(() => {
    const state = this.gameState();
    return state ? this.engine.isTerminal(state) : false;
  });
  winner = computed(() => {
    const state = this.gameState();
    return state && this.isTerminal() ? this.engine.winner(state) : null;
  });
  winningLine = computed(() => this.gameState().winningLine);
  legalMoves = computed(() => {
    const state = this.gameState();
    return state ? this.engine.legalMoves(state) : [];
  });
  status = computed(() => this.gameState().status);

  constructor() {
    this.startNewGame();
  }

  startNewGame(config?: GameConfig): void {
    const gameConfig: GameConfig = config || {
      boardSize: 3,
      kInRow: 3,
      firstPlayer: 'X',
      mode: 'human-vs-human'
    };
    
    this.engine = EngineFactory.createEngine(gameConfig);
    this._gameState.set(this.engine.initialState(gameConfig));
  }

  makeMove(position: number): boolean {
    const currentState = this.gameState();
    if (!currentState || this.isTerminal()) return false;
    
    try {
      const move: Move = {
        player: currentState.currentPlayer,
        position,
        timestamp: Date.now()
      };
      const newState = this.engine.applyMove(currentState, move);
      this._gameState.set(newState);
      return true;
    } catch (error) {
      console.error('Invalid move:', error);
      return false;
    }
  }

  resetGame(): void {
    const config = this.gameState().config;
    this.startNewGame(config);
  }

  isCellDisabled(position: number): boolean {
    const legalMoves = this.legalMoves();
    return this.isTerminal() || !legalMoves.includes(position);
  }

  getCellValue(position: number): string {
    const value = this.gameState().board[position];
    return value || '';
  }

  // Legacy method compatibility
  isValidMove(state: GameState, position: number): boolean {
    return this.engine.legalMoves(state).includes(position);
  }

  private createInitialState(): GameState {
    if (!this.engine) {
      const config: GameConfig = {
        boardSize: 3,
        kInRow: 3,
        firstPlayer: 'X',
        mode: 'human-vs-human'
      };
      this.engine = EngineFactory.createEngine(config);
      return this.engine.initialState(config);
    }
    return this.gameState();
  }
}