# Tic-Tac-Toe Game Engine

A pure functional, immutable game engine library for tic-tac-toe games supporting both 3x3 and 4x4 board sizes with k-in-row winning conditions. Built with TypeScript and designed for high performance, testability, and easy integration with UI frameworks.

## Features

- 🎯 **Pure Functional Design**: All engine methods are pure functions with no side effects
- 🔒 **Immutable State**: All state objects are readonly and never mutated
- 🎮 **Multiple Board Sizes**: Supports both 3x3 and 4x4 boards
- 🏆 **K-in-Row Winning**: Configurable winning conditions (k=3 for both board sizes)
- 🤖 **Computer Player**: Built-in AI opponent with strategic move selection
- ⚡ **High Performance**: Optimized algorithms with efficient inner loops
- 🧪 **Fully Tested**: 295+ unit tests with comprehensive coverage
- 📝 **TypeScript**: Full type safety with strict typing throughout

## Installation

```bash
npm install @libs/engine @libs/shared
# or
pnpm add @libs/engine @libs/shared
```

## Quick Start

```typescript
import { EngineFactory, Engine } from '@libs/engine';
import { GameConfig, GameState, Move } from '@libs/shared';

// Create a 3x3 engine
const engine = EngineFactory.create3x3Engine();

// Configure game
const config: GameConfig = {
  boardSize: 3,
  kInRow: 3,
  firstPlayer: 'X',
  mode: 'human-vs-human'
};

// Start game
const gameState = engine.initialState(config);

// Make a move
const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
const newState = engine.applyMove(gameState, move);

// Check game status
if (engine.isTerminal(newState)) {
  const winner = engine.winner(newState);
  console.log(winner ? `${winner} wins!` : 'Draw!');
}
```

## API Reference

### Engine Interface

The `Engine` interface provides the core functionality for game state management:

```typescript
interface Engine {
  initialState(config: GameConfig): GameState;
  legalMoves(state: GameState): number[];
  applyMove(state: GameState, move: Move): GameState;
  isTerminal(state: GameState): boolean;
  winner(state: GameState): Player | null;
  kInRow(state: GameState): number[][];
}
```

#### `initialState(config: GameConfig): GameState`

Creates a new game state from configuration.

**Parameters:**
- `config` - Game configuration object

**Returns:** Initial game state ready for first move

**Example:**
```typescript
const config: GameConfig = {
  boardSize: 3,
  kInRow: 3,
  firstPlayer: 'X',
  mode: 'human-vs-computer'
};
const gameState = engine.initialState(config);
```

#### `legalMoves(state: GameState): number[]`

Returns all legal move positions for the current player.

**Parameters:**
- `state` - Current game state

**Returns:** Array of legal board positions (0-based indices)

**Example:**
```typescript
const legalMoves = engine.legalMoves(gameState);
// Returns: [0, 2, 5, 6, 7, 8] for available positions
```

#### `applyMove(state: GameState, move: Move): GameState`

Applies a move and returns new game state.

**Parameters:**
- `state` - Current game state
- `move` - Move to apply

**Returns:** New immutable game state

**Throws:**
- `Error` - If move is illegal or invalid

**Example:**
```typescript
const move: Move = { player: 'X', position: 4, timestamp: Date.now() };
const newState = engine.applyMove(gameState, move);
```

#### `isTerminal(state: GameState): boolean`

Checks if the game has ended.

**Parameters:**
- `state` - Game state to check

**Returns:** `true` if game is over, `false` if still playing

#### `winner(state: GameState): Player | null`

Gets the winner of a terminal game.

**Parameters:**
- `state` - Terminal game state

**Returns:** Winner player or `null` for draw

**Throws:**
- `Error` - If called on non-terminal game

#### `kInRow(state: GameState): number[][]`

Gets all winning lines in the current state.

**Parameters:**
- `state` - Game state to analyze

**Returns:** Array of winning line coordinates

