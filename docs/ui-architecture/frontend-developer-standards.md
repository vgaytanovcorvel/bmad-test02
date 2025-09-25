# Frontend Developer Standards

### Critical Coding Rules

1. **TypeScript Strict Mode**: Always use strict TypeScript configuration
2. **Standalone Components**: Use Angular 17+ standalone component pattern
3. **OnPush Change Detection**: Default to OnPush for all components
4. **Signal-Based State**: Use Angular Signals over RxJS for simple state
5. **Dependency Injection**: Use `inject()` function over constructor injection
6. **Modern Template Syntax**: Use `@if`, `@for` instead of structural directives
7. **Immutable State**: Never mutate state objects, always create new instances
8. **Error Handling**: Implement proper error boundaries and user feedback
9. **Testing Attributes**: Include `data-testid` for all interactive elements
10. **Accessibility**: Use semantic HTML and proper ARIA attributes
11. **Performance**: Implement lazy loading for routes and large components
12. **Bundle Size**: Monitor and optimize bundle size, target <500KB gzipped
13. **CSS Custom Properties**: Use CSS variables for theming and responsive design
14. **Component Isolation**: Keep components focused and avoid tight coupling
15. **Service Layer**: Centralize business logic in Angular services
16. **Type Safety**: Define interfaces for all data structures
17. **Documentation**: Document complex logic and public APIs
18. **Code Style**: Follow Angular style guide and enforce with ESLint/Prettier
19. **Git Hooks**: Use pre-commit hooks to enforce quality gates
20. **Environment Config**: Use environment files for all configuration
21. **Game Logic Separation**: Keep game engine separate from UI concerns
22. **Computer Player Determinism**: Ensure computer moves are predictable for testing

### Architecture Principles (HIGH PRIORITY)

23. **High Code Reuse**: Extract common functionality into shared services, utilities, and composable functions
24. **Small Methods**: Keep all methods under 20 lines - break down complex logic into smaller, focused functions
25. **Testable Services**: Move all invisible logic (calculations, validations, transformations) to services for easier testing
26. **Presentation-Only Components**: Components should ONLY handle UI presentation and user interaction, delegating ALL logic to services
27. **Single Responsibility**: Each method, service, and component should have one clear purpose
28. **Composable Architecture**: Build functionality from small, reusable building blocks
29. **Logic Extraction**: If logic cannot be easily unit tested in a component, extract it to a service

### Enterprise Code Quality Standards

30. **Dependency Limits**: Methods should never call more than 3-5 dependencies
31. **Conditional Extraction**: Nested conditional statements (if/switch) must be broken into separate methods
32. **Loop Simplification**: Avoid nested loops; extract to dedicated methods
33. **Constants Declaration**: No magic values except trivial 0 and 1; use configuration constants
34. **Mockable Design**: All dependencies must be easily mockable for unit testing
35. **Resource Management**: Ensure proper disposal and cleanup of resources
36. **Error Boundaries**: Implement proactive error handling with appropriate guards
37. **Performance Caching**: Cache calculated variables; avoid re-evaluation
38. **Memory Efficiency**: Use collections appropriately and minimize memory footprint

### Angular-Specific Guidelines

```typescript
// ✅ PERFECT: Pure presentation component - NO LOGIC
@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (presenter.isLoading()) {
      <div>{{ presenter.loadingMessage() }}</div>
    } @else {
      <div class="game-board" [attr.data-testid]="presenter.boardTestId()">
        @for (cell of presenter.cells(); track presenter.trackByIndex) {
          <button 
            class="cell"
            [attr.data-testid]="presenter.cellTestId($index)"
            [disabled]="presenter.isCellDisabled($index)"
            [class]="presenter.cellClasses($index)"
            (click)="presenter.onCellClick($index)">
            {{ presenter.cellDisplay($index) }}
          </button>
        }
      </div>
    }
  `
})
export class GameBoardComponent {
  // ONLY dependency: presentation service
  presenter = inject(GameBoardPresenter);
}

// ✅ PERFECT: Presentation Service - Handles ALL UI Logic
@Injectable({ providedIn: 'root' })
export class GameBoardPresenter {
  // Max 3-5 dependencies per enterprise standards
  private gameService = inject(GameService);
  private uiConfig = inject(UiConfigService);
  private testIdGenerator = inject(TestIdGenerator);
  
