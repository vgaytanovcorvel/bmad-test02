import { Component, ChangeDetectionStrategy, computed, inject, signal, effect, OnDestroy, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { VisualEnhancementService } from '../../services/visual-enhancement.service';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-status" [attr.data-testid]="'game-status'">
      @if (isTerminal()) {
        @if (winner()) {
          <div class="status-message winner-message" [class.status-change]="isStatusChanging$()">
            {{ winner() }} Wins! 🎉
          </div>
        } @else {
          <div class="status-message draw-message" [class.status-change]="isStatusChanging$()">
            It's a Draw! 🤝
          </div>
        }
      } @else {
        <div 
          class="status-message current-player" 
          [class.player-change]="isPlayerChanging$()"
          [attr.data-testid]="'current-player'"
        >
          {{ currentPlayer() }}'s Turn
        </div>
      }
    </div>
  `,
  styles: [`
    .game-status {
      @apply text-center py-4;
    }

    .status-message {
      @apply text-xl font-bold px-4 py-2 rounded-lg;
    }

    .current-player {
      @apply text-blue-600 bg-blue-50 border border-blue-200;
    }

    .winner-message {
      @apply text-green-700 bg-green-50 border border-green-200;
    }

    .draw-message {
      @apply text-yellow-700 bg-yellow-50 border border-yellow-200;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameStatusComponent implements OnDestroy {
  private gameService = inject(GameService);
  private enhancementService = inject(VisualEnhancementService);
  private injector = inject(Injector);
  
  // Animation state signals
  private isStatusChanging = signal(false);
  private isPlayerChanging = signal(false);
  private previousGameStatus = signal<{ isTerminal: boolean; currentPlayer: string | null }>({
    isTerminal: false,
    currentPlayer: null
  });
  
  // Timer cleanup
  private activeTimeouts: ReturnType<typeof setTimeout>[] = [];
  
  // Reactive state from service
  gameState = this.gameService.gameState;
  isTerminal = computed(() => this.gameService.isTerminal());
  winner = computed(() => this.gameState().winner);
  currentPlayer = computed(() => this.gameState().currentPlayer);
  
  // Animation state accessors
  protected isStatusChanging$ = this.isStatusChanging.asReadonly();
  protected isPlayerChanging$ = this.isPlayerChanging.asReadonly();
  
  constructor() {
    // Track status and player changes for animations
    // Bind effect to component lifecycle using injector
    effect((onCleanup) => {
      const currentStatus = {
        isTerminal: this.isTerminal(),
        currentPlayer: this.currentPlayer()
      };
      
      const previous = this.previousGameStatus();
      
      if (this.enhancementService.enhancementsEnabled()) {
        // Check for status change (game ending)
        if (previous.isTerminal !== currentStatus.isTerminal && currentStatus.isTerminal) {
          this.triggerStatusChangeAnimation();
        }
        
        // Check for player change
        if (previous.currentPlayer !== null && 
            previous.currentPlayer !== currentStatus.currentPlayer && 
            !currentStatus.isTerminal) {
          this.triggerPlayerChangeAnimation();
        }
      }
      
      // Update previous status AFTER the effect runs using setTimeout to avoid infinite loop
      setTimeout(() => {
        this.previousGameStatus.set(currentStatus);
      }, 0);
      
      onCleanup(() => {
        // Effect cleanup will be handled automatically when component is destroyed
      });
    }, { injector: this.injector });
  }

  
  private triggerStatusChangeAnimation(): void {
    this.isStatusChanging.set(true);
    
    // Clear animation state after animation completes (150ms)
    const timeoutId = setTimeout(() => {
      this.isStatusChanging.set(false);
    }, 150);
    this.activeTimeouts.push(timeoutId);
  }
  
  private triggerPlayerChangeAnimation(): void {
    this.isPlayerChanging.set(true);
    
    // Clear animation state after animation completes (150ms)
    const timeoutId = setTimeout(() => {
      this.isPlayerChanging.set(false);
    }, 150);
    this.activeTimeouts.push(timeoutId);
  }
  
  ngOnDestroy(): void {
    // Clean up all active timeouts
    this.activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.activeTimeouts = [];
    
    // Effect cleanup is handled automatically via injector binding
  }
}