# Agentic AI Tic Tac Toe Showcase Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Demonstrate Agentic AI's capability to create production-quality, well-architected applications following established engineering best practices.
- Showcase BMAD methodology effectiveness in producing maintainable, high-quality software with clean architecture patterns.
- Increase confidence in AI-assisted development among professional software engineers.
- Provide concrete evidence that AI can follow sophisticated development methodologies like TDD.
- Create a comprehensive reference implementation for professional software development teams.
- Deliver modular architecture with >90% test coverage and comprehensive documentation.
- Enable engineers to easily understand, extend, and learn from the AI-generated codebase.

### Background Context
Software engineers currently lack concrete examples of how Agentic AI can create enterprise-grade applications that follow established engineering best practices. Most AI-generated code demonstrations are either simplistic showcases or monolithic implementations that fail to demonstrate proper software architecture patterns, comprehensive testing strategies, or adherence to methodologies like TDD. This knowledge gap significantly slows the adoption of AI-assisted development tools in professional software engineering teams.

The Agentic AI Tic Tac Toe Showcase addresses this critical need by using a familiar problem domain to focus attention on sophisticated engineering practices rather than domain complexity. By demonstrating AI's ability to create modular, well-tested, and maintainable code, this project serves as a bridge between AI skepticism and adoption confidence in professional development environments.

### Change Log
| Date       | Version | Description                              | Author          |
|------------|---------|------------------------------------------|-----------------|
| 2025-09-21 | 1.0     | Initial PRD creation from project brief  | John (PM Agent) |

## Requirements

### Functional Requirements
 - FR1: Establish project scaffolding and a minimal health-check route/canary page to enable continuous local testing from Day 1; deployment is manual (documented) rather than CI/CD-based.
- FR2: Implement a game engine supporting two board sizes and win rules: 3x3 (k=3) and 6x6 (k=4). Winning lines include any contiguous k-in-a-row across rows, columns, and both diagonals. Include legal move validation, turn alternation, terminal-state detection (win/draw), and reject invalid moves (occupied cell or post-terminal) with a clear error. Mode is selected at game start and surfaced for tests/UI.
- FR3: Provide state management with undo/redo: maintain a per-move history stack; invalidate redo when a new move occurs after an undo; no hard limit for MVP (configurable limit exposed for tests).
- FR4: Support gameplay modes: human vs human, human vs AI, and AI vs AI, selectable before game start and switchable between rounds.
- FR5: Implement AI difficulties with deterministic behavior definitions:
  - Easy: With 50% probability choose uniformly at random from legal moves; otherwise use the strategic engine.
  - Medium: With 25% probability choose uniformly at random from legal moves; otherwise use the strategic engine.
  - Hard: Compute and play the game-theoretic optimal move (perfect play) for both modes; implement full search with alpha-beta pruning and a transposition table where needed to meet performance targets. Randomness uses a seeded PRNG with seed surfaced for reproducible tests. Strategic tie-breakers: quickest win, then minimize opponent’s best outcome, then center/corners preference, then lowest index.
- FR6: Deliver a responsive web UI that renders the board, indicates current player, allows move input, shows outcomes (win/draw), and supports starting a new game. Use animated, 3D marks for player symbols with entry animations ≤300ms and a reduced-motion fallback.
- FR7: Implement a 3D-styled board in a top-down classic layout. Provide a visible "lock" treatment indicating active vs terminal board states; upon game over, overlay a brief lock animation that disables further input without harming readability.
- FR8: Expose internal module interfaces between UI, engine, players, and state management to demonstrate clear separation of concerns.
- FR9: Provide a comprehensive automated test suite developed via TDD, including unit tests (k-in-row on both sizes, AI difficulty selection including randomness ratios via seeded runs, undo/redo semantics), integration tests (UI ↔ engine ↔ AI), and e2e tests (H vs AI and AI vs AI) across both board sizes and difficulty levels.
 - FR10: Provide a Credits/About page accessible from the main UI (settings/start and footer link) that lists contributors, acknowledges third-party libraries/frameworks (Angular, Nx, Tailwind, Babylon.js, NgRx, Playwright, seedrandom, etc.) with versions and licenses, and links to the project repository and LICENSE/NOTICE files.