  // Direct computed properties - no unnecessary wrappers
  isLoading = computed(() => this.gameService.isGameLoading());
  loadingMessage = computed(() => this.uiConfig.getLoadingMessage());
  cells = computed(() => this.gameService.getBoardCells());
  boardTestId = computed(() => this.testIdGenerator.createBoardId());
  
  // Simple delegation - no wrapper needed
  onCellClick(position: number): void {
    this.gameService.makeMove(position);
  }
  
  // Direct calls - no wrapper needed
  cellTestId(index: number): string {
    return this.testIdGenerator.createCellId(index);
  }
  
  // Direct calls - no wrapper needed
  isCellDisabled(index: number): boolean {
    return this.gameService.isCellDisabled(index);
  }
  
  // Complex logic - wrapper justified for reuse
  cellClasses(index: number): string {
    const cellState = this.gameService.getCellState(index);
    const baseClasses = this.uiConfig.getBaseCellClasses();
    const stateClasses = this.uiConfig.getStateClasses(cellState);
    return `${baseClasses} ${stateClasses}`;
  }
  
  // Direct call - no wrapper needed
  cellDisplay(index: number): string {
    return this.gameService.getCellDisplayValue(index);
  }
  
  // Performance: trackBy function
  trackByIndex = (index: number): number => index;
}

// ✅ PERFECT: Pure Business Logic Service - No Unnecessary Wrappers
@Injectable({ providedIn: 'root' })
export class GameService {
  // Max 3 dependencies
  private engine = inject(GameEngine);
  private validator = inject(MoveValidator);
  private stateManager = inject(GameStateManager);
  
  private _gameState = signal(this.createInitialState());
  
  // Public API methods - complex logic justified
  makeMove(position: number): void {
    if (!this.validator.isValidMove(this._gameState(), position)) {
      return;
    }
    
    const move = this.createMove(position);
    const newState = this.engine.processMove(this._gameState(), move);
    this._gameState.set(newState);
    this.stateManager.processStateChange(newState);
  }
  
  // Direct access - no wrapper needed
  isGameLoading(): boolean {
    return this._gameState().status === GameStatus.LOADING;
  }
  
  // Direct delegation - no wrapper needed
  getBoardCells(): CellDisplay[] {
    return this.stateManager.createCellDisplayArray(this._gameState());
  }
  
  // Direct delegation - no wrapper needed
  isCellDisabled(index: number): boolean {
    return this.validator.isCellAccessible(this._gameState(), index);
  }
  
  // Direct delegation - no wrapper needed
  getCellState(index: number): CellState {
    return this.stateManager.getCellState(this._gameState(), index);
  }
  
  // Direct delegation - no wrapper needed
  getCellDisplayValue(index: number): string {
    return this.stateManager.formatCellContent(this._gameState(), index);
  }
  
  // Private methods - only when complex logic or reuse justified
  private createMove(position: number): Move {
    return {
      player: this._gameState().currentPlayer,
      position,
      timestamp: Date.now()
    };
  }
  
  private createInitialState(): GameState {
    return this.engine.createGame({ 
      boardSize: GAME_CONSTANTS.BOARD_SIZE, 
      firstPlayer: GAME_CONSTANTS.FIRST_PLAYER 
    });
  }
}

// ❌ BAD: Fat component with business logic
@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <div *ngFor="let item of items">{{ item.name }}</div>
  `
})
export class BadExampleComponent implements OnInit {
  constructor(private service: ExampleService) {}
  
  isLoading = false;
  items: Item[] = [];
  
  // ❌ Too much logic in component
  // ❌ Method too long
  // ❌ Not easily testable
  ngOnInit() {
    this.isLoading = true;
    this.service.getItems().subscribe(items => {
      // Business logic in component - BAD!
      const filteredItems = items.filter(item => item.active);
      const sortedItems = filteredItems.sort((a, b) => a.priority - b.priority);
      const enrichedItems = sortedItems.map(item => ({
        ...item,
        displayName: `${item.name} (${item.category})`,
        isHighPriority: item.priority > 5
      }));
      
      this.items = enrichedItems;
      this.isLoading = false;
      
      // More business logic - extract to service!
      if (enrichedItems.length === 0) {
        this.showEmptyMessage();
      }
    });
  }
  
  // ❌ UI logic mixed with business logic
  showEmptyMessage() {
    // This should be in a service
    console.log('No items found');
  }
}
```

