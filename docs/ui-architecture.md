# Agentic AI Tic Tac Toe Showcase Frontend Architecture Document

## Introduction

This document outlines the complete frontend architecture for the Agentic AI Tic Tac Toe Showcase, focusing on Angular-based implementation with modern development practices. It serves as the definitive guide for AI-driven frontend development, ensuring consistency across the entire user interface stack.

**Relationship to Main Architecture:**
This document details frontend-specific implementation while remaining aligned with the overall system architecture. Technology stack choices documented herein are synchronized with the main architecture document and serve as the single source of truth for frontend development.

## Template and Framework Selection

**Selected Framework:** Angular 17+ with Standalone Components
**Build System:** Nx Monorepo with Vite Builder
**Package Manager:** PNPM
**Styling:** Tailwind CSS + PostCSS

**Key Architectural Decisions:**
- Pure client-side SPA (no backend dependencies)
- Nx monorepo for modular development
- Angular Signals for lightweight state management
- Static hosting deployment (Vercel/Netlify)

## Frontend Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Framework | Angular | 17+ | SPA Framework | Modern standalone components, signals, excellent TypeScript support |
| Build System | Nx | Latest | Monorepo tooling | Modular architecture, code sharing, integrated testing |
| Builder | Vite | Latest | Build tool | Fast HMR, modern bundling, optimal for Angular 17+ |
| Package Manager | PNPM | Latest | Dependency management | Efficient disk usage, fast installs, workspace support |
| UI Framework | Tailwind CSS | 3.x | Utility-first CSS | Rapid prototyping, consistent design system, small bundle |
| State Management | Angular Signals | 17+ | Reactive state | Lightweight, built-in, optimal for simple game state |
| Routing | Angular Router | 17+ | Client-side routing | Built-in, feature-complete, supports standalone components |
| Testing Framework | Jest | Latest | Unit testing | Fast, comprehensive, excellent Angular integration |
| Integration Testing | @testing-library/angular | Latest | Component testing | User-centric testing approach, maintainable tests |
| E2E Testing | Playwright | Latest | End-to-end testing | Reliable, fast, multi-browser support |
| Linting | ESLint | Latest | Code quality | Angular-specific rules, TypeScript support |
| Formatting | Prettier | Latest | Code formatting | Consistent style, automated formatting |
| TypeScript | TypeScript | 5.x | Type safety | Strict mode, enhanced developer experience |

## Project Structure

```
tic-tac-toe-showcase/
├── .github/                          # GitHub workflows and configs
├── .nx/                             # Nx cache and metadata
├── apps/
│   ├── ui/                          # Main Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/      # Standalone Angular components
│   │   │   │   │   ├── game-board/
│   │   │   │   │   │   ├── game-board.component.ts
│   │   │   │   │   │   ├── game-board.component.html
│   │   │   │   │   │   ├── game-board.component.scss
│   │   │   │   │   │   └── game-board.component.spec.ts
│   │   │   │   │   ├── game-controls/
│   │   │   │   │   ├── game-status/
│   │   │   │   │   └── health-check/
│   │   │   │   ├── pages/           # Route components
│   │   │   │   │   ├── game/
│   │   │   │   │   ├── health/
│   │   │   │   │   └── credits/
│   │   │   │   ├── services/        # Angular services
│   │   │   │   │   ├── game.service.ts
│   │   │   │   │   └── game.service.spec.ts
│   │   │   │   ├── app.routes.ts    # Route configuration
│   │   │   │   ├── app.config.ts    # App configuration
│   │   │   │   └── app.component.ts # Root component
│   │   │   ├── assets/              # Static assets
│   │   │   ├── styles/              # Global styles
│   │   │   │   ├── globals.scss
│   │   │   │   └── tailwind.scss
│   │   │   ├── environments/        # Environment configs
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   └── project.json
│   └── ui-e2e/                      # Playwright E2E tests
│       ├── src/
│       │   ├── support/
│       │   └── game.spec.ts
│       └── playwright.config.ts
├── libs/
│   ├── engine/                      # Game engine library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── engine.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── computer-player.ts
│   │   │   └── index.ts
│   │   └── project.json
│   └── shared/                      # Shared utilities and types
│       ├── src/
│       │   ├── lib/
│       │   │   ├── types.ts
│       │   │   └── utils.ts
│       │   └── index.ts
│       └── project.json
├── tools/                           # Build and development tools
├── package.json                     # Root package.json with workspaces
├── nx.json                          # Nx configuration
├── tsconfig.base.json              # Base TypeScript config
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
└── README.md
```

