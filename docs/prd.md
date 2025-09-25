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
| 2025-09-24 | 1.1     | Simplified scope: single perfect computer opponent (exhaustive search), removed difficulty tiers, undo/redo history, AI vs AI mode, multi-layer diagnostics & e2e harness; diagnostics limited to unit tests | John (PM Agent) |
| 2025-09-24 | 1.2     | Reintroduced integration & e2e test layers (smoke + basic gameplay flows) while keeping simplified architecture | John (PM Agent) |
| 2025-09-25 | 1.3     | Further scope reduction: board sizes limited to 3x3 & 4x4 (k=3 only); removed 7x7 (k=4); dropped memoization, accessibility (ARIA/reduced-motion) requirements, cross-browser matrix (Chrome & Edge only now), and bundle size budget. Updated tests & epics accordingly; added future extensibility notes. | PO |

## Requirements

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

## User Interface Design Goals (Simplified)

### Overall UX Vision
- Minimal, clean board-first layout.
- Optional subtle depth/animation (≤300ms) purely cosmetic; game remains fully usable without animations or WebGL.
- Clear information hierarchy: current player, board, basic controls (New Game, Board Size, Mode toggle).
- Responsive across mobile, tablet, desktop with touch & pointer input.

### Key Interaction Paradigms
- Single primary view; inline controls (no modal required—optional simple panel if needed later).
- Input: click/tap empty cell to place mark; invalid cell clicks ignored (optionally announce).
- Controls: Board size (3x3 / 7x7), Mode (Human vs Human / Human vs Computer), New Game.
- Feedback: optional mark placement animation, highlight winning line, simple disabled state after terminal result.
- Accessibility: ARIA live region announces turns and results; respects `prefers-reduced-motion`.

### Core Screens / Views
- Game Board View (primary)
- Credits/About Page

### (Removed) Accessibility
Removed from v1.3 scope. Minimal semantic HTML will be used but no formal ARIA live region, reduced-motion handling, or WCAG conformance testing. A future story will reintroduce accessibility for broader adoption.

### Branding & Visuals
- Neutral, modern, lightweight styling; technical audience.
- 3D / Babylon.js entirely optional; CSS-only fallback default.

### Target Platforms
- Desktop Chrome & Edge (latest) primary. Others deferred.

### Technical Assumptions (v1.3)

### Repository Structure: Monorepo (Nx)
- `apps/ui` (Angular UI)
- `libs/engine` (rules + exhaustive perfect-move search)
- `libs/shared` (types/utilities)

Removed: separate AI library, undo/redo history service.

### Service Architecture
- Pure client-side Angular SPA.
- No Web Workers (not needed for 3x3 / 4x4 complexity).
- No backend/services.

### Testing Requirements (v1.3)
- Unit Tests (Jest): engine logic (k-in-row for 3x3 & 4x4, terminal detection, exhaustive optimal move scenarios), utility functions, simple UI component logic.
- Integration Tests (Jest + @testing-library/angular): board/component ↔ engine interaction (placing moves, terminal detection, computer move application).
- End-to-End Tests (Playwright):
    - Smoke: `/health` route renders status.
    - Gameplay: Human vs Computer 3x3 quick win scenario; Human vs Computer 4x4 mid/late-game draw scenario (scripted moves); verify winning line highlight & disabled input post terminal.
- Determinism: Computer opponent deterministic via exhaustive search.
- Scripts: `test` (unit+integration), `test:unit`, `test:integration`, `e2e`, `coverage`.
- Local gate: pass unit + integration + e2e before release; coverage threshold enforced on unit+integration only.

### Additional Technical Assumptions
- Angular (Nx + Vite) + Tailwind + strict TypeScript.
- State via lightweight component/service state.
- Perfect move: recursive exhaustive search WITHOUT memoization (boards small enough). Future extension may reintroduce cache with eviction strategy.
- No randomness, no difficulty tiers, no workers.
- 3D / Babylon.js omitted in v1.3 (can be added later with lazy-load ADR).
- Tooling: ESLint, Prettier; short architecture note (ADR optional).
- Static hosting (Vercel/Netlify) manual deploy.
- Basic security hygiene (no dynamic HTML injection).

