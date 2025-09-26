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
      text-align: center;
      padding: 1.5rem 0;
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-message {
      font-size: 1.5rem;
      font-weight: 700;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      min-width: 220px;
      display: inline-block;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      transition: all 0.3s ease-in-out;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .current-player {
      color: #0891b2;
      background: linear-gradient(135deg, #ecfeff, #cffafe);
      border: 2px solid #06b6d4;
      text-shadow: 0 1px 2px rgba(8, 145, 178, 0.1);
    }

    .winner-message {
      color: #f59e0b;
      background: linear-gradient(135deg, #fefbeb, #fef3c7);
      border: 2px solid #f59e0b;
      text-shadow: 0 1px 2px rgba(245, 158, 11, 0.2);
      animation: celebrateWin 0.6s ease-out;
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
    }

    .draw-message {
      color: #64748b;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 2px solid #94a3b8;
      text-shadow: 0 1px 2px rgba(100, 116, 139, 0.1);
    }

    @keyframes celebrateWin {
      0% {
        transform: scale(0.8);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
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