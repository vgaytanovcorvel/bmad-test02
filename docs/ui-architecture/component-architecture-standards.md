# Component Architecture Standards

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