## Component Architecture Standards

### Component Template

```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { GameState, Player } from '@libs/shared';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-board" [attr.data-testid]="'game-board'">
      @for (cell of cells(); track $index) {
        <button
          class="cell"
          [class.occupied]="cell.value !== null"
          [class.winning]="isWinningCell($index)"
          [disabled]="gameService.isTerminal() || cell.value !== null"
          (click)="handleCellClick($index)"
          [attr.data-testid]="'cell-' + $index"
        >
          {{ cell.value || '' }}
        </button>
      }
    </div>
  `,
  styleUrl: './game-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  
  // Signals for reactive state
  cells = computed(() => this.gameService.gameState().board);
  winningLine = computed(() => this.gameService.gameState().winningLine);
  
  ngOnInit(): void {
    // Component initialization
  }
  
  ngOnDestroy(): void {
    // Cleanup logic
  }
  
  handleCellClick(index: number): void {
    this.gameService.makeMove(index);
  }
  
  isWinningCell(index: number): boolean {
    const winningLine = this.winningLine();
    return winningLine ? winningLine.includes(index) : false;
  }
}
```

### Component Standards

1. **Standalone Components**: All components use Angular 17+ standalone pattern
2. **OnPush Change Detection**: Optimize performance with explicit change detection
3. **Signal-Based Reactivity**: Use computed signals for derived state
4. **Dependency Injection**: Use `inject()` function over constructor injection
5. **Template Syntax**: Use new control flow syntax (`@if`, `@for`)
6. **Testing Attributes**: Include `data-testid` for reliable test selectors
7. **Accessibility**: Use semantic HTML with proper ARIA attributes when needed
8. **Error Boundaries**: Implement proper error handling for user interactions

## State Management

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

## API Integration

Since this is a pure client-side application, there are no external API integrations. The game engine is consumed directly:

```typescript
// Direct library imports
import { GameEngine, ComputerPlayer } from '@libs/engine';
import { GameState, Player, Move } from '@libs/shared';

// Service integration pattern
@Injectable({ providedIn: 'root' })
export class GameService {
  private engine = new GameEngine();
  private computerPlayer = new ComputerPlayer();
  
  // Direct method calls, no HTTP needed
  makeMove(move: Move): GameState {
    return this.engine.applyMove(this.currentState, move);
  }
}
```

## Routing Configuration

### Route Setup

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/game/game.component').then(m => m.GameComponent),
    title: 'Tic Tac Toe'
  },
  {
    path: 'health',
    loadComponent: () => import('./pages/health/health.component').then(m => m.HealthComponent),
    title: 'Health Check'
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.component').then(m => m.CreditsComponent),
    title: 'Credits'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

### Navigation Component

```typescript
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="main-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        Game
      </a>
      <a routerLink="/health" routerLinkActive="active">Health</a>
      <a routerLink="/credits" routerLinkActive="active">Credits</a>
    </nav>
  `
})
export class NavigationComponent {}
```

## Styling Guidelines

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        game: {
          x: '#ef4444',      // Red for X
          o: '#3b82f6',      // Blue for O
          board: '#f8fafc',  // Light gray for board
          line: '#64748b',   // Gray for grid lines
        }
      },
      gridTemplateColumns: {
        '3': 'repeat(3, 1fr)',
        '4': 'repeat(4, 1fr)',
      }
    },
  },
  plugins: [],
};
```

### CSS Custom Properties

```scss
// styles/globals.scss
:root {
  --game-board-size: 300px;
  --cell-size: calc(var(--game-board-size) / var(--board-dimension));
  --board-dimension: 3; // Dynamic via CSS classes
  
  // Animation timing
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  
  // Z-index layers
  --z-board: 1;
  --z-overlay: 10;
  --z-modal: 100;
}

.board-4x4 {
  --board-dimension: 4;
}

// Responsive board sizing
@media (max-width: 640px) {
  :root {
    --game-board-size: 280px;
  }
}

