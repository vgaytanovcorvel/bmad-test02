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
      [class.effects-enabled]="enhancementsEnabled()"
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
      @apply mx-auto;
      
      display: grid;
      gap: 1px;
      padding: 16px;
      width: 340px;
      height: 340px;
      box-sizing: border-box;
      background: #475569; /* Use a lighter slate for grid lines */
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04),
                  0 0 0 1px rgba(255, 255, 255, 0.05);
      
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
      @apply text-3xl font-bold
             focus:outline-none transition-all duration-200 
             flex items-center justify-center;
      
      background: #334155; /* Lighter slate for unplayed cells */
      border: none;
      border-radius: 12px;
      aspect-ratio: 1;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      position: relative;
      
      &:hover:not(:disabled) {
        background: #475569;
        border-color: #94a3b8;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #0ea5e9;
        border-color: #0ea5e9;
        transform: scale(1.02);
      }
      
      /* Player-specific styling with elevated colors */
      &.player-x {
        color: #22d3ee !important; /* Vibrant Cyan for X */
        font-weight: 900;
        text-shadow: 0 1px 3px rgba(34, 211, 238, 0.2);
      }
      
      &.player-o {  
        color: #f9a8d4 !important; /* Brighter Pink for O */
        font-weight: 900;
        text-shadow: 0 1px 3px rgba(249, 168, 212, 0.2);
      }
      
      &.occupied {
        background: #1e293b; /* Match board background for occupied cells */
      }
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
        
        &:hover {
          background: #f8fafc !important;
          transform: none !important;
          box-shadow: none !important;
        }
      }
      
      &.occupied {
        cursor: not-allowed;
        
        &:hover {
          transform: none !important;
        }
      }
      
      &.winning {
        background: #1e293b !important;
        border-color: #f59e0b !important;
        animation: winningGlow 1.5s ease-in-out infinite alternate,
                   winningPulse 0.8s ease-in-out;
        z-index: 10;
        
        &.player-x {
          color: #fef3c7 !important;
          text-shadow: 0 0 15px rgba(254, 243, 199, 0.8);
        }
        
        &.player-o {
          color: #fef3c7 !important;
          text-shadow: 0 0 15px rgba(254, 243, 199, 0.8);
        }
      }
      
      /* Minimal visual feedback when effects are OFF */
      &.new-move {
        animation: none;
        /* Just a subtle highlight for accessibility */
        background-color: rgba(59, 130, 246, 0.05);
        transition: background-color 0.1s ease-out;
      }
      
      /* Minimal hover effects when enhancements are OFF */
      &:not(:disabled):not(.occupied):hover {
        background-color: rgba(59, 130, 246, 0.05);
        transition: background-color 0.1s ease-out;
      }
    }
    
    /* Visual enhancement animations - ONLY when enhancements are enabled */
    .effects-enabled .cell {
      /* Full dramatic animations when effects are ON */
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

      /* Enhanced hover effects when effects are ON */
      &:not(:disabled):not(.occupied):hover {
        transform: scale(1.1) !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
        background-color: rgba(59, 130, 246, 0.2) !important;
        border-color: #3b82f6 !important;
        transition: all 0.4s ease-out !important;
      }

      /* Smooth transitions for all interactive states */
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      
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
    
    /* Board size transition - ONLY when enhancements are enabled */
    .effects-enabled {
      transition: all 0.4s ease-in-out;
      
      &.size-changing {
        animation: boardResize 1s ease-in-out;
      }
    }

    /* No board animations when effects are OFF */
    .game-board {
      &.size-changing {
        animation: none;
      }
    }
    
    @keyframes winningGlow {
      0% {
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.3),
                    0 0 40px rgba(245, 158, 11, 0.1);
      }
      100% {
        box-shadow: 0 0 30px rgba(245, 158, 11, 0.5),
                    0 0 60px rgba(245, 158, 11, 0.3);
      }
    }
    
    @keyframes winningPulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.95;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
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
        width: 300px;
        height: 300px;
      }
    }

    @media (max-width: 480px) {
      .game-board {
        width: 280px;
        height: 280px;
        padding: 12px;
      }
      
      .cell {
        font-size: 1.5rem;
        border-radius: 8px;
      }
    }
    
    @media (max-width: 360px) {
      .game-board {
        width: 260px;
        height: 260px;
        padding: 8px;
      }
      
      .cell {
        font-size: 1.25rem;
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
    
    // Only trigger animation when visual enhancements are enabled
    if (success && this.enhancementService.enhancementsEnabled()) {
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
  
  protected enhancementsEnabled(): boolean {
    const enabled = this.enhancementService.enhancementsEnabled();
    console.log('🎮 Game board checking enhancements:', enabled);
    return enabled;
  }
  
  ngOnDestroy(): void {
    // Clean up all active timeouts
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts = [];
    
    // Effect cleanup is handled automatically via injector binding
  }
}