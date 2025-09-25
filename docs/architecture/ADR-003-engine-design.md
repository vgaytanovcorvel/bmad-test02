# ADR-003: Game Engine Design and Architecture

## Status
Accepted

## Date
2024-01-15

## Context

The Tic Tac Toe Showcase project requires a robust, extensible game engine that can:
- Handle multiple board sizes (3x3, 4x4) with configurable winning conditions (k-in-row)
- Support different game modes (human vs human, future AI implementations)
- Maintain immutable state for predictable behavior and time-travel debugging
- Provide high performance for real-time gameplay and rapid move validation
- Enable comprehensive testing through pure, deterministic functions
- Support future extensions (multiplayer, different game types, AI strategies)

The engine must demonstrate enterprise-grade architecture patterns while remaining understandable and maintainable for showcase purposes.

## Decision

We have implemented a functional, immutable game engine with the following core architectural patterns:

### Factory Pattern for Engine Creation
```typescript
// Centralized engine creation with preconfigured defaults
const engine3x3 = EngineFactory.create3x3Engine();
const engine4x4 = EngineFactory.create4x4Engine();
const customEngine = EngineFactory.createCustomEngine(config);
```

### Immutable State Management
```typescript
interface GameState {
  readonly board: ReadonlyArray<Cell>;
  readonly config: Readonly<GameConfig>;
  readonly currentPlayer: Player;
  readonly status: GameStatus;
  readonly moveHistory: ReadonlyArray<Move>;
  // ... other immutable properties
}
```

### K-in-Row Scanning Algorithm
- **Grid-based traversal**: Efficient scanning in all directions (horizontal, vertical, diagonal, anti-diagonal)
- **Configurable k-value**: Supports k=3 for 3x3 boards, k=3 for 4x4 boards (extensible to any k≤boardSize)
- **Early termination**: Scanning stops immediately upon finding first winning line
- **Multiple winner detection**: Can identify all possible winning lines for analysis

### Pure Function Architecture
- **Deterministic operations**: All engine methods are pure functions with no side effects
- **Predictable state transitions**: `newState = engine.applyMove(currentState, move)`
- **Time-travel capability**: Any previous game state can be recreated from move history
- **Comprehensive testability**: Pure functions enable isolated unit testing

### Position-based Board Representation
```typescript
// 3x3 board positions:    4x4 board positions:
// 0 | 1 | 2               0  | 1  | 2  | 3
// --|---|--               ---|----|----|---
// 3 | 4 | 5               4  | 5  | 6  | 7
// --|---|--               ---|----|----|---
// 6 | 7 | 8               8  | 9  | 10 | 11
//                         ---|----|----|---
//                         12 | 13 | 14 | 15
```

## Rationale

### Immutability Benefits
- **Predictable State**: No accidental mutations prevent debugging complexity
- **Time Travel**: Complete game history enables undo/redo and replay functionality  
- **Threading Safety**: Immutable objects are inherently thread-safe for future concurrency
- **Caching Optimization**: Immutable states can be safely cached and memoized
- **Debugging Experience**: State snapshots provide clear debugging checkpoints

### K-in-Row Algorithm Design
- **Flexibility**: Same algorithm handles any board size and k-value combination
- **Performance**: O(n²) complexity for complete board scan, O(k) for individual line checks
- **Extensibility**: Easily adapts to larger boards (5x5, 6x6) or different k-values
- **Comprehensive Detection**: Finds all winning lines, not just the first one encountered

### Factory Pattern Advantages
- **Consistent Configuration**: Prevents misconfiguration of board size and k-value combinations
- **Extensibility**: New engine types (AI-enhanced, networked) can be added easily
- **Testing Support**: Factories provide known-good configurations for test scenarios
- **Documentation**: Factory methods serve as clear examples of proper engine usage

### Pure Function Architecture Benefits
- **Testability**: Engine logic can be unit tested without mocking or complex setup
- **Predictability**: Same input always produces same output, enabling reliable behavior
- **Debugging**: Function calls can be traced and reproduced exactly
- **Performance**: Pure functions can be optimized, cached, and parallelized safely
- **Maintainability**: No hidden state or side effects to track during development

## Implementation Details