### Code Reuse & Small Methods Architecture

```typescript
// ✅ EXCELLENT: High reuse with small, focused methods
@Injectable({ providedIn: 'root' })
export class ReusableGameUtilities {
  // Small utility: 3 lines
  formatPlayer(player: Player): string {
    return player === 'X' ? '❌' : '⭕';
  }
  
  // Small utility: 5 lines
  createTestIds(prefix: string, ids: string[]) {
    return ids.reduce((acc, id) => {
      acc[id] = (suffix?: string) => `${prefix}-${id}${suffix ? `-${suffix}` : ''}`;
      return acc;
    }, {} as Record<string, (suffix?: string) => string>);
  }
  
  // Small validation: 8 lines
  validateMoveInput(position: number, boardSize: number): boolean {
    if (position < 0 || position >= boardSize * boardSize) {
      return false;
    }
    return Number.isInteger(position);
  }
  
  // Small formatter: 12 lines
  formatGameResult(state: GameState): GameResult {
    const result: GameResult = {
      winner: state.winner,
      moves: state.moveHistory.length,
      duration: this.calculateDuration(state),
      type: this.getGameType(state)
    };
    
    return result;
  }
  
  // Extracted calculation: 4 lines
  private calculateDuration(state: GameState): number {
    return state.endTime - state.startTime;
  }
  
  // Extracted logic: 6 lines
  private getGameType(state: GameState): 'win' | 'draw' {
    return state.winner ? 'win' : 'draw';
  }
}

// ✅ EXCELLENT: Composable services with single responsibilities
@Injectable({ providedIn: 'root' })
export class MoveValidator {
  private utils = inject(ReusableGameUtilities);
  
  // Single purpose: 8 lines
  isValidMove(state: GameState, position: number): boolean {
    if (!this.utils.validateMoveInput(position, 3)) {
      return false;
    }
    
    return this.isCellEmpty(state.board, position) && 
           this.isGameActive(state);
  }
  
  // Small check: 3 lines
  private isCellEmpty(board: Board, position: number): boolean {
    return board[position] === null;
  }
  
  // Small check: 3 lines  
  private isGameActive(state: GameState): boolean {
    return state.status === 'playing';
  }
}

// ✅ PERFECT: Zero-logic component - Pure presentation
@Component({
  selector: 'app-game-cell',
  standalone: true,
  template: `
    <button 
      class="game-cell"
      [attr.data-testid]="presenter.testId()"
      [disabled]="presenter.isDisabled()"
      [class]="presenter.cssClasses()"
      (click)="presenter.onClick()">
      {{ presenter.displayValue() }}
    </button>
  `
})
export class GameCellComponent {
  @Input() position!: number;
  @Input() value!: Player | null;
  @Input() gameState!: GameState;
  @Output() cellClick = new EventEmitter<number>();
  
  // Single dependency: presenter handles ALL logic
  presenter = inject(GameCellPresenter);
  
  ngOnInit(): void {
    // Presenter initialization with inputs
    this.presenter.initialize(this.position, this.value, this.gameState, this.cellClick);
  }
}

// ✅ PERFECT: Presentation Service - Minimal Wrappers
@Injectable({ providedIn: 'root' })
export class GameCellPresenter {
  // Max 3 dependencies
  private formatter = inject(CellFormatter);
  private validator = inject(CellValidator);
  private styleBuilder = inject(CellStyleBuilder);
  
  private position!: number;
  private value!: Player | null;
  private gameState!: GameState;
  private cellClickEmitter!: EventEmitter<number>;
  
  // Simple initialization - no wrapper methods needed
  initialize(position: number, value: Player | null, gameState: GameState, emitter: EventEmitter<number>): void {
    this.position = position;
    this.value = value;
    this.gameState = gameState;
    this.cellClickEmitter = emitter;
  }
  
  // Direct calls - no unnecessary wrappers
  testId(): string {
    return this.formatter.createTestId(this.position);
  }
  
  isDisabled(): boolean {
    return this.validator.isCellDisabled(this.gameState, this.position);
  }
  
  cssClasses(): string {
    return this.styleBuilder.createClasses(this.value, this.gameState.status);
  }
  
  displayValue(): string {
    return this.formatter.formatPlayerValue(this.value);
  }
  
  // Complex logic - wrapper justified
  onClick(): void {
    if (this.validator.canMakeMove(this.gameState, this.position)) {
      this.cellClickEmitter.emit(this.position);
    }
  }
}

// ❌ BAD: Fat methods and duplicate logic
@Injectable({ providedIn: 'root' })
export class BadGameService {
  // ❌ Method too long (>20 lines)
  // ❌ Multiple responsibilities
  // ❌ Hard to test
  processGameMove(state: GameState, position: number): GameState {
    // Validation logic (should be extracted)
    if (position < 0 || position > 8) {
      throw new Error('Invalid position');
    }
    if (state.board[position] !== null) {
      throw new Error('Cell occupied');
    }
    if (state.status !== 'playing') {
      throw new Error('Game not active');
    }
    
    // Move application (should be extracted)
    const newBoard = [...state.board];
    newBoard[position] = state.currentPlayer;
    
    // Win checking (should be extracted)
    let winner = null;
    const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (const pattern of winPatterns) {
      if (pattern.every(pos => newBoard[pos] === state.currentPlayer)) {
        winner = state.currentPlayer;
        break;
      }
    }
    
    // State building (should be extracted)
    return {
      ...state,
      board: newBoard,
      currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      status: winner ? 'won' : (newBoard.every(c => c !== null) ? 'draw' : 'playing'),
      moveHistory: [...state.moveHistory, { player: state.currentPlayer, position }]
    };
  }
}
```