**Example:**
```typescript
const winningLines = engine.kInRow(gameState);
// Returns: [[0, 1, 2]] for top row win
// Returns: [[0, 4, 8], [2, 4, 6]] for multiple wins
```

### EngineFactory

Factory class for creating configured engine instances:

```typescript
class EngineFactory {
  static createEngine(config: GameConfig): Engine;
  static create3x3Engine(firstPlayer?: Player): Engine;
  static create4x4Engine(firstPlayer?: Player): Engine;
  static createHumanVsComputerEngine(boardSize: BoardSize, firstPlayer?: Player): Engine;
}
```

#### `create3x3Engine(firstPlayer?: Player): Engine`

Creates a pre-configured 3x3 engine.

**Parameters:**
- `firstPlayer` - Optional first player (defaults to 'X')

**Returns:** Engine configured for 3x3 games

**Example:**
```typescript
const engine = EngineFactory.create3x3Engine();
const engineWithO = EngineFactory.create3x3Engine('O');
```

#### `create4x4Engine(firstPlayer?: Player): Engine`

Creates a pre-configured 4x4 engine.

**Parameters:**
- `firstPlayer` - Optional first player (defaults to 'X')

**Returns:** Engine configured for 4x4 games

**Example:**
```typescript
const engine = EngineFactory.create4x4Engine();
const engineWithO = EngineFactory.create4x4Engine('O');
```

## State Management

### GameState Structure

The `GameState` interface represents the complete state of a game:

```typescript
interface GameState {
  readonly board: readonly Cell[];           // Board cell states
  readonly currentPlayer: Player;            // Current player ('X' or 'O')
  readonly moveHistory: readonly Move[];     // Complete move history
  readonly status: 'playing' | 'won' | 'draw'; // Game status
  readonly winner: Player | null;            // Winner or null
  readonly winningLine: readonly number[] | null; // Winning positions
  readonly config: GameConfig;               // Game configuration
  readonly startTime: number;                // Game start timestamp
  readonly endTime?: number;                 // Game end timestamp
}
```

**Board Indexing:**
- 3x3 board: positions 0-8
- 4x4 board: positions 0-15
- Index 0 = top-left, increases left-to-right, top-to-bottom

```
3x3 Board:    4x4 Board:
0 | 1 | 2     0  | 1  | 2  | 3
---------     -----------------
3 | 4 | 5     4  | 5  | 6  | 7
---------     -----------------
6 | 7 | 8     8  | 9  | 10 | 11
              -----------------
              12 | 13 | 14 | 15
```

### GameConfig Options

Configure game behavior with `GameConfig`:

```typescript
interface GameConfig {
  readonly boardSize: BoardSize;    // 3 or 4
  readonly kInRow: number;          // Always 3
  readonly firstPlayer: Player;     // 'X' or 'O'
  readonly mode: GameMode;          // Game mode
}
```

**Supported Game Modes:**
- `'human-vs-human'` - Two human players
- `'human-vs-computer'` - Human vs AI
- `'computer-vs-computer'` - AI vs AI

### Immutability Patterns

All engine operations maintain immutability:

```typescript
// ✅ Correct: Engine returns new state
const newState = engine.applyMove(currentState, move);
console.log(currentState === newState); // false - different objects

// ✅ Correct: Original state unchanged
console.log(currentState.board[4]); // null (unchanged)
console.log(newState.board[4]); // 'X' (new state)

// ❌ Wrong: Never mutate state directly
currentState.board[4] = 'X'; // TypeError: Cannot assign to readonly property
```

## Configuration

### 3x3 Game Configuration

```typescript
const config3x3: GameConfig = {
  boardSize: 3,
  kInRow: 3,
  firstPlayer: 'X',
  mode: 'human-vs-human'
};

const engine = EngineFactory.createEngine(config3x3);
// or
const engine = EngineFactory.create3x3Engine();
```

### 4x4 Game Configuration

