# Epic 2: Core Engine & Perfect Computer Opponent

Goal

Implement concise engine (3x3 k=3, 7x7 k=4) with legal move validation, terminal detection, and perfect computer move via exhaustive search + memoization. Undo/redo/history excluded.

Story 2.1 Engine Types and Interfaces

Acceptance Criteria
1: Define shared types in `libs/shared` (e.g., `BoardSize`, `Cell`, `Player`, `Move`, `GameMode`, `GameConfig`, `GameState`, `Result`).
2: Define engine interfaces in `libs/engine` (e.g., `RuleSet`, `Engine`, with methods: `initialState(config)`, `legalMoves(state)`, `applyMove(state, move)`, `isTerminal(state)`, `winner(state)`, `kInRow(state)`).
3: Export a stable public API barrel for `libs/engine` and `libs/shared` with documentation comments.
4: Unit tests assert interface contracts and immutability of returned state objects.

Story 2.2 K-in-Row Logic for 3x3 (k=3)

Acceptance Criteria
1: Implement efficient detection for k-in-row across rows, columns, and both diagonals for a 3x3 board (k=3).
2: Provide `kInRow(state)` returning all winning line coordinates when terminal win occurs.
3: Include tie/draw detection when no legal moves remain and no winner.
4: Unit tests cover all single and multiple winning scenarios, edges, and no-win cases.

Story 2.3 K-in-Row Logic for 4x4 (k=3)

Acceptance Criteria
1: Implement detection for contiguous 3-in-a-row across rows, columns, and both diagonals on 4x4.
2: Avoid unnecessary allocations; simple loops acceptable.
3: Return all winning line coordinates similar to 3x3.
4: Unit tests include overlapping threats, multiple win-line scenarios, edges, and near-miss cases.

Story 2.4 Move Validation and Turn Alternation

Acceptance Criteria
1: `legalMoves(state)` returns only empty cells; rejects moves to occupied cells.
2: `applyMove(state, move)` alternates players X/O and returns a new immutable state.
3: Applying a move to a terminal state raises a descriptive error.
4: Unit tests verify invalid move rejection, alternation correctness, and immutability.

Story 2.5 Terminal-State Detection and Result

Acceptance Criteria
1: `isTerminal(state)` returns true for win or draw; `winner(state)` returns winning player or null.
2: Terminal state includes the final board, last move, and winning line (if any).
3: Unit tests cover win, draw, and ongoing scenarios across both board sizes.

Story 2.6 (Removed) Undo/Redo History — out of scope in simplified plan.

Story 2.7 Configuration and Mode Selection

Acceptance Criteria
1: `GameConfig` supports board size (3x3 or 4x4), k value (3 for both), and initial player.
2: Engine exposes a factory to create an `Engine` with a given `GameConfig`; config is surfaced in `GameState` for UI/tests.
3: Unit tests verify both modes initialize correctly and propagate config through state transitions.

Story 2.8 Performance (Simplified)

Acceptance Criteria
1: Inner loops avoid unnecessary allocations.
2: Simple timing assertion (optional) demonstrates typical move calculation <10ms.
3: Lint rules enforce immutability patterns.

Story 2.9 Documentation and Examples

Acceptance Criteria
1: Add README in `libs/engine` describing public APIs, state shape, and example usage.
2: Add illustrative unit tests as examples of engine usage for both board sizes.
3: ADR entry updated to capture engine design choices (k-in-row scanning strategy, immutability approach).