### Non-Functional Requirements
- NFR1: Achieve and maintain >90% automated test coverage across all modules.
- NFR2: Enforce clear modular boundaries and separation of concerns with documented interfaces and module contracts.
- NFR3: Meet performance targets: <100ms response time for game operations; initial load bundle size <2MB; animations target 60fps; hard-level AI decision latency <100ms p50 and <500ms p95 for mid-game positions on typical hardware, with graceful UI feedback if exceeded.
- NFR4: Provide complete documentation: README, API docs, architecture decisions (ADRs), and a development guide describing TDD workflow.
- NFR5: Implement secure coding practices including strict input validation and XSS protection for any user-input surfaces.
- NFR6: Ensure cross-browser support for modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).
- NFR7: Maintain code quality via linting, formatting, and documented local scripts; all changes must pass tests and linters before merge.
- NFR8: Ensure maintainability by keeping functions small, modules cohesive, and public APIs stable with semantic versioning inside the repo.
- NFR9: Provide accessibility fundamentals (semantic HTML, sufficient contrast) and honor prefers-reduced-motion; ensure 3D visuals maintain readability and announce state changes (e.g., wins) via ARIA live regions.
- NFR10: Provide developer ergonomics: fast local test runs, deterministic tests, and clear scripts to run, test, and build; expose PRNG seeding for reproducible test scenarios.
- NFR11: UI asset efficiency: Tailwind CSS for styling; prefer vector assets; additional 3D/animation assets budget ≤300KB gzip. If using Babylon.js, lazy-load it as a separate chunk ≤800KB gzip and keep the initial route bundle <2MB.
 - NFR12: Licensing & attribution compliance: Credits page must surface license names and links for third-party dependencies; repository includes LICENSE and NOTICE; an automated script generates a `credits.json` from package manifests to keep attributions accurate.

## User Interface Design Goals

### Overall UX Vision
- Professional, minimalist, and educational showcase that highlights engineering quality without visual clutter.
- Top-down classic board layout enhanced with subtle 3D styling (depth, shadows) and animated 3D X/O marks.
- Motion used sparingly to communicate state changes (mark placement, win highlight, board lock) with a reduced-motion fallback.
- Clear information hierarchy: current player, game state, controls (new game, undo/redo), mode indicators (board size, difficulty).
- Responsive across mobile, tablet, and desktop with touch and pointer support.

### Key Interaction Paradigms
- Single primary play view with lightweight overlays for settings and results.
- Input: click/tap to place mark; on-screen controls to close overlays.
- Controls: pre-game selector for board size (3x3, 6x6) and difficulty; in-game undo/redo; restart; switch mode between rounds.
- Feedback: animated mark placement (≤300ms), winning line highlight, and a brief lock animation on terminal state that disables input.
 - Feedback: animated mark placement (≤300ms), winning line highlight, and a brief lock animation on terminal state that disables input; 3D effects rendered via a WebGL canvas overlay when enabled.
- Accessibility: ARIA live announcements for turn changes and results, respects prefers-reduced-motion, and maintains sufficient contrast.

### Core Screens and Views
- Start/Settings Modal: choose board size and difficulty; brief explanations of AI levels.
- Game Board View: board grid, current player indicator, controls (undo/redo/restart), minimal status bar with mode indicators.
- Result/Replay Overlay: win/draw message, winning-line highlight, options to replay or change settings.
- Learn/Docs Panel (optional): link to documentation about architecture, TDD, and BMAD highlights.
 - Credits/About Page: contributors, third-party acknowledgments with versions/licenses, links to repo and legal files.

