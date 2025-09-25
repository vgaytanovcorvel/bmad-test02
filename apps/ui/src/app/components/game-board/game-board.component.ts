import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { formatPlayerSymbol } from '@libs/shared';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="game-board" 
      [class.board-3x3]="boardSize() === 3"
      [class.board-4x4]="boardSize() === 4"
      [attr.data-testid]="'game-board'"
    >
      @for (cell of boardCells(); track $index) {
        <button
          class="cell"
          [class.occupied]="cell !== null"
          [class.winning]="isWinningCell($index)"
          [disabled]="isTerminal() || cell !== null"
          (click)="handleCellClick($index)"
          [attr.data-testid]="'cell-' + $index"
          [attr.aria-label]="getCellAriaLabel($index)"
        >
          {{ formatPlayerSymbol(cell) }}
        </button>
      }
    </div>
  `,
  styles: [`
    .game-board {
      @apply grid gap-2 p-4 bg-white rounded-lg shadow-lg mx-auto;
      
      width: var(--game-board-size);
      height: var(--game-board-size);
      
      &.board-3x3 {
        @apply grid-cols-3;
      }
      
      &.board-4x4 {
        @apply grid-cols-4;
      }
    }

    .cell {
      @apply bg-gray-100 border-2 border-gray-300 rounded-md text-3xl font-bold
             hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500
             transition-colors duration-150 flex items-center justify-center;
      
      aspect-ratio: 1;
      min-height: var(--cell-size);
      
      &:disabled {
        @apply cursor-not-allowed opacity-60;
      }
      
      &.occupied {
        @apply bg-gray-200 cursor-not-allowed;
      }
      
      &.winning {
        @apply bg-green-200 border-green-400 text-green-800;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {
  private gameService = inject(GameService);
  
  // Reactive state from service
  gameState = this.gameService.gameState;
  boardCells = computed(() => this.gameState().board);
  boardSize = computed(() => Math.sqrt(this.boardCells().length));
  isTerminal = computed(() => this.gameService.isTerminal());
  winningLine = computed(() => this.gameState().winningLine);
  
  // Utility function for template
  protected formatPlayerSymbol = formatPlayerSymbol;
  
  handleCellClick(position: number): void {
    this.gameService.makeMove(position);
  }
  
  isWinningCell(position: number): boolean {
    const winningLine = this.winningLine();
    return winningLine ? winningLine.includes(position) : false;
  }
  
  getCellAriaLabel(position: number): string {
    const cell = this.boardCells()[position];
    const row = Math.floor(position / this.boardSize()) + 1;
    const col = (position % this.boardSize()) + 1;
    
    if (cell) {
      return `Cell row ${row} column ${col}, occupied by ${cell}`;
    }
    return `Cell row ${row} column ${col}, empty, click to place mark`;
  }
}