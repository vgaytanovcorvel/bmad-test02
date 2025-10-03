import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GameMode, BoardSize } from '@libs/shared';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="game-controls" data-testid="game-controls">
      <div class="selectors-container">
        <div class="control-group">
          <label for="game-mode" class="control-label">Game Mode:</label>
          <select 
            id="game-mode"
            class="control-select"
            [value]="currentMode()"
            (change)="onModeChange($event)"
            data-testid="mode-selector"
            aria-label="Select game mode"
          >
            <option value="human-vs-human">Human vs Human</option>
            <option value="human-vs-computer">Human vs Computer</option>
          </select>
        </div>
        
        <div class="control-group">
          <label for="board-size" class="control-label">Board Size:</label>
          <select 
            id="board-size"
            class="control-select"
            [value]="currentBoardSize()"
            (change)="onBoardSizeChange($event)"
            data-testid="size-selector"
            aria-label="Select board size"
          >
            <option value="3">3×3</option>
            <option value="4">4×4</option>
            <option value="7">7×7</option>
          </select>
        </div>
        
        <div class="control-group">
          <label for="x-color" class="control-label">X Color:</label>
          <input 
            type="color" 
            id="x-color" 
            class="control-color"
            [value]="currentXColor()" 
            (change)="onXColorChange($event)"
            data-testid="x-color-picker" 
            aria-label="Select X player color"
          >
        </div>
        
        <div class="control-group">
          <label for="o-color" class="control-label">O Color:</label>
          <input 
            type="color" 
            id="o-color" 
            class="control-color"
            [value]="currentOColor()" 
            (change)="onOColorChange($event)"
            data-testid="o-color-picker" 
            aria-label="Select O player color"
          >
        </div>
      </div>
      
      <button 
        type="button"
        class="new-game-btn"
        (click)="onNewGame()"
        data-testid="new-game-button"
        aria-label="Start new game"
      >
        New Game
      </button>
    </div>
  `,
  styleUrl: './game-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameControlsComponent {
  private gameService = inject(GameService);
  
  // Reactive state from service - computed properties for current configuration
  currentMode = this.gameService.currentMode;
  currentBoardSize = this.gameService.currentBoardSize;
  
  // Player color state for Story 7.1
  currentXColor = this.gameService.currentXColor;
  currentOColor = this.gameService.currentOColor;
  
  onModeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.gameService.changeGameMode(target.value as GameMode);
  }
  
  onBoardSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.gameService.changeBoardSize(Number(target.value) as BoardSize);
  }
  
  onNewGame(): void {
    this.gameService.resetGame();
  }
  
  onXColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gameService.changeXColor(target.value);
  }
  
  onOColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gameService.changeOColor(target.value);
  }
}