@media (max-width: 480px) {
  :root {
    --game-board-size: 260px;
  }
}
```

### Component Styling Pattern

```scss
// game-board.component.scss
.game-board {
  @apply grid gap-2 p-4 bg-white rounded-lg shadow-lg;
  
  width: var(--game-board-size);
  height: var(--game-board-size);
  grid-template-columns: repeat(var(--board-dimension), 1fr);
  
  .cell {
    @apply flex items-center justify-center text-2xl font-bold border-2 border-gray-300 
           rounded transition-colors duration-150 hover:bg-gray-50 focus:outline-none 
           focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
    
    min-height: var(--cell-size);
    
    &:disabled {
      @apply cursor-not-allowed opacity-75;
    }
    
    &.occupied {
      @apply cursor-not-allowed;
    }
    
    &.winning {
      @apply bg-yellow-100 border-yellow-400;
      animation: pulse 1s ease-in-out infinite alternate;
    }
  }
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
```

## Testing Requirements

### Unit Test Template

```typescript
// game-board.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { GameBoardComponent } from './game-board.component';
import { GameService } from '../services/game.service';
import { GameState } from '@libs/shared';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let gameService: jasmine.SpyObj<GameService>;

  const mockGameState: GameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winningLine: null,
    isTerminal: false,
    winner: null
  };

  beforeEach(async () => {
    const gameServiceSpy = jasmine.createSpyObj('GameService', ['makeMove'], {
      gameState: signal(mockGameState),
      isTerminal: signal(false)
    });

    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [
        { provide: GameService, useValue: gameServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService) as jasmine.SpyObj<GameService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty board', () => {
    fixture.detectChanges();
    const cells = fixture.debugElement.queryAll(By.css('.cell'));
    expect(cells).toHaveLength(9);
    cells.forEach(cell => {
      expect(cell.nativeElement.textContent.trim()).toBe('');
    });
  });

  it('should handle cell click', () => {
    fixture.detectChanges();
    const firstCell = fixture.debugElement.query(By.css('[data-testid="cell-0"]'));
    
    firstCell.nativeElement.click();
    
    expect(gameService.makeMove).toHaveBeenCalledWith(0);
  });

  it('should disable cells when game is terminal', () => {
    gameService.isTerminal.and.returnValue(signal(true));
    fixture.detectChanges();
    
    const cells = fixture.debugElement.queryAll(By.css('.cell'));
    cells.forEach(cell => {
      expect(cell.nativeElement.disabled).toBe(true);
    });
  });
});
```

### Integration Test Example

```typescript
// game.integration.spec.ts
import { TestBed } from '@angular/core/testing';
import { render, screen, fireEvent } from '@testing-library/angular';
import { GameComponent } from './game.component';
import { GameService } from '../services/game.service';

