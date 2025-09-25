# Epic 3: UI Integration

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
