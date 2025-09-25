# State Management

### Game Service Implementation

```typescript
import { Injectable, signal, computed } from '@angular/core';
import { GameEngine, GameState, GameConfig, Player, Move } from '@libs/engine';
import { ComputerPlayer } from '@libs/engine';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private engine = new GameEngine();
  private computerPlayer = new ComputerPlayer();
  
  // Core state signals
  private _gameState = signal<GameState>(this.engine.initialState({
    boardSize: 3,
    k: 3,
    mode: 'human-vs-human',
    firstPlayer: 'X'
  }));
  
  private _gameConfig = signal<GameConfig>({
    boardSize: 3,
    k: 3,
    mode: 'human-vs-human',
    firstPlayer: 'X'
  });
  
  // Public computed state
  gameState = computed(() => this._gameState());
  gameConfig = computed(() => this._gameConfig());
  currentPlayer = computed(() => this._gameState().currentPlayer);
  isTerminal = computed(() => this.engine.isTerminal(this._gameState()));
  winner = computed(() => this.engine.winner(this._gameState()));
  
  // Game actions
  makeMove(cellIndex: number): void {
    const currentState = this._gameState();
    const move: Move = { player: currentState.currentPlayer, position: cellIndex };
    
    try {
      const newState = this.engine.applyMove(currentState, move);
      this._gameState.set(newState);
      
      // Handle computer move if needed
      if (this._gameConfig().mode === 'human-vs-computer' && 
          !this.engine.isTerminal(newState) && 
          newState.currentPlayer === 'O') {
        this.makeComputerMove();
      }
    } catch (error) {
      console.error('Invalid move:', error);
      // Could emit error to UI component here
    }
  }
  
  private makeComputerMove(): void {
    setTimeout(() => { // Small delay for better UX
      const currentState = this._gameState();
      const computerMove = this.computerPlayer.getBestMove(currentState);
      
      if (computerMove) {
        const newState = this.engine.applyMove(currentState, computerMove);
        this._gameState.set(newState);
      }
    }, 300);
  }
  
  newGame(config?: Partial<GameConfig>): void {
    const newConfig = { ...this._gameConfig(), ...config };
    this._gameConfig.set(newConfig);
    this._gameState.set(this.engine.initialState(newConfig));
  }
  
  changeBoardSize(size: 3 | 4): void {
    this.newGame({ boardSize: size });
  }
  
  changeGameMode(mode: 'human-vs-human' | 'human-vs-computer'): void {
    this.newGame({ mode });
  }
}
```

### State Management Principles

1. **Signals-Based**: Use Angular Signals for reactive state management
2. **Service Layer**: Centralize game logic in Angular services
3. **Immutable Updates**: Always create new state objects, never mutate
4. **Computed Values**: Derive state using computed signals for efficiency
5. **Error Handling**: Graceful handling of invalid moves and game states
6. **Separation of Concerns**: Keep UI components focused on presentation
