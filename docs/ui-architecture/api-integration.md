# API Integration

Since this is a pure client-side application, there are no external API integrations. The game engine is consumed directly:

```typescript
// Direct library imports
import { GameEngine, ComputerPlayer } from '@libs/engine';
import { GameState, Player, Move } from '@libs/shared';

// Service integration pattern
@Injectable({ providedIn: 'root' })
export class GameService {
  private engine = new GameEngine();
  private computerPlayer = new ComputerPlayer();
  
  // Direct method calls, no HTTP needed
  makeMove(move: Move): GameState {
    return this.engine.applyMove(this.currentState, move);
  }
}
```
