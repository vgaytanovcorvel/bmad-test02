# Epic 4: Credits & Release

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
