# Future Extensibility Notes (Informational)
- Board Sizes: Architecture will allow injecting supported board configurations via a constant `SUPPORTED_CONFIGS` (e.g., later adding 5x5 k=4, 7x7 k=4) without refactoring core engine interfaces.
- Performance Path: If larger boards added, introduce optional memoized minimax with transposition table & depth-limited iterative deepening; add eviction (LRU) or size cap.
- Accessibility: Reintroduce ARIA live region, focus management, and reduced-motion compliance as a dedicated Epic once core demo validated.
- Browser Support: Expand automated test matrix (Playwright projects per browser) before public/enterprise showcase.
- Bundle Size: Track with a simple build-time report when/if richer visuals or external libraries are introduced.