### Game Engine Integration

```typescript
// ✅ PERFECT: Pragmatic service - no unnecessary wrappers
@Injectable({ providedIn: 'root' })
export class GameService {
  private engine = inject(GameEngine);
  private validator = inject(MoveValidator);
  private _state = signal(this.createInitialState());
  
  gameState = computed(() => this._state());
  
  // Complex orchestration - wrapper justified
  makeMove(position: number): void {
    if (!this.validator.isValidMove(this._state(), position)) {
      return;
    }
    
    const move = {
      player: this._state().currentPlayer,
      position,
      timestamp: Date.now()
    };
    
    const newState = this.engine.processMove(this._state(), move);
    this._state.set(newState);
  }
  
  // Simple initialization - wrapper justified for reuse
  private createInitialState(): GameState {
    return this.engine.createGame({ boardSize: GAME_CONSTANTS.BOARD_SIZE });
  }
}

// ❌ Wrong: Direct engine usage in components
@Component({...})
export class GameBoardComponent {
  private engine = new GameEngine(); // Don't do this
  
  // ❌ Business logic in component
  // ❌ Method too long
  // ❌ Hard to test
  handleClick(position: number) {
    // Game logic in component - avoid this
    try {
      if (position < 0 || position > 8) return;
      if (this.gameState.board[position] !== null) return;
      
      const newState = this.engine.applyMove(this.gameState, {
        player: this.gameState.currentPlayer,
        position
      });
      this.gameState = newState;
      
      // More logic that should be in services...
      if (newState.winner) {
        this.showWinnerMessage(newState.winner);
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
  }
}
```

### Enterprise Complexity & Modularity Guidelines

**Maximum Method Length: 20 lines**
- If a method exceeds 20 lines, extract smaller functions
- Each method should have a single, clear responsibility
- Use descriptive method names that explain the purpose

**Dependency Limits (CRITICAL)**
- Methods should never call more than 3-5 dependencies
- Extract complex dependency chains into coordinator services
- Use dependency injection for all service references

**Conditional Complexity Rules**
- Nested if/else statements must be extracted to separate methods
- Switch statements with more than 3 cases should be extracted
- Complex boolean logic should be moved to predicate methods

**Configuration Constants**
- No magic numbers except 0 and 1
- All configurable values should use IOptions pattern equivalent
- Constants should be declared in dedicated configuration services