## Epic List (v1.3)

- Epic 1: Foundation & Core Infrastructure — Scaffold Nx Angular workspace, Tailwind, lint/test scripts, health-check.
- Epic 2: Core Engine & Perfect Computer Opponent — Board logic, k-in-row detection (3x3 & 4x4), exhaustive optimal move (no memoization).
- Epic 3: UI Integration — Responsive UI, minimal controls, optional light visual enhancement.
- Epic 4: Credits & Release — Credits page, minimal docs, build & manual deploy.
- Epic 5: Integration & E2E Testing — Confidence across core scenarios (health, gameplay) after scope reduction.

## Epic 1: Foundation & Core Infrastructure

Goal

Establish a robust, modular Angular Nx workspace with Vite and Tailwind, enforce quality via local scripts and coverage gates, and ship a canary/health-check so the project delivers value from Day 1 while enabling TDD and rapid iteration; deployment is manual (documented), not via CI/CD.

Story 1.1 Scaffold Monorepo and Baseline Tooling

Acceptance Criteria
1: Nx workspace created with PNPM; layout initialized: `apps/ui`, `libs/engine`, `libs/shared`, `apps/ui-e2e` (Playwright project).
2: Angular app configured to use Vite builder; TypeScript strict mode enabled globally.
3: Tailwind CSS integrated with PostCSS; base theme utilities available in the UI app.
4: ESLint + Prettier configured; formatter and linter scripts available to run locally.
5: README updated with setup, run, and test commands.

Story 1.2 Local Quality Automation

Acceptance Criteria
1: Package scripts exist for `lint`, `test`, `test:unit`, `test:integration`, `e2e`, `coverage`, and `build` (PNPM/Nx).
2: Coverage (unit+integration) threshold ≥85% enforced in Jest config.
3: Single `pnpm validate` script runs lint → unit+integration tests → build.
4: `pnpm e2e` documented as required before release (manual gate).
5: Quality gate documented: contributors run `pnpm validate` + `pnpm e2e` locally before merge.

Story 1.3 Canary Health-Check and Static Deploy

Acceptance Criteria
1: A route `/health` in `apps/ui` displays app/version, build hash, and a simple green status.
2: Basic end-to-end smoke validates the health route renders locally.
3: Manual static deploy path documented (e.g., Vercel/Netlify CLI or drag-and-drop) with SPA fallback; environment config documented.
4: Successful manual preview available (local serve/preview and, if deployed, a platform preview URL).

Story 1.4 Testing Baseline (Unit, Integration, E2E Harness)

Acceptance Criteria
1: Jest configured for unit & integration tests (separate folder conventions or naming patterns) in `libs/engine`, `libs/shared`, and `apps/ui`.
2: @testing-library/angular sample integration test exercising move placement & computer response.
3: Playwright configured in `apps/ui-e2e` with basic `/health` smoke test.
4: Scripts differentiate unit vs integration vs e2e; CONTRIBUTING notes execution order.

Story 1.5 Documentation, ADRs, and Licensing

Acceptance Criteria
1: ADR directory created under `docs/architecture/` with an initial ADR for tech stack and project structure.
2: LICENSE and NOTICE files added to the repo; brief legal section in README.
3: Contributing guidelines include testing layers (unit/integration/e2e) expectations.
4: Credits page placeholder or note captured (implemented in Epic 4).

## Epic 2: Core Engine & Perfect Computer Opponent

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
1: `GameConfig` supports board size (3x3 or 7x7), k value (3 or 4), and initial player.
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

## Epic 3: UI Integration

Goal

Integrate engine + perfect computer opponent into responsive UI with minimal controls and accessibility.

Story 3.1 UI Shell & Routing
Acceptance Criteria
1: Routes: `/` (game), `/health`, `/credits`.
2: Board centered, controls inline (size, mode, new game).
3: Layout responsive (mobile & desktop) maintaining square cells.

Story 3.2 Board & Interaction
Acceptance Criteria
1: Grid renders correct size; clicking empty cell applies move.
2: Current player indicator updates.
3: Terminal win highlights winning line; draw shows message; disables further moves.

