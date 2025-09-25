# Epic 5: Integration & E2E Testing

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