### K-in-Row Scanning Strategy
```typescript
// Scan all possible lines from each position
for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    // Check horizontal, vertical, diagonal, anti-diagonal
    const directions = [[0,1], [1,0], [1,1], [1,-1]];
    directions.forEach(([deltaRow, deltaCol]) => {
      const line = extractKLine(row, col, deltaRow, deltaCol, k);
      if (isWinningLine(line)) winningLines.push(line);
    });
  }
}
```

### State Transition Pattern
```typescript
// Immutable state transitions with validation
export function applyMove(state: GameState, move: Move): GameState {
  validateMove(state, move);
  const newBoard = [...state.board];
  newBoard[move.position] = move.player;
  
  return {
    ...state,
    board: newBoard,
    currentPlayer: getNextPlayer(state.currentPlayer),
    moveHistory: [...state.moveHistory, move],
    status: calculateGameStatus(newBoard, state.config),
    // ... other updated properties
  };
}
```

### Performance Optimizations
- **Early termination**: Move validation stops on first invalid condition
- **Lazy evaluation**: Winning line detection only runs after moves, not continuously
- **Minimal object creation**: Board arrays reused where possible, only changed cells updated
- **Efficient lookups**: Position-to-coordinate conversion uses mathematical formulas, not lookup tables

## Consequences

### Positive
- **Maintainable Architecture**: Clear separation between pure logic and UI concerns
- **Comprehensive Testing**: Pure functions enable thorough unit test coverage
- **Future-Proof Design**: Architecture supports extensions without breaking changes
- **Performance**: Optimized algorithms handle larger boards efficiently
- **Developer Experience**: Predictable behavior and clear APIs improve development velocity
- **Debugging Support**: Immutable states and pure functions simplify troubleshooting
- **Code Quality**: Functional patterns encourage better coding practices

### Negative
- **Memory Usage**: Immutable state creation generates more garbage collection overhead
- **Learning Curve**: Functional programming patterns may be unfamiliar to some developers
- **Initial Complexity**: Pure function architecture requires more upfront design consideration
- **Performance Trade-offs**: Immutability can be slower than in-place mutations for very large boards

### Trade-off Analysis
- **Memory vs. Debugging**: Increased memory usage is acceptable for significantly improved debugging experience
- **Initial Complexity vs. Long-term Maintainability**: Upfront functional design investment pays dividends in maintenance
- **Performance vs. Safety**: Slight performance overhead is worthwhile for guaranteed correctness and testability

## Validation and Testing

### Unit Test Coverage
- **Move Validation**: All valid and invalid move scenarios tested comprehensively
- **State Transitions**: Every possible game state transition validated
- **K-in-Row Detection**: All winning patterns on all board sizes verified
- **Edge Cases**: Boundary conditions, full boards, and corner cases covered
- **Performance Tests**: Algorithm complexity and execution time benchmarks

### Integration Testing
- **Complete Game Workflows**: Full games played programmatically to verify end-to-end behavior
- **Configuration Validation**: All supported board sizes and k-values tested
- **Error Handling**: Invalid configurations and moves handled gracefully
- **History Reconstruction**: Game states can be rebuilt from move history accurately

### Example Usage Validation
- **Documentation Examples**: All README code samples are tested and verified to work
- **Factory Patterns**: All factory methods produce correctly configured engines
- **API Contracts**: Public interfaces match documented behavior exactly

## Future Extensions

### Planned Enhancements
- **Variable K-Values**: Support for k > 3 on larger boards (Connect 4, Connect 5)
- **AI Integration**: Computer player strategies integrated with same engine interface
- **Multiplayer Support**: Network synchronization using same immutable state model
- **Advanced Analysis**: Game tree exploration and position evaluation for AI development
- **Performance Scaling**: Optimizations for very large boards (10x10+) with same algorithmic approach

### Extension Points
- **Engine Interface**: Stable contract allows multiple engine implementations
- **Factory Extensibility**: New factory methods can create specialized engines
- **State Serialization**: Immutable states can be serialized/deserialized for persistence
- **Move Validation**: Custom validation rules can be added without breaking existing logic

## References
- [Engine API Documentation](../../libs/engine/README.md)
- [3x3 Usage Examples](../../libs/engine/src/lib/examples/engine-3x3-examples.spec.ts)
- [4x4 Usage Examples](../../libs/engine/src/lib/examples/engine-4x4-examples.spec.ts)
- [Functional Programming Patterns](https://github.com/immutable-js/immutable-js)
- [Game Development Best Practices](https://gamedev.stackexchange.com/questions/tagged/architecture)