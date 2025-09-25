# User Interface Design Goals (Simplified)

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
