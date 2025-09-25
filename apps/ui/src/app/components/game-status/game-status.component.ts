import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-status" [attr.data-testid]="'game-status'">
      @if (isTerminal()) {
        @if (winner()) {
          <div class="status-message winner-message">
            {{ winner() }} Wins! 🎉
          </div>
        } @else {
          <div class="status-message draw-message">
            It's a Draw! 🤝
          </div>
        }
      } @else {
        <div class="status-message current-player" [attr.data-testid]="'current-player'">
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
export class GameStatusComponent {
  private gameService = inject(GameService);
  
  // Reactive state from service
  gameState = this.gameService.gameState;
  isTerminal = computed(() => this.gameService.isTerminal());
  winner = computed(() => this.gameState().winner);
  currentPlayer = computed(() => this.gameState().currentPlayer);
}