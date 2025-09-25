import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-board" [attr.data-testid]="'game-board'">
      <div class="game-status" [attr.data-testid]="'game-status'">
        @if (gameService.isTerminal()) {
          @if (gameService.winner()) {
            Player {{ gameService.winner() }} wins! 🎉
          } @else {
            It's a draw! 🤝
          }
        } @else {
          Current player: {{ gameService.currentPlayer() }}
        }
      </div>
      
      <div class="board">
        @for (cell of cells(); track $index) {
          <button
            class="cell"
            [class.occupied]="cell !== ''"
            [class.winning]="isWinningCell($index)"
            [disabled]="gameService.isCellDisabled($index)"
            (click)="handleCellClick($index)"
            [attr.data-testid]="'cell-' + $index"
          >
            {{ cell }}
          </button>
        }
      </div>
      
      <button 
        class="reset-button"
        (click)="gameService.resetGame()"
        [attr.data-testid]="'reset-button'"
      >
        Reset Game
      </button>
    </div>
  `,
  styles: [`
    .game-board {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
    }
    
    .game-status {
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      background-color: #333;
      padding: 2px;
    }
    
    .cell {
      width: 80px;
      height: 80px;
      background-color: white;
      border: none;
      font-size: 2rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .cell:hover:not(:disabled) {
      background-color: #f0f0f0;
    }
    
    .cell:disabled {
      cursor: not-allowed;
    }
    
    .cell.winning {
      background-color: #90EE90;
    }
    
    .reset-button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .reset-button:hover {
      background-color: #0056b3;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent {
  gameService = inject(GameService);
  
  cells = computed(() => {
    const board = this.gameService.gameState().board;
    return board.map(cell => cell || '');
  });
  
  winningLine = computed(() => this.gameService.gameState().winningLine);

  handleCellClick(index: number): void {
    this.gameService.makeMove(index);
  }

  isWinningCell(index: number): boolean {
    const winningLine = this.winningLine();
    return winningLine ? winningLine.includes(index) : false;
  }
}