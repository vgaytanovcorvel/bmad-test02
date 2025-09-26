import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { EngineFactory, Engine, ComputerPlayer } from '@libs/engine';
import { GameState, GameConfig, Move, GameMode, BoardSize } from '@libs/shared';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {
  private engine!: Engine;
  private computerPlayer = new ComputerPlayer();
  private _gameState = signal<GameState | null>(null);
  
  // Timer cleanup
  private activeTimeouts: ReturnType<typeof setTimeout>[] = [];
  
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
  
  // New configuration signals for Story 3.3
  currentConfig = computed(() => this.gameState().config);
  currentMode = computed(() => this.currentConfig().mode);
  currentBoardSize = computed(() => this.currentConfig().boardSize);
  
  // Animation trigger signal for board size changes
  private _boardSizeChangeTrigger = signal(0);
  boardSizeChangeTrigger = this._boardSizeChangeTrigger.asReadonly();

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
      
      // After human move, check if computer should move next
      if (this.isHumanVsComputerMode() && !this.isTerminal()) {
        const timeoutId = setTimeout(() => this.executeComputerMove(), 500); // Small delay for UX
        this.activeTimeouts.push(timeoutId);
      }
      
      return true;
    } catch {
      // Invalid move - error is handled by returning false
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

  // Computer player integration methods for Story 3.3
  private isHumanVsComputerMode(): boolean {
    return this.currentMode() === 'human-vs-computer';
  }
  
  private isComputerTurn(): boolean {
    return this.isHumanVsComputerMode() && 
           this.gameState().currentPlayer === 'O' && 
           !this.isTerminal();
  }
  
  private executeComputerMove(): void {
    if (!this.isComputerTurn()) return;
    
    const currentState = this.gameState();
    
    try {
      // Use minimax algorithm for perfect play
      const computerPosition = this.computerPlayer.calculateNextMove(currentState);
      
      if (computerPosition >= 0) {
        this.makeComputerMove(computerPosition);
      }
    } catch {
      // Fallback to first legal move if minimax fails
      const legalMoves = this.legalMoves();
      if (legalMoves.length > 0) {
        this.makeComputerMove(legalMoves[0]);
      }
    }
  }
  
  private makeComputerMove(position: number): void {
    const currentState = this.gameState();
    if (!currentState || this.isTerminal()) return;
    
    try {
      const move: Move = {
        player: currentState.currentPlayer,
        position,
        timestamp: Date.now()
      };
      const newState = this.engine.applyMove(currentState, move);
      this._gameState.set(newState);
    } catch {
      // Invalid computer move - silently ignore as computer logic should prevent this
    }
  }

  // New configuration methods for Story 3.3
  changeGameMode(mode: GameMode): void {
    const currentConfig = this.currentConfig();
    if (currentConfig && this.canChangeConfiguration()) {
      const newConfig: GameConfig = { ...currentConfig, mode };
      this.startNewGame(newConfig);
    }
  }
  
  changeBoardSize(boardSize: BoardSize): void {
    const currentConfig = this.currentConfig();
    if (currentConfig && this.canChangeConfiguration()) {
      // Trigger animation signal before changing
      this._boardSizeChangeTrigger.set(this._boardSizeChangeTrigger() + 1);
      
      const newConfig: GameConfig = { ...currentConfig, boardSize };
      this.startNewGame(newConfig);
    }
  }
  
  // Configuration state validation
  private canChangeConfiguration(): boolean {
    // For now, allow changes at any time (starts new game)
    // Future enhancement could add confirmation dialog for active games
    return true;
  }
  
  // Utility method to check if game has started
  hasGameStarted(): boolean {
    const moveHistory = this.gameState().moveHistory;
    return moveHistory && moveHistory.length > 0;
  }
  
  // Utility method to check if game is in progress
  isGameInProgress(): boolean {
    return this.hasGameStarted() && !this.isTerminal();
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
  
  ngOnDestroy(): void {
    // Clean up all active timeouts
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts = [];
  }
}