```typescript
const config4x4: GameConfig = {
  boardSize: 4,
  kInRow: 3,          // Still k=3 for 4x4 board
  firstPlayer: 'O',
  mode: 'human-vs-computer'
};

const engine = EngineFactory.createEngine(config4x4);
// or
const engine = EngineFactory.create4x4Engine('O');
```

### Human vs Computer Configuration

```typescript
// 3x3 vs computer
const engine = EngineFactory.createHumanVsComputerEngine(3, 'X');

// 4x4 vs computer
const engine = EngineFactory.createHumanVsComputerEngine(4, 'O');
```

## Examples

### Complete 3x3 Game Workflow

```typescript
import { EngineFactory } from '@libs/engine';
import { Move } from '@libs/shared';

// Create engine
const engine = EngineFactory.create3x3Engine();

// Start game
let gameState = engine.initialState({
  boardSize: 3,
  kInRow: 3,
  firstPlayer: 'X',
  mode: 'human-vs-human'
});

// Game loop
while (!engine.isTerminal(gameState)) {
  // Get legal moves
  const legalMoves = engine.legalMoves(gameState);
  console.log(`Legal moves for ${gameState.currentPlayer}:`, legalMoves);
  
  // Make a move (example: first legal move)
  const position = legalMoves[0];
  const move: Move = {
    player: gameState.currentPlayer,
    position,
    timestamp: Date.now()
  };
  
  // Apply move
  gameState = engine.applyMove(gameState, move);
  console.log(`${move.player} played position ${position}`);
}

// Check result
const winner = engine.winner(gameState);
if (winner) {
  const winningLines = engine.kInRow(gameState);
  console.log(`${winner} wins! Winning line:`, winningLines[0]);
} else {
  console.log('Game ended in draw!');
}
```

### Complete 4x4 Game Workflow

```typescript
import { EngineFactory } from '@libs/engine';

// Create 4x4 engine
const engine = EngineFactory.create4x4Engine('O');

let gameState = engine.initialState({
  boardSize: 4,
  kInRow: 3,
  firstPlayer: 'O',
  mode: 'human-vs-human'
});

// Example moves for 4x4 game
const moves = [5, 6, 9, 10, 13]; // O wins with diagonal

for (const position of moves) {
  if (engine.isTerminal(gameState)) break;
  
  const move: Move = {
    player: gameState.currentPlayer,
    position,
    timestamp: Date.now()
  };
  
  gameState = engine.applyMove(gameState, move);
  console.log(`Board after ${move.player} plays position ${position}:`);
  
  // Display 4x4 board
  for (let row = 0; row < 4; row++) {
    const rowCells = gameState.board.slice(row * 4, (row + 1) * 4);
    console.log(rowCells.map(cell => cell || ' ').join(' | '));
  }
  console.log('-------------------');
}
```

### Move Validation Examples

```typescript
// Check if position is legal
const legalMoves = engine.legalMoves(gameState);
const isLegal = legalMoves.includes(position);

if (isLegal) {
  const move: Move = { player: gameState.currentPlayer, position, timestamp: Date.now() };
  try {
    gameState = engine.applyMove(gameState, move);
  } catch (error) {
    console.error('Move failed:', error.message);
  }
} else {
  console.log('Illegal move:', position);
}
```

### Terminal State Examples

```typescript
// Check game ending conditions
if (engine.isTerminal(gameState)) {
  const winner = engine.winner(gameState);
  
  if (winner) {
    // Game won
    const winningLines = engine.kInRow(gameState);
    console.log(`${winner} wins!`);
    console.log('Winning lines:', winningLines);
    
    if (gameState.winningLine) {
      console.log('Primary winning line:', gameState.winningLine);
    }
  } else {
    // Game drawn
    console.log('Game ended in draw - board is full');
    console.log('Total moves:', gameState.moveHistory.length);
  }
  
  // Game duration
  const duration = (gameState.endTime || Date.now()) - gameState.startTime;
  console.log(`Game duration: ${duration}ms`);
}
```

### Error Handling Examples

