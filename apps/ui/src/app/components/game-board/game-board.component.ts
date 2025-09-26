import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, OnDestroy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { VisualEnhancementService } from '../../services/visual-enhancement.service';
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
      [class.size-changing]="isBoardResizing$()"
      [attr.data-testid]="'game-board'"
    >
      @for (cell of boardCells(); track $index) {
        <button
          class="cell"
          [class.occupied]="cell !== null"
          [class.winning]="isWinningCell($index)"
          [class.new-move]="isNewMovePosition($index)"
          [class.player-x]="cell === 'X'"
          [class.player-o]="cell === 'O'"
          [disabled]="isTerminal() || cell !== null"
          (click)="handleCellClick($index)"
          [attr.data-testid]="'cell-' + $index"
          [attr.data-player]="cell"
          [attr.aria-label]="getCellAriaLabel($index)"
        >
          {{ formatPlayerSymbol(cell) }}
        </button>
      }
    </div>
  `,
  styles: [`
    .game-board {
      @apply bg-white rounded-lg shadow-lg mx-auto;
      
      display: grid;
      gap: 4px;
      padding: 8px;
      width: 320px;
      height: 320px;
      box-sizing: border-box;
      
      &.board-3x3 {
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
      }
      
      &.board-4x4 {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
      }
    }

    .cell {
      @apply bg-gray-50 rounded-md text-2xl font-bold
             hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
             transition-all duration-150 flex items-center justify-center;
      
      border: 1px solid #e5e7eb;
      aspect-ratio: 1;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      cursor: pointer;
      
      /* Player-specific styling with distinct colors */
      &.player-x {
        color: #dc2626 !important; /* Red for X */
        background-color: rgba(220, 38, 38, 0.1);
        border-color: #dc2626;
        font-weight: 900;
        text-shadow: 0 0 2px rgba(220, 38, 38, 0.3);
      }
      
      &.player-o {  
        color: #2563eb !important; /* Blue for O */
        background-color: rgba(37, 99, 235, 0.1);
        border-color: #2563eb;
        font-weight: 900;
        text-shadow: 0 0 2px rgba(37, 99, 235, 0.3);
      }
      
      &:disabled {
        @apply cursor-not-allowed opacity-60;
        
        &:hover {
          @apply bg-gray-50;
        }
      }
      
      &.occupied {
        @apply bg-gray-100 cursor-not-allowed;
        border-color: #d1d5db;
      }
      
      &.winning {
        @apply bg-green-100 border-green-400;
        animation: winningGlow 1s ease-in-out infinite alternate;
      }
      
      /* New move animation - growing from small to full size - ALWAYS VISIBLE */
      &.new-move {
        animation: growIn 1s ease-out !important;
        
        /* Enhanced player colors during animation */
        &.player-x {
          animation: growInRed 1s ease-out !important;
        }
        
        &.player-o {
          animation: growInBlue 1s ease-out !important;
        }
      }

      /* Basic hover animation - always active */
      &:not(:disabled):not(.occupied):hover {
        transform: scale(1.1) !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        background-color: rgba(59, 130, 246, 0.2) !important;
        border-color: #3b82f6 !important;
        transition: all 0.4s ease-out !important;
      }

      /* Always animate transitions */
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* Visual enhancement animations - enhanced when enhancements are enabled */
    :global(body.transitions-enabled) .cell {
      /* Enhanced hover effects */
      &:not(:disabled):not(.occupied):hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background-color: rgba(59, 130, 246, 0.1);
        border-color: #3b82f6;
      }
      
      /* Smooth transitions for all interactive states */
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      
      /* Enhanced winning animation with scaling */
      &.winning {
        animation: winningGlow 1s ease-in-out infinite alternate,
                  winningPulse 2s ease-in-out infinite;
      }
      
      /* Focus enhancement */
      &:focus {
        transform: scale(1.02);
      }
      
      /* Player symbols get enhanced appearance */
      &.player-x, &.player-o {
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
    
    /* Board size transition */
    :global(body.transitions-enabled) .game-board {
      transition: all 0.3s ease-in-out;
      
      &.size-changing {
        animation: boardResize 0.3s ease-in-out;
      }
    }
    
    @keyframes winningGlow {
      0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
      100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); }
    }
    
    @keyframes winningPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    
    @keyframes growIn {
      0% {
        transform: scale(0.1) rotate(-180deg);
        opacity: 0;
      }
      30% {
        transform: scale(0.5) rotate(-90deg);
        opacity: 0.5;
      }
      70% {
        transform: scale(1.3) rotate(10deg);
        opacity: 0.8;
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }
    
    @keyframes growInRed {
      0% {
        transform: scale(0.1) rotate(-180deg);
        opacity: 0;
        background-color: rgba(220, 38, 38, 0.8);
        box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
        border-color: #dc2626;
      }
      30% {
        transform: scale(0.6) rotate(-90deg);
        opacity: 0.6;
        background-color: rgba(220, 38, 38, 0.6);
        box-shadow: 0 0 40px rgba(220, 38, 38, 0.6);
      }
      70% {
        transform: scale(1.4) rotate(15deg);
        background-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 0 50px rgba(220, 38, 38, 0.5);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
        background-color: rgba(220, 38, 38, 0.1);
        box-shadow: 0 0 5px rgba(220, 38, 38, 0.3);
      }
    }
    
    @keyframes growInBlue {
      0% {
        transform: scale(0.1) rotate(-180deg);
        opacity: 0;
        background-color: rgba(37, 99, 235, 0.8);
        box-shadow: 0 0 30px rgba(37, 99, 235, 0.8);
        border-color: #2563eb;
      }
      30% {
        transform: scale(0.6) rotate(-90deg);
        opacity: 0.6;
        background-color: rgba(37, 99, 235, 0.6);
        box-shadow: 0 0 40px rgba(37, 99, 235, 0.6);
      }
      70% {
        transform: scale(1.4) rotate(15deg);
        background-color: rgba(37, 99, 235, 0.3);
        box-shadow: 0 0 50px rgba(37, 99, 235, 0.5);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
        background-color: rgba(37, 99, 235, 0.1);
        box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
      }
    }
    
    @keyframes boardResize {
      0% {
        transform: scale(0.7) rotate(-5deg);
        opacity: 0.5;
        filter: blur(3px);
      }
      50% {
        transform: scale(1.15) rotate(2deg);
        opacity: 0.8;
        filter: blur(1px);
      }
      100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
        filter: blur(0px);
      }
    }

    @media (max-width: 640px) {
      .game-board {
        width: 280px;
        height: 280px;
      }
    }

    @media (max-width: 480px) {
      .game-board {
        width: 260px;
        height: 260px;
      }
      
      .cell {
        @apply text-xl;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent implements OnDestroy {
  private gameService = inject(GameService);
  private enhancementService = inject(VisualEnhancementService);
  private injector = inject(Injector);
  
  // Animation state signals
  private newMovePosition = signal<number | null>(null);
  private isBoardResizing = signal(false);
  
  // Timer cleanup
  private activeTimeouts: ReturnType<typeof setTimeout>[] = [];
  
  // Reactive state from service
  gameState = this.gameService.gameState;
  boardCells = computed(() => this.gameState().board);
  boardSize = computed(() => Math.sqrt(this.boardCells().length));
  isTerminal = computed(() => this.gameService.isTerminal());
  winningLine = computed(() => this.gameState().winningLine);
  
  // Animation state accessors
  protected newMovePosition$ = this.newMovePosition.asReadonly();
  protected isBoardResizing$ = this.isBoardResizing.asReadonly();
  
  // Utility function for template
  protected formatPlayerSymbol = formatPlayerSymbol;
  
  handleCellClick(position: number): void {
    const success = this.gameService.makeMove(position);
    
    // Always trigger animation on successful moves - more dramatic when enhancements are on
    if (success) {
      console.log('🎯 Triggering move animation for position:', position);
      this.triggerMoveAnimation(position);
    }
  }
  
  isWinningCell(position: number): boolean {
    const winningLine = this.winningLine();
    return winningLine ? winningLine.includes(position) : false;
  }
  
  isNewMovePosition(position: number): boolean {
    return this.newMovePosition() === position;
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
  
  private triggerMoveAnimation(position: number): void {
    console.log('🚀 Setting newMovePosition signal to:', position);
    this.newMovePosition.set(position);
    
    // Clear animation state after animation completes (1000ms for longer animation)
    const timeoutId = setTimeout(() => {
      console.log('⏰ Clearing newMovePosition signal');
      this.newMovePosition.set(null);
    }, 1200);
    this.activeTimeouts.push(timeoutId);
  }
  
  constructor() {
    // Listen for board size changes to trigger animations
    // Bind effect to component lifecycle using injector
    effect((onCleanup) => {
      this.gameService.boardSizeChangeTrigger();
      this.triggerBoardSizeAnimation();
      
      onCleanup(() => {
        // Effect cleanup will be handled automatically when component is destroyed
      });
    }, { injector: this.injector });
  }
  
  triggerBoardSizeAnimation(): void {
    if (this.enhancementsEnabled()) {
      this.isBoardResizing.set(true);
      
      // Clear animation state after animation completes (200ms)
      const timeoutId = setTimeout(() => {
        this.isBoardResizing.set(false);
      }, 200);
      this.activeTimeouts.push(timeoutId);
    }
  }
  
  private enhancementsEnabled(): boolean {
    return this.enhancementService.enhancementsEnabled();
  }
  
  ngOnDestroy(): void {
    // Clean up all active timeouts
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts = [];
    
    // Effect cleanup is handled automatically via injector binding
  }
}