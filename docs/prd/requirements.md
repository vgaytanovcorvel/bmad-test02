# Requirements

### Functional Requirements (v1.3 Reduced Scope)
 - FR1: Establish project scaffolding and a minimal `/health` route/canary page; deployment is manual (documented) rather than CI/CD-based.
 - FR2: Implement a game engine supporting two board sizes and win rules: 3x3 (k=3) and 4x4 (k=3). Winning lines include any contiguous k-in-a-row across rows, columns, and both diagonals. Include legal move validation, turn alternation, terminal-state detection (win/draw), and reject invalid moves (occupied cell or post-terminal) with a clear error.
 - FR3: Support gameplay modes: Human vs Human and Human vs Computer (single perfect-play computer). (Removed: AI vs AI, difficulty tiers.)
 - FR4: Computer opponent selects a best move via exhaustive search of possible continuations. No memoization or pruning in v1.3 (future enhancement). Deterministic choice; if multiple optimal outcomes exist, any optimal move is acceptable.
 - FR5: Provide a responsive web UI that renders the board, indicates current player, allows move input, shows outcomes (win/draw), and supports starting a new game. Undo/redo and per-move history are out of scope.
 - FR6: Optional subtle visual enhancement; simple terminal-state lock disabling further input. (3D / Babylon.js removed for now.)
 - FR7: Expose a minimal public API from the engine consumed directly by the UI (no worker layer).
 - FR8: Provide a unit test suite covering engine rules (k-in-row, terminal detection, correct optimal move in selected scenarios) and minimal UI smoke tests.
 - FR9: Provide a Credits/About page accessible from the main UI listing contributors and third-party libraries (versions/licenses) and linking to LICENSE/NOTICE files.
 - FR10: Provide integration tests and e2e Playwright tests covering health route and basic Human vs Computer game flow (3x3 & 4x4), win/draw detection. Accessibility tests removed (out of scope v1.3).

### Non-Functional Requirements (v1.3 Updated)
 - NFR1: Target ≥85% combined unit + integration coverage for engine & UI logic (e2e excluded from coverage metrics but required to pass).
 - NFR2: Minimal architecture: engine + UI only; no undo/redo, statistics, AI abstraction layers.
 - NFR3: Performance: for 3x3 & 4x4 exhaustive search must complete perceptibly instantly (<10ms typical on modern hardware). Future larger boards will require design of pruning/memoization (deferred).
 - NFR4: Documentation: concise README (setup, run, test, build) plus short architecture note (exhaustive search rationale & extension path for more board sizes/k values).
 - NFR5: Basic security hygiene (no unsafe HTML injection; sanitize any future user-entered strings if added).
 - NFR6: Supported browsers limited to current Chrome & Edge (latest stable). Firefox/Safari/mobile optimization deferred.
 - NFR7: Maintain code quality via linting & formatting; all commits pass tests before merge.
 - NFR8: Licensing & attribution compliance via a Credits page and LICENSE/NOTICE files; automated generation of dependency metadata is optional and may be deferred.

Removed (v1.2 -> v1.3): Accessibility (ARIA / reduced-motion) requirements, bundle size target, multi-browser matrix. Rationale: focus on core AI + engineering methodology demonstration; can be reinstated in later iteration.