describe('Game Integration', () => {
  it('should complete a full game flow', async () => {
    await render(GameComponent);
    
    // Start game
    expect(screen.getByText('Current Player: X')).toBeInTheDocument();
    
    // Make moves to create a winning condition
    fireEvent.click(screen.getByTestId('cell-0')); // X
    fireEvent.click(screen.getByTestId('cell-3')); // O (computer)
    fireEvent.click(screen.getByTestId('cell-1')); // X
    fireEvent.click(screen.getByTestId('cell-4')); // O (computer)
    fireEvent.click(screen.getByTestId('cell-2')); // X wins
    
    // Verify win condition
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
    expect(screen.getByTestId('new-game-button')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// game.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game board', async ({ page }) => {
    await expect(page.locator('[data-testid="game-board"]')).toBeVisible();
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(9);
  });

  test('should complete human vs computer game', async ({ page }) => {
    // Switch to human vs computer mode
    await page.click('[data-testid="mode-toggle"]');
    
    // Make first move
    await page.click('[data-testid="cell-0"]');
    await expect(page.locator('[data-testid="cell-0"]')).toHaveText('X');
    
    // Wait for computer move
    await page.waitForTimeout(500);
    const occupiedCells = await page.locator('.cell.occupied').count();
    expect(occupiedCells).toBe(2); // Human + Computer move
  });

  test('should handle board size change', async ({ page }) => {
    await page.selectOption('[data-testid="board-size-select"]', '4');
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(16);
  });
});
```

### Testing Best Practices

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions with services
3. **E2E Tests**: Test critical user flows (using Playwright)
4. **Coverage Goals**: Aim for 85% code coverage (unit + integration)
5. **Test Structure**: Arrange-Act-Assert pattern
6. **Mock External Dependencies**: Game engine, computer player logic
7. **Deterministic Tests**: Ensure computer moves are predictable in tests
8. **Accessibility Testing**: Include basic screen reader and keyboard navigation tests

## Environment Configuration

### Environment Files

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  appName: 'Tic Tac Toe Showcase',
  version: '1.3.0',
  buildHash: 'dev-build',
  
  // Game configuration
  game: {
    supportedBoardSizes: [3, 4] as const,
    defaultBoardSize: 3,
    kValue: 3, // Both 3x3 and 4x4 use k=3
    computerMoveDelay: 300, // ms
    animationDuration: 150, // ms
  },
  
  // Feature flags
  features: {
    animations: true,
    soundEffects: false, // Future feature
    statistics: false,   // Future feature
  },
  
  // Analytics (future)
  analytics: {
    enabled: false,
    trackingId: null,
  }
};
```

```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  appName: 'Tic Tac Toe Showcase',
  version: '1.3.0',
  buildHash: process.env['BUILD_HASH'] || 'unknown',
  
  game: {
    supportedBoardSizes: [3, 4] as const,
    defaultBoardSize: 3,
    kValue: 3,
    computerMoveDelay: 300,
    animationDuration: 150,
  },
  
  features: {
    animations: true,
    soundEffects: false,
    statistics: false,
  },
  
  analytics: {
    enabled: false,
    trackingId: null,
  }
};
```

### Build Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { angular } from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [
    angular(),
    nxViteTsPaths(),
  ],
  define: {
    'process.env.BUILD_HASH': JSON.stringify(
      process.env['BUILD_HASH'] || 'local-build'
    ),
  },
  build: {
    target: 'es2022',
    outDir: 'dist/apps/ui',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@angular/core', '@angular/common', '@angular/router'],
          engine: ['@libs/engine'],
        },
      },
    },
  },
  server: {
    port: 4200,
    host: '0.0.0.0',
  },
  preview: {
    port: 4300,
    host: '0.0.0.0',
  },
}));
```

### Static Hosting Configuration

```json
// vercel.json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/apps/ui",
  "framework": null
}
```

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist/apps/ui"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Frontend Developer Standards

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

### Angular-Specific Guidelines

```typescript
// ✅ Good: Standalone component with signals
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div>Loading...</div>
    } @else {
      @for (item of items(); track item.id) {
        <div>{{ item.name }}</div>
      }
    }
  `
})
export class ExampleComponent {
  private service = inject(ExampleService);
  
  isLoading = signal(false);
  items = computed(() => this.service.getItems());
}

// ❌ Bad: Legacy patterns
@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <div *ngFor="let item of items">{{ item.name }}</div>
  `
})
export class ExampleComponent implements OnInit {
  constructor(private service: ExampleService) {}
  
  isLoading = false;
  items: Item[] = [];
  
  ngOnInit() {
    this.service.getItems().subscribe(items => {
      this.items = items;
      this.isLoading = false;
    });
  }
}
```

### Game Engine Integration

```typescript
// ✅ Correct: Service-based game engine integration
@Injectable({ providedIn: 'root' })
export class GameService {
  private engine = new GameEngine();
  private _state = signal(this.engine.initialState(defaultConfig));
  
  gameState = computed(() => this._state());
  
  makeMove(position: number): void {
    try {
      const newState = this.engine.applyMove(this._state(), {
        player: this._state().currentPlayer,
        position
      });
      this._state.set(newState);
    } catch (error) {
      // Handle invalid move
      console.error('Invalid move:', error);
    }
  }
}

// ❌ Wrong: Direct engine usage in components
@Component({...})
export class GameBoardComponent {
  private engine = new GameEngine(); // Don't do this
  
  handleClick(position: number) {
    // Game logic in component - avoid this
    this.gameState = this.engine.applyMove(this.gameState, move);
  }
}
```

### Testing Patterns

```typescript
// ✅ Good: Comprehensive test with proper mocking
describe('GameService', () => {
  let service: GameService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });
  
  it('should handle valid move', () => {
    // Arrange
    const initialState = service.gameState();
    expect(initialState.currentPlayer).toBe('X');
    
    // Act
    service.makeMove(0);
    
    // Assert
    const newState = service.gameState();
    expect(newState.board[0]).toBe('X');
    expect(newState.currentPlayer).toBe('O');
  });
  
  it('should reject invalid move', () => {
    // Arrange
    service.makeMove(0); // Occupy cell 0
    const consoleSpy = spyOn(console, 'error');
    
    // Act
    service.makeMove(0); // Try to move to occupied cell
    
    // Assert
    expect(consoleSpy).toHaveBeenCalled();
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

This frontend architecture document provides the complete technical specification for implementing the Agentic AI Tic Tac Toe Showcase frontend. All development should follow these patterns and standards to ensure consistency, maintainability, and optimal performance.