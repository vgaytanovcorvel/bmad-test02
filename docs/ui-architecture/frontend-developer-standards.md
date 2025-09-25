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