### Accessibility: WCAG AA
- Sufficient contrast; color choices pass AA contrast for text and UI components.
- Reduced-motion alternative for all animations; no critical information conveyed by motion alone.
- ARIA live region announcements for game start, turn changes, invalid moves, wins/draws, and board lock.

### Branding
- Neutral, modern styling aligned to a technical audience; no proprietary brand constraints identified.
- 3D aesthetic implemented with CSS transforms and lighting cues; avoid heavy textures to meet asset budget.
 - 3D aesthetic implemented with Babylon.js (WebGL) for marks and board lock; provide CSS transforms fallback when reduced-motion is enabled or WebGL is unavailable; avoid heavy textures to meet asset budget.

### Target Device and Platforms: Web Responsive
- Modern desktop and mobile browsers (Chrome, Firefox, Safari, Edge) with touch and pointer input support.

## Technical Assumptions

### Repository Structure: Monorepo (Nx)
- Use Nx with PNPM workspaces to enforce modular boundaries and caching.
- Apps/Libs:
  - `apps/ui` (Angular app)
  - `libs/engine` (pure TS game rules and k-in-row logic)
  - `libs/ai` (search, minimax/alpha-beta, transposition table)
  - `libs/shared` (types, utilities)
  - `apps/e2e` (Playwright tests)
- Rationale: Clear separation of concerns, fast local tasks via Nx cache, showcases modular architecture.

### Service Architecture
- Modular monolith centered on a client-side Angular SPA.
- No backend required for MVP; optional serverless endpoints post-MVP.
- Offload heavy AI computations to Web Workers to keep UI responsive.
- Rationale: Minimizes infra while demonstrating clean module APIs and strong testability.

### Testing Requirements
- Full testing pyramid with coverage ≥90%:
  - Unit: Jest for engine/ai/state services.
  - Component/Integration: @testing-library/angular for Angular components + service wiring.
  - E2E: Playwright (both board sizes, all AI levels, seeded runs for randomness ratios).
- Local gate: npm scripts ensure tests + lint/format pass before merge (run locally and documented); coverage report generated locally.

### Additional Technical Assumptions and Requests
- Framework: Angular (no React). Use Nx Angular with Vite bundler.
- Builder: Vite-based build/dev server (Nx Angular Vite or Angular's Vite builder); optimize with esbuild/rollup.
 - Styling: Tailwind CSS (Angular integration) with utility-first classes, design tokens, and a minimal custom theme.
 - 3D Rendering: Babylon.js for animated 3D marks and board lock; load lazily via dynamic import to keep initial bundle small; render in a separate WebGL canvas layered under UI; provide CSS-based 3D fallback.
 - Credits Data & Routing: Add a build-time script to emit `credits.json` (dependency name, version, license, homepage). Angular route `/credits` renders the Credits/About page by consuming this JSON and static content (contributors, repo links).
- Language: TypeScript strict mode across all libs/apps.
- State Management: NgRx store for game and settings; implement undo/redo via a history service integrated with store.
- AI Engine: Minimax with alpha-beta pruning + transposition table (Zobrist hashing), iterative deepening; perfect play for both 3x3(k=3) and 6x6(k=4).
- Web Workers: Generate workers for AI computations (`ng generate web-worker`); message-based API between UI and AI.
- PRNG: `seedrandom` for seeded difficulty behavior; seed surfaced via UI and URL param for reproducibility.
- Performance: Enforce hard-level decision latency targets; show spinner if exceeded and keep under 500ms p95.
 - Tooling: ESLint, Prettier; Tailwind + PostCSS config; ADRs under `docs/architecture/`.
- Hosting: Static deploy (Vercel/Netlify) with SPA fallback; environment config via Angular environments.
- Security: Sanitize user-visible strings; strict DOM APIs; avoid eval; recommend CSP in deployment guide.

## Epic List

- Epic 1: Foundation & Core Infrastructure — Scaffold the Angular Nx monorepo with Vite, Tailwind, local test/lint/format gates, ADRs, and a canary health-check to enable continuous, testable delivery (no hosted CI/CD).
- Epic 2: Core Engine & State — Implement k-in-row rules for 3x3(k=3) and 6x6(k=4), move validation, terminal detection, and undo/redo history with clear module interfaces and unit tests.
- Epic 3: AI Players & Performance — Deliver Easy/Medium/Hard AI with seeded randomness ratios and perfect-play Hard via minimax+alpha-beta+TT in Web Workers; validate latency targets.
- Epic 4: UI Integration & 3D Experience — Build responsive Angular UI with Tailwind, integrate engine/AI, add animated 3D marks and lock via Babylon.js with CSS fallback and reduced-motion support.
- Epic 5: E2E, Credits, Docs & Release — Add Playwright e2e coverage across modes/sizes, implement Credits page with generated credits.json, finalize docs, polish performance, and deploy.

## Epic 1: Foundation & Core Infrastructure

Goal

Establish a robust, modular Angular Nx workspace with Vite and Tailwind, enforce quality via local scripts and coverage gates, and ship a canary/health-check so the project delivers value from Day 1 while enabling TDD and rapid iteration; deployment is manual (documented), not via CI/CD.

Story 1.1 Scaffold Monorepo and Baseline Tooling

Acceptance Criteria
1: Nx workspace created with PNPM; apps/libs layout initialized: `apps/ui`, `libs/engine`, `libs/ai`, `libs/shared`, `apps/e2e`.
2: Angular app configured to use Vite builder; TypeScript strict mode enabled globally.
3: Tailwind CSS integrated with PostCSS; base theme tokens and utility classes available in the UI app.
4: ESLint + Prettier configured; formatter and linter scripts available to run locally.
5: README updated with setup, run, and test commands.

Story 1.2 Local Quality Automation

Acceptance Criteria
1: Package scripts exist for `lint`, `test`, `test:coverage`, `build`, and `e2e` to run locally (PNPM/Nx).
2: Coverage report generated locally; coverage threshold enforced in Jest config (initial 80%, target 90% by Epic 3).
3: Provide a single `pnpm validate` script that runs `lint`, `test`, and `build` locally.
4: Quality gate documented: contributors run `pnpm validate` locally before merge.

Story 1.3 Canary Health-Check and Static Deploy

Acceptance Criteria
1: A route `/health` in `apps/ui` displays app/version, build hash, and a simple green status.
2: Basic end-to-end smoke validates the health route renders locally.
3: Manual static deploy path documented (e.g., Vercel/Netlify CLI or drag-and-drop) with SPA fallback; environment config documented.
4: Successful manual preview available (local serve/preview and, if deployed, a platform preview URL).

Story 1.4 Testing Baseline and E2E Harness

Acceptance Criteria
1: Jest configured for unit tests in libs (`engine`, `ai`, `shared`) with an example passing test per lib.
2: @testing-library/angular configured with a sample component test in `apps/ui`.
3: Playwright installed in `apps/e2e` with a smoke test visiting `/health`.
4: Local scripts execute unit and e2e smoke tests; failures must be resolved before merging (documented in CONTRIBUTING).

Story 1.5 Documentation, ADRs, and Licensing

Acceptance Criteria
1: ADR directory created under `docs/architecture/` with an initial ADR for tech stack and project structure.
2: LICENSE and NOTICE files added to the repo; brief legal section in README.
3: Credits generator placeholder script planned and a task stub created (actual data generation in Epic 5).
4: Contributing guidelines drafted: branch strategy, commit convention, and PR checks.

## Epic 2: Core Engine & State

Goal

Implement a robust, well-tested game engine and state layer supporting both 3x3 (k=3) and 6x6 (k=4), with clear interfaces, legal move validation, terminal-state detection, and undo/redo history, enabling seamless integration with UI and AI.

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

Story 2.3 K-in-Row Logic for 6x6 (k=4)

Acceptance Criteria
1: Implement detection for contiguous 4-in-a-row across rows, columns, and both diagonals on 6x6.
2: Ensure algorithm scales without degrading performance unnecessarily; avoid unnecessary allocations.
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

Story 2.6 Undo/Redo History Service

Acceptance Criteria
1: Implement a history service in `libs/engine` or `libs/shared` that tracks past states and supports `undo()` and `redo()`.
2: Redo stack invalidates when a new move is applied after an undo.
3: No hard cap required for MVP; accept an optional max depth in constructor for tests.
4: Unit tests cover alternating undo/redo sequences, boundary conditions, and redo invalidation.

Story 2.7 Configuration and Mode Selection

Acceptance Criteria
1: `GameConfig` supports board size (3x3 or 6x6), k value (3 or 4), and initial player.
2: Engine exposes a factory to create an `Engine` with a given `GameConfig`; config is surfaced in `GameState` for UI/tests.
3: Unit tests verify both modes initialize correctly and propagate config through state transitions.

Story 2.8 Performance and Allocation Hygiene

Acceptance Criteria
1: Critical inner loops avoid per-iteration allocations; use typed arrays or flat arrays where beneficial.
2: Add micro-bench tests (or timing assertions) guarding regressions for win detection on 6x6.
3: Lint rules enforce immutability patterns and small function sizes in engine code.

Story 2.9 Documentation and Examples

Acceptance Criteria
1: Add README in `libs/engine` describing public APIs, state shape, and example usage.
2: Add illustrative unit tests as examples of engine usage for both board sizes.
3: ADR entry updated to capture engine design choices (k-in-row scanning strategy, immutability approach).

## Epic 3: AI Players & Performance

Goal

Deliver Easy/Medium/Hard AI players that meet deterministic behavior definitions and performance targets: Easy/Medium use seeded randomness ratios (50%/25%) blended with strategy, Hard plays the game-theoretic optimal move via minimax with alpha-beta pruning and a transposition table, executed in Web Workers to keep the UI responsive.

Story 3.1 AI Interfaces and Player Abstractions

Acceptance Criteria
1: Define `AIPlayer` interface in `libs/ai` with `getMove(state, config, options) => Promise<Move>`.
2: Define `Difficulty` enum (`easy`, `medium`, `hard`) and an orchestrator `getAIMoveByDifficulty(difficulty, state, config, prng, options)`.
3: Tie-breaker policy implemented and configurable in options: quickest win, then minimize opponent’s best outcome, then center/corners preference, then lowest index.
4: Public API barrel for `libs/ai` exports interfaces and orchestrator; TS docs added.

Story 3.2 Seeded PRNG and Deterministic Randomness

Acceptance Criteria
1: Integrate `seedrandom` to create a PRNG from a provided seed (string/number); do not use `Math.random` inside AI.
2: Easy: 50% probability selects uniformly from legal moves using PRNG; otherwise delegates to strategy engine; ratio controlled via constants.
3: Medium: 25% probability selects uniformly at random; otherwise delegates to strategy engine.
4: Unit tests run 200 selections per difficulty with fixed seeds and assert random-choice rate within ±5% tolerance of target ratio; runs are reproducible across executions with the same seed.

Story 3.3 Hard AI: Minimax + Alpha-Beta + Transposition Table

Acceptance Criteria
1: Implement perfect-play search that returns an optimal move for both 3x3 (k=3) and 6x6 (k=4).
2: Use alpha-beta pruning and iterative deepening; stop conditions ensure completion within targets; result is still optimal for tested positions.
3: Add a transposition table keyed via Zobrist hashing over board cells and player-to-move; store evaluated scores and best moves by depth/bounds.
4: Unit tests verify known perfect-play outcomes on canonical puzzles (forced win, forced draw) for both sizes; tie-breakers applied deterministically when multiple optimal moves exist.

Story 3.4 Web Worker Integration and Cancellation

Acceptance Criteria
1: Create an AI Web Worker (under `libs/ai` or `apps/ui` workers folder) that runs the search off the main thread; main thread sends `{state, config, difficulty, seed}` and receives `{move, meta}`.
2: Support cancellation/abort (e.g., via `AbortController` or message protocol). New requests cancel any in-flight computation.
3: If workers are unavailable, fall back to main-thread computation with a warning flag in the result.
4: Component/integration tests validate that UI remains interactive during AI computation and that cancelled computations do not apply stale moves.

Story 3.5 Performance Targets and Benchmark Harness

Acceptance Criteria
1: Add a benchmark script that evaluates representative mid-game positions for both board sizes; report p50 and p95 latencies for Hard.
2: Meet latency targets: <100ms p50 and <500ms p95 for Hard AI decisions on typical hardware assumptions; if a scenario exceeds targets, a spinner/progress indicator is shown and logged.
3: Document tuning knobs: move ordering heuristics, aspiration windows, TT size limits, and iterative deepening budgets.

Story 3.6 Difficulty Orchestration and Tie-Breakers

Acceptance Criteria
1: Implement difficulty wrapper that selects random vs strategic path based on ratio and seed, then applies tie-breakers to break equivalence among strategic moves.
2: Tie-breakers include a center/corners bias; for 6x6 define center and corners generically based on board size.
3: Unit tests verify tie-breaker ordering using crafted positions that yield multiple optimal moves.

Story 3.7 AI vs AI and Reproducibility

Acceptance Criteria
1: Provide an AI vs AI runner utility that plays full games deterministically given a seed and difficulty pair.
2: Unit/integration tests confirm identical outcomes across runs when seeds and configs match.
3: Expose optional move delay for visualization; ensure delay does not affect determinism.

Story 3.8 Transposition Table Reuse and Memory Boundaries

Acceptance Criteria
1: Reuse the transposition table across successive moves of the same game to accelerate search; reset on new game.
2: Enforce a configurable upper bound on TT size; implement LRU or depth-preferential eviction when exceeded.
3: Tests verify TT reuse improves measured nodes/second and respects memory limits.

Story 3.9 Documentation and ADRs

Acceptance Criteria
1: `libs/ai` README describes public APIs, difficulty semantics, seed handling, worker usage, and tuning parameters.
2: ADR documents search design and trade-offs (alpha-beta, TT, Zobrist, iterative deepening) and performance results.
3: Add example snippets showing seeded runs and difficulty orchestration.

## Epic 4: UI Integration & 3D Experience

Goal

Build a responsive Angular UI that integrates the engine and AI, renders animated 3D marks and a board lock using Babylon.js with a CSS fallback, preserves accessibility (ARIA live announcements, reduced-motion), and meets performance and asset budgets.

Story 4.1 UI Shell, Routing, and Layout

Acceptance Criteria
1: Routes exist for `/` (game), `/health`, and `/credits` (stub if not implemented yet); unknown routes fallback to `/`.
2: Responsive layout with Tailwind sets a fixed-aspect board area, header with mode indicators, and a footer containing a Credits link.
3: Mobile and desktop breakpoints verified; board maintains square cells and proper hit targets.

Story 4.2 Board and Cell Components

Acceptance Criteria
1: `BoardGrid` renders NxN cells based on current config; `Cell` handles click/tap to dispatch a move.
2: Current player indicator and minimal status bar display turn, board size, and difficulty.
3: Visual winning-line highlight appears on terminal win; draw shows a neutral message.
4: Component tests verify rendering, click interactions, and win highlight logic.

Story 4.3 Controls and Settings Modal

Acceptance Criteria
1: Settings modal allows choosing board size (3x3, 6x6), difficulty (Easy/Medium/Hard), and optional seed input.
2: In-game controls: Undo, Redo, Restart, and a button to open Settings.
3: Restart confirms and re-initializes state with the current settings.
4: Component tests verify settings persistence and control actions.

Story 4.4 Accessibility and Announcements

Acceptance Criteria
1: Add an ARIA live region announcing: game start, turn changes, invalid moves, wins/draws, and board lock.
2: Settings and result overlays manage focus correctly (trap focus, restore focus on close).
3: Colors meet WCAG AA contrast for text and essential UI elements; documented tokens in Tailwind config.
4: Tests verify live announcements and focus behavior with @testing-library/angular.

Story 4.5 State Wiring and Engine Integration (NgRx)

Acceptance Criteria
1: NgRx store slices for `game` and `settings`; actions for apply move, undo, redo, restart, and update settings.
2: Selectors expose board, current player, terminal state, and winning line for components.
3: Applying a move uses the engine library and updates immutable state; invalid moves surface a user-friendly message.
4: Integration tests validate store → components roundtrip and undo/redo behavior.

Story 4.6 AI Integration and Cancellation

Acceptance Criteria
1: An effect listens for AI turns and requests a move via the AI worker/orchestrator, passing difficulty and seed.
2: New user actions (undo/restart/settings change) cancel any in-flight AI calculation; no stale moves are applied.
3: UI indicates AI thinking (spinner or subtle status) when computation exceeds a brief threshold (e.g., 50ms).
4: Integration tests simulate AI turns and cancellation to ensure UI remains responsive and correct.

Story 4.7 3D Marks Rendering with Babylon.js

Acceptance Criteria
1: Lazy-load a Babylon.js-powered renderer for X/O marks placed in a WebGL canvas overlay beneath UI controls.
2: Mark placement plays an entry animation ≤300ms; multiple marks preserve 60fps during interactions on typical hardware.
3: If WebGL is unavailable or reduced-motion is enabled, fall back to CSS-based 3D transforms/flat icons.
4: Bundle analysis shows the Babylon chunk is lazily loaded and within the asset budget (≤800KB gzip) and initial UI bundle remains <2MB.

Story 4.8 3D Board Lock and Terminal Overlay

Acceptance Criteria
1: On terminal state, display a brief board lock animation indicating no further input is accepted.
2: The lock effect does not impair readability of the final board; inputs are disabled until a new game starts.
3: Reduced-motion mode replaces the animation with a static lock style.
4: Tests verify input is disabled after terminal state and re-enabled on restart.

Story 4.9 Reduced-Motion and Fallback Behavior

Acceptance Criteria
1: All motion (mark entry, win highlight, board lock) respects `prefers-reduced-motion`; provide non-animated equivalents.
2: A runtime WebGL capability check toggles between Babylon and CSS fallback automatically.
3: Tests verify reduced-motion behavior and fallback selection paths.

Story 4.10 Performance Hygiene and Asset Budgets

Acceptance Criteria
1: Avoid layout thrash: use CSS transforms for animations; batch DOM updates in change detection-friendly ways.
2: Add a script or doc steps to check bundle sizes and Babylon chunk gzip sizes; verify against NFR budgets.
3: Manual checks confirm smooth interactions on mid-range devices; note findings in a short performance doc.

Story 4.11 Documentation and UX Copy

Acceptance Criteria
1: Update README with UI controls, settings, and how to enable/disable 3D effects.
2: Add brief in-app help text/tooltips for difficulty definitions and board lock meaning.
3: Document fallback modes, accessibility behaviors, and performance budgets in `/docs`.

## Epic 5: E2E, Credits, Docs & Release

Goal

Deliver high-confidence end-to-end coverage across modes and sizes, implement the Credits/About page with generated attributions, finish documentation, and package a manual release with verified performance budgets and cross-browser checks.

Story 5.1 Playwright Harness and Test Matrix

Acceptance Criteria
1: Playwright config supports headless and headed runs, traces on failure, and per-test timeouts suitable for AI.
2: Test matrix covers board sizes (3x3, 6x6) × difficulties (Easy, Medium, Hard) for H vs AI and AI vs AI.
3: Tests accept seed via URL or query param to ensure determinism; helpers set `prefers-reduced-motion` for specific suites.
4: Smoke suite runs a minimal path; regression suite covers full flows; tags or projects separate them.

Story 5.2 Human vs AI Flows

Acceptance Criteria
1: Start game, place legal moves, observe current player changes, and status updates.
2: Undo/Redo cycles update board and status correctly.
3: Terminal detection highlights winning line or shows draw; Restart returns to a fresh game with same settings.
4: Run for both sizes and all difficulties (with seeds) and assert no console errors.

Story 5.3 AI vs AI Deterministic Replays

Acceptance Criteria
1: Launch AI vs AI with fixed seeds; capture final outcome (winner/draw) and total plies.
2: Repeat run yields identical outcome and plies for the same seed/config.
3: Optional artifact: store a short JSON trace for a single canonical scenario to compare locally.

Story 5.4 Reduced-Motion and WebGL Fallback Tests

Acceptance Criteria
1: A suite forces `prefers-reduced-motion` and asserts CSS fallback is used (no WebGL context created).
2: A suite simulates WebGL unavailable and asserts CSS fallback renders marks and lock legibly.
3: Performance-sensitive animations are skipped or shortened under reduced-motion; assertions verify.

Story 5.5 Credits Data Generator

Acceptance Criteria
1: Add a Node script `tools/generate-credits.ts` that reads workspace package manifests and lockfile to emit `credits.json` with fields: name, version, license, homepage/repository.
2: Validate presence of license strings; if missing, mark as `UNKNOWN` and list for manual follow-up.
3: Place `credits.json` in a location consumable by the UI (e.g., `apps/ui/src/assets/credits.json`).
4: Document how to run the generator; add it to a local script (e.g., `pnpm credits:gen`).

Story 5.6 Credits/About Page Implementation

Acceptance Criteria
1: The `/credits` route renders contributors, project links (repo, LICENSE, NOTICE), and a table/list from `credits.json`.
2: Each dependency shows name, version, license, and links out; accessibility: table is keyboard-navigable and readable.
3: Component tests verify rendering of sample `credits.json` and external links presence.

Story 5.7 Documentation Completion

Acceptance Criteria
1: README finalized: quick start, scripts, architecture overview, and manual deploy steps.
2: Developer Guide: TDD approach, testing pyramid, seeded runs, and debugging workers.
3: Architecture docs: engine and AI design, NgRx wiring, 3D rendering approach; ADRs updated to final state.
4: Accessibility statement and Performance notes included in `/docs`.

Story 5.8 Release Packaging and Manual Deploy

Acceptance Criteria
1: Produce a production build artifact; verify `/health`, game, and `/credits` paths with a local static server.
2: Manual deploy steps documented for Vercel CLI or Netlify CLI with SPA fallback; environment variables documented.
3: A short release checklist enumerates validate → build → smoke → deploy → verify steps; stored in `/docs/release-checklist.md`.

Story 5.9 Cross-Browser and Device Verification

Acceptance Criteria
1: Manually verify on Chrome, Firefox, Safari, and Edge latest stable; capture any browser quirks and mitigations.
2: Verify mobile viewport interactions (tap targets, scroll prevention) on at least one mobile browser.
3: Document findings and any workarounds; file backlog items if non-blocking issues remain.

Story 5.10 Bundle/Asset Budget Compliance

Acceptance Criteria
1: Run bundle analysis and report initial route bundle size (<2MB) and Babylon chunk gzip size (≤800KB).
2: Confirm total additional 3D/animation assets ≤300KB gzip.
3: If budgets are exceeded, identify optimizations and track as tasks; document current numbers in `/docs/performance.md`.