**Wrapper Method Guidelines (CRITICAL)**
- **NO wrappers for simple service calls** - call services directly
- **NO wrappers for single-line operations** - inline them
- **NO micro-methods for trivial logic** (e.g., `isXWinner()` for `winner === 'X'`)
- **CREATE wrappers ONLY when:**
  - Complex orchestration across multiple services
  - Reused logic across multiple methods
  - Public API that needs abstraction
  - Complex conditional or calculation logic (>3 lines)

```typescript
// ✅ PERFECT: Enterprise-grade modularity - No Unnecessary Wrappers
@Injectable({ providedIn: 'root' })
export class GameAnalytics {
  // Max 3 dependencies
  private statsCalculator = inject(StatsCalculator);
  private gameProcessor = inject(GameProcessor);
  private performanceRanker = inject(PerformanceRanker);
  
  // Complex orchestration - wrapper justified
  calculatePlayerStats(gameHistory: GameState[]): PlayerStats {
    const initialStats = this.statsCalculator.createEmptyStats();
    const processedStats = this.gameProcessor.processGames(initialStats, gameHistory);
    return this.performanceRanker.calculateFinalStats(processedStats);
  }
}

// ✅ PERFECT: Service with minimal wrappers
@Injectable({ providedIn: 'root' })
export class GameProcessor {
  // Single dependency
  private winAnalyzer = inject(WinAnalyzer);
  
  processGames(initialStats: PlayerStats, games: GameState[]): PlayerStats {
    const updatedStats = { ...initialStats }; // Direct clone - no wrapper needed
    games.forEach(game => this.winAnalyzer.updateWinStats(updatedStats, game)); // Direct call
    return updatedStats;
  }
}

// ✅ PERFECT: Clean conditional logic - No Micro-Wrappers
@Injectable({ providedIn: 'root' })
export class WinAnalyzer {
  updateWinStats(stats: PlayerStats, game: GameState): void {
    const winner = game.winner;
    
    if (winner === GAME_PLAYERS.X) {
      stats.xWins++;
    } else if (winner === GAME_PLAYERS.O) {
      stats.oWins++;
    } else {
      stats.draws++;
    }
  }
}

// ❌ BAD: Method too long (>20 lines)
class BadGameAnalytics {
  calculatePlayerStats(gameHistory: GameState[]): PlayerStats { // 35+ lines!
    let xWins = 0, oWins = 0, draws = 0;
    let totalMoves = 0, totalTime = 0;
    let quickestWin = Infinity, longestGame = 0;
    
    for (const game of gameHistory) {
      if (game.winner === 'X') {
        xWins++;
      } else if (game.winner === 'O') {
        oWins++;
      } else {
        draws++;
      }
      
      totalMoves += game.moveHistory.length;
      const gameTime = game.endTime - game.startTime;
      totalTime += gameTime;
      
      if (game.winner && gameTime < quickestWin) {
        quickestWin = gameTime;
      }
      if (gameTime > longestGame) {
        longestGame = gameTime;
      }
    }
    
    const total = xWins + oWins + draws;
    const avgMoves = total > 0 ? totalMoves / total : 0;
    const avgTime = total > 0 ? totalTime / total : 0;
    
    return {
      xWins, oWins, draws,
      xWinRate: total > 0 ? xWins / total : 0,
      oWinRate: total > 0 ? oWins / total : 0,
      avgMoves, avgTime, quickestWin, longestGame
    };
  }
}
```

**Reusability Patterns:**

```typescript
// ✅ EXCELLENT: Highly reusable utility functions
export class GameUtilities {
  // Reusable across any board game
  static isValidPosition(position: number, boardSize: number): boolean {
    return position >= 0 && position < boardSize * boardSize;
  }
  
  // Reusable validation pattern
  static validateInput<T>(value: T, validators: Array<(v: T) => boolean>): boolean {
    return validators.every(validator => validator(value));
  }
  
  // Reusable formatting
  static formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
  
  // Reusable array utilities
  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

// ✅ EXCELLENT: Composable service pattern
@Injectable({ providedIn: 'root' })
export class BaseValidator {
  protected validateRequired<T>(value: T): boolean {
    return value !== null && value !== undefined;
  }
  
  protected validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}

@Injectable({ providedIn: 'root' })
export class MoveValidator extends BaseValidator {
  // Composes base validation with specific logic
  isValidMove(state: GameState, position: number): boolean {
    return this.validateRequired(position) &&
           this.validateRange(position, 0, 8) &&
           this.isCellEmpty(state.board, position);
  }
  
  private isCellEmpty(board: Board, position: number): boolean {
    return board[position] === null;
  }
}
```