```typescript
try {
  // Attempt invalid move
  const invalidMove: Move = {
    player: 'X',
    position: -1, // Invalid position
    timestamp: Date.now()
  };
  gameState = engine.applyMove(gameState, invalidMove);
} catch (error) {
  console.error('Invalid move error:', error.message);
}

try {
  // Wrong player
  const wrongPlayerMove: Move = {
    player: 'O', // But current player is 'X'
    position: 0,
    timestamp: Date.now()
  };
  gameState = engine.applyMove(gameState, wrongPlayerMove);
} catch (error) {
  console.error('Wrong player error:', error.message);
}

try {
  // Occupied cell
  const occupiedCellMove: Move = {
    player: gameState.currentPlayer,
    position: 4, // Already occupied
    timestamp: Date.now()
  };
  gameState = engine.applyMove(gameState, occupiedCellMove);
} catch (error) {
  console.error('Occupied cell error:', error.message);
}
```

## Testing

The engine includes comprehensive test coverage with multiple testing approaches:

### Running Tests

```bash
# Run all engine tests
pnpm nx test engine

# Run with coverage
pnpm nx test engine --coverage

# Run performance tests
pnpm nx test engine --testNamePattern="performance"
```

### Test Categories

1. **Unit Tests**: Individual method testing
2. **Integration Tests**: Complete game workflows
3. **Performance Tests**: Timing and optimization validation
4. **Example Tests**: Usage pattern demonstrations

### Testing Utilities

```typescript
import { PerformanceTimer } from '@libs/engine';

// Performance testing helper
const timer = new PerformanceTimer();
timer.start();
// ... engine operations ...
const duration = timer.stop();
console.log(`Operation took: ${duration}ms`);
```

## Architecture

### Design Principles

1. **Pure Functions**: No side effects, predictable outputs
2. **Immutability**: State objects never modified
3. **Type Safety**: Strict TypeScript throughout
4. **Performance**: Optimized algorithms with efficient loops
5. **Testability**: Easy to test in isolation
6. **Composability**: Factory pattern for configuration

### K-in-Row Scanning Strategy

The engine uses an optimized scanning strategy for win detection:

- **Rows**: Horizontal line scanning
- **Columns**: Vertical line scanning  
- **Diagonals**: Both diagonal directions
- **Efficiency**: Early termination on first win found
- **Scalability**: Works for both 3x3 and 4x4 boards

### Performance Optimizations

- Efficient inner loops avoiding unnecessary allocations
- Early termination in win detection
- Readonly types for compile-time immutability
- Optimized board indexing calculations
- Cached legal move generation

For detailed architectural decisions, see [ADR-002: Project Structure](../../docs/architecture/ADR-002-project-structure.md).

## Troubleshooting

### Common Issues

**Q: Move validation fails unexpectedly**
A: Ensure the move player matches `gameState.currentPlayer` and the position is within board bounds and unoccupied.

**Q: Engine throws on winner() call**
A: Only call `winner()` on terminal game states. Check `isTerminal()` first.

**Q: Board positions seem wrong**
A: Board uses 0-based indexing. For 3x3: positions 0-8, for 4x4: positions 0-15.

**Q: State mutation errors**
A: All state objects are readonly. Always use engine methods to create new states.

### Debug Patterns

```typescript
// Debug game state
console.log('Current player:', gameState.currentPlayer);
console.log('Board state:', gameState.board);
console.log('Legal moves:', engine.legalMoves(gameState));
console.log('Is terminal:', engine.isTerminal(gameState));

if (engine.isTerminal(gameState)) {
  console.log('Winner:', engine.winner(gameState));
  console.log('Winning lines:', engine.kInRow(gameState));
}

// Debug move history
gameState.moveHistory.forEach((move, index) => {
  console.log(`Move ${index + 1}: ${move.player} -> ${move.position}`);
});
```

## Building

Run `nx build engine` to build the library.

## Running unit tests

Run `nx test engine` to execute the unit tests via [Jest](https://jestjs.io).
