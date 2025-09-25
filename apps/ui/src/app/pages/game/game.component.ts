import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { GameStatusComponent } from '../../components/game-status/game-status.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, GameBoardComponent, GameStatusComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameComponent {
}