Story 3.3 Mode & Size Controls
Acceptance Criteria
1: Toggle Human vs Human / Human vs Computer.
2: Change board size triggers new game.
3: New Game resets state.

Story 3.4 (Removed) Accessibility
Out of scope in v1.3. Minimal semantic markup only.

Story 3.5 Optional Visual Enhancements
Acceptance Criteria
1: (Optional) Subtle CSS-only transition ≤200ms; can be disabled by removing class (no reduced-motion logic required).
2: No external 3D library in v1.3.

Story 3.6 Minimal Tests
Acceptance Criteria
1: Component test covers rendering & simple X win scenario.
2: Engine test ensures computer chooses optimal forced win when available.

Story 3.7 Docs Update
Acceptance Criteria
1: README updated with usage & controls.
2: Short note on optional 3D / reduced motion.

## Epic 4: Credits & Release

Goal

Provide Credits page, minimal docs, and manual release workflow.

### (Removed) Prior detailed UI/AI stories (settings modal, multiple difficulty levels, advanced animations) no longer applicable in simplified scope.

Story 4.1 Credits Page
Acceptance Criteria
1: `/credits` lists contributors & dependency name/version/license.
2: Links to LICENSE & NOTICE files.
3: Accessible table or list semantics.

Story 4.2 Documentation Completion
Acceptance Criteria
1: README: setup, run, test, build, deploy instructions.
2: Short architecture note (engine + exhaustive search rationale).
3: Accessibility & reduced motion note.

Story 4.3 Release Packaging
Acceptance Criteria
1: Production build served locally (verify `/`, `/health`, `/credits`).
2: Manual deploy steps (e.g., Vercel/Netlify) documented.

Story 4.4 Cross-Browser Smoke
Acceptance Criteria
1: Manual verification on Chrome, Firefox, Edge, Safari + one mobile viewport.
2: Note any visual issues.

Story 4.5 Bundle Size Note
Acceptance Criteria
1: Record approximate initial bundle size (goal <500KB gzip, or <1MB if Babylon.js used).
2: Identify large deps for possible future optimization.

### (Removed) Prior extended release/test stories (Playwright matrix, AI vs AI replays, advanced performance & asset budgets) out of scope.

## Epic 5: Integration & E2E Testing

Goal

Provide confidence that UI, engine, and computer opponent work together across core scenarios (health, basic gameplay, accessibility) without reintroducing prior complex AI features.

Story 5.1 Integration Test Suite
Acceptance Criteria
1: Integration tests cover: move application sequence (X human then computer optimal reply), win detection highlight, draw scenario creation (3x3 & 4x4).
2: No accessibility assertions required.

Story 5.2 Playwright Smoke & Gameplay
Acceptance Criteria
1: `/health` smoke test passes.
2: 3x3 Human vs Computer scenario producing a forced win for X validated (final board & result text).
3: 4x4 scenario reaching draw validated (board full or scripted near-full draw path) with draw message & no active cells.

Story 5.3 (Removed) Accessibility & Reduced Motion E2E
Out of scope v1.3.

Story 5.4 Deterministic Computer Move Assertions
Acceptance Criteria
1: Predefined partial board states produce expected computed move (cell index) for 3x3 & 4x4.
2: Failures output diff of expected vs actual move for debugging.

Story 5.5 Documentation & Scripts
Acceptance Criteria
1: README updated with how to run integration vs e2e tests separately.
2: CONTRIBUTING clarifies when e2e suite must be executed (pre-release / pre-merge for gameplay changes).

## Future Extensibility Notes (Informational)
- Board Sizes: Architecture will allow injecting supported board configurations via a constant `SUPPORTED_CONFIGS` (e.g., later adding 5x5 k=4, 7x7 k=4) without refactoring core engine interfaces.
- Performance Path: If larger boards added, introduce optional memoized minimax with transposition table & depth-limited iterative deepening; add eviction (LRU) or size cap.
- Accessibility: Reintroduce ARIA live region, focus management, and reduced-motion compliance as a dedicated Epic once core demo validated.
- Browser Support: Expand automated test matrix (Playwright projects per browser) before public/enterprise showcase.
- Bundle Size: Track with a simple build-time report when/if richer visuals or external libraries are introduced.
