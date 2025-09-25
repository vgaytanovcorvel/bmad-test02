# Project Structure

```
tic-tac-toe-showcase/
├── .github/                          # GitHub workflows and configs
├── .nx/                             # Nx cache and metadata
├── apps/
│   ├── ui/                          # Main Angular application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/      # Standalone Angular components
│   │   │   │   │   ├── game-board/
│   │   │   │   │   │   ├── game-board.component.ts
│   │   │   │   │   │   ├── game-board.component.html
│   │   │   │   │   │   ├── game-board.component.scss
│   │   │   │   │   │   └── game-board.component.spec.ts
│   │   │   │   │   ├── game-controls/
│   │   │   │   │   ├── game-status/
│   │   │   │   │   └── health-check/
│   │   │   │   ├── pages/           # Route components
│   │   │   │   │   ├── game/
│   │   │   │   │   ├── health/
│   │   │   │   │   └── credits/
│   │   │   │   ├── services/        # Angular services
│   │   │   │   │   ├── game.service.ts
│   │   │   │   │   └── game.service.spec.ts
│   │   │   │   ├── app.routes.ts    # Route configuration
│   │   │   │   ├── app.config.ts    # App configuration
│   │   │   │   └── app.component.ts # Root component
│   │   │   ├── assets/              # Static assets
│   │   │   ├── styles/              # Global styles
│   │   │   │   ├── globals.scss
│   │   │   │   └── tailwind.scss
│   │   │   ├── environments/        # Environment configs
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   └── project.json
│   └── ui-e2e/                      # Playwright E2E tests
│       ├── src/
│       │   ├── support/
│       │   └── game.spec.ts
│       └── playwright.config.ts
├── libs/
│   ├── engine/                      # Game engine library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── engine.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── computer-player.ts
│   │   │   └── index.ts
│   │   └── project.json
│   └── shared/                      # Shared utilities and types
│       ├── src/
│       │   ├── lib/
│       │   │   ├── types.ts
│       │   │   └── utils.ts
│       │   └── index.ts
│       └── project.json
├── tools/                           # Build and development tools
├── package.json                     # Root package.json with workspaces
├── nx.json                          # Nx configuration
├── tsconfig.base.json              # Base TypeScript config
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
└── README.md
```
