# Epic 1: Foundation & Core Infrastructure

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