### Testing Patterns

```typescript
// ✅ EXCELLENT: Testing small methods is easy and reliable
describe('GameUtilities', () => {
  describe('isValidPosition', () => {
    it('should validate positions within board bounds', () => {
      expect(GameUtilities.isValidPosition(0, 3)).toBe(true);
      expect(GameUtilities.isValidPosition(8, 3)).toBe(true);
      expect(GameUtilities.isValidPosition(9, 3)).toBe(false);
      expect(GameUtilities.isValidPosition(-1, 3)).toBe(false);
    });
  });
  
  describe('formatDuration', () => {
    it('should format milliseconds to mm:ss', () => {
      expect(GameUtilities.formatDuration(65000)).toBe('1:05');
      expect(GameUtilities.formatDuration(5000)).toBe('0:05');
    });
  });
});

describe('MoveValidator', () => {
  let validator: MoveValidator;
  let mockState: GameState;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    validator = TestBed.inject(MoveValidator);
    mockState = createMockGameState(); // Factory function
  });
  
  // Small methods are easy to test in isolation
  it('should reject moves to occupied cells', () => {
    mockState.board[0] = 'X'; // Occupy first cell
    
    expect(validator.isValidMove(mockState, 0)).toBe(false);
  });
  
  it('should accept moves to empty cells', () => {
    expect(validator.isValidMove(mockState, 0)).toBe(true);
  });
});

// ✅ EXCELLENT: Testing services with extracted logic
describe('GameService', () => {
  let service: GameService;
  let mockValidator: jasmine.SpyObj<MoveValidator>;
  let mockEngine: jasmine.SpyObj<GameEngine>;
  
  beforeEach(() => {
    const validatorSpy = jasmine.createSpyObj('MoveValidator', ['isValidMove']);
    const engineSpy = jasmine.createSpyObj('GameEngine', ['processMove']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: MoveValidator, useValue: validatorSpy },
        { provide: GameEngine, useValue: engineSpy }
      ]
    });
    
    service = TestBed.inject(GameService);
    mockValidator = TestBed.inject(MoveValidator) as jasmine.SpyObj<MoveValidator>;
    mockEngine = TestBed.inject(GameEngine) as jasmine.SpyObj<GameEngine>;
  });
  
  it('should delegate validation to validator service', () => {
    mockValidator.isValidMove.and.returnValue(true);
    mockEngine.processMove.and.returnValue(createMockGameState());
    
    service.makeMove(0);
    
    expect(mockValidator.isValidMove).toHaveBeenCalledWith(jasmine.any(Object), 0);
  });
  
  it('should not make move when validation fails', () => {
    mockValidator.isValidMove.and.returnValue(false);
    
    service.makeMove(0);
    
    expect(mockEngine.processMove).not.toHaveBeenCalled();
  });
});
```

### Quick Reference

**Essential Commands:**
- `pnpm nx serve ui` - Start development server
- `pnpm nx build ui` - Build for production
- `pnpm nx test ui` - Run unit tests
- `pnpm nx e2e ui-e2e` - Run E2E tests
- `pnpm nx lint ui` - Lint code
- `pnpm nx graph` - View dependency graph

**Import Patterns:**
```typescript
// Framework imports
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Library imports
import { GameEngine, ComputerPlayer } from '@libs/engine';
import { GameState, Player, Move } from '@libs/shared';

// Relative imports
import { GameService } from '../services/game.service';
```

**File Naming Conventions:**
- Components: `game-board.component.ts`
- Services: `game.service.ts`
- Types: `game.types.ts`
- Tests: `*.spec.ts`
- E2E Tests: `*.e2e-spec.ts`

**CSS Class Patterns:**
- Component classes: `game-board`, `game-controls`
- State classes: `is-active`, `is-disabled`, `is-winning`
- Utility classes: Use Tailwind utilities
- Custom properties: `--game-board-size`, `--cell-dimension`

**Configuration Constants Pattern:**

```typescript
// ✅ PERFECT: Configuration service for all constants
@Injectable({ providedIn: 'root' })
export class GameConfiguration {
  constructor(private config: InjectionToken<GameConfig>) {}
  
  get boardSize(): number {
    return this.config.boardSize;
  }
  
  get firstPlayer(): Player {
    return this.config.firstPlayer;
  }
  
  get maxMoveTime(): number {
    return this.config.maxMoveTimeMs;
  }
  
  get animationDuration(): number {
    return this.config.animationDurationMs;
  }
}

// ✅ PERFECT: Dedicated constants file
export const GAME_CONSTANTS = {
  PLAYERS: {
    X: 'X' as const,
    O: 'O' as const
  },
  STATUS: {
    PLAYING: 'playing' as const,
    WON: 'won' as const,
    DRAW: 'draw' as const,
    LOADING: 'loading' as const
  },
  UI: {
    EMPTY_CELL_DISPLAY: '',
    TEST_ID_PREFIX: 'game',
    CSS_CELL_CLASS: 'game-cell'
  }
} as const;

// ❌ BAD: Magic numbers and strings
export class BadGameService {
  makeMove(position: number): void {
    if (position < 0 || position > 8) { // Magic number 8
      return;
    }
    
    if (this.gameState.status === 'playing') { // Magic string
      // process move
    }
  }
}
```

### Architecture Summary: The Four Pillars

**1. High Code Reuse**
- Extract common functionality into shared utilities and services
- Create composable building blocks that work across multiple contexts
- Build libraries of reusable validators, formatters, and helpers
- Prefer composition over inheritance for flexibility

**2. Small Methods (<20 lines)**
- Break complex operations into focused, single-purpose functions
- Each method should do one thing well and be easily testable
- Use descriptive names that clearly communicate intent
- Apply the Single Responsibility Principle at the method level

**3. Testable Services (Invisible Logic)**
- Move all business logic, calculations, and validations to services
- Services should be pure functions where possible (predictable outputs)
- Extract complex conditionals and transformations from components
- Design services to be easily mockable and testable in isolation

**4. Presentation-Only Components**
- Components handle only UI presentation and user interaction
- Delegate all logic to services through dependency injection
- Use computed properties and signals for reactive data display
- Keep component methods focused on UI events and template binding

**Quality Gates (Enterprise Standards):**
- Every method must be under 20 lines
- Components contain ZERO business logic - only presentation
- All invisible logic must be covered by unit tests
- Shared functionality must be extracted to utilities/services
- Maximum 3-5 dependencies per method
- No nested conditionals - extract to separate methods
- No magic values - use configuration constants
- All resources must be properly disposed

**Code Review Checklist (1-5 Scale Required):**

**Modularity (Grade 1-5):**
- [ ] All methods broken down into simple, testable blocks
- [ ] Active separation of concerns with small functions
- [ ] Code moved to appropriate services

**Testability (Grade 1-5):**
- [ ] Individual methods are easily testable
- [ ] No complex loops or conditional paths in single method
- [ ] Full unit test coverage achievable without material effort

**Complexity (Grade 1-5):**
- [ ] Methods call max 3-5 dependencies
- [ ] No nested conditionals (extracted to methods)
- [ ] No nested loops
- [ ] Simple, linear code flow

**Code Reuse (Grade 1-5):**
- [ ] Constants declared (no magic values except 0/1)
- [ ] Reusable functions properly extracted
- [ ] Configuration values use IOptions pattern equivalent

**Performance:**
- [ ] Calculated variables are cached
- [ ] Proper collection usage
- [ ] CPU-bound algorithms optimized

**Memory:**
- [ ] Memory used sparingly
- [ ] Proper resource disposal
- [ ] No memory leaks

**Readability (Grade 1-5):**
- [ ] Classes, methods, variables have clear names
- [ ] Conventional naming patterns
- [ ] Easy to understand flow

**Configuration:**
- [ ] Environment-dependent values configurable
- [ ] No hardcoded deployment-specific constants

This frontend architecture document provides the complete technical specification for implementing the Agentic AI Tic Tac Toe Showcase frontend. All development should follow these patterns and standards to ensure consistency, maintainability, high code reuse, and optimal performance through small, focused, testable methods.