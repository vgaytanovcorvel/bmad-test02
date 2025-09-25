# Agentic AI Tic-Tac-Toe Showcase

A sophisticated tic-tac-toe implementation demonstrating Angular 17+, Nx monorepo architecture, Tailwind CSS, and intelligent AI game engine capabilities.

## 🏗️ Architecture

This project is built using a modern monorepo structure with Nx:

```
tic-tac-toe-showcase/
├── apps/
│   ├── ui/                    # Angular 17+ application with Vite
│   └── ui-e2e/               # Playwright E2E tests
├── libs/
│   ├── engine/               # Game engine and AI logic
│   └── shared/               # Shared types and utilities
└── docs/                     # Project documentation
```

## 🛠️ Technology Stack

- **Framework**: Angular 17+ with standalone components and signals
- **Build System**: Nx monorepo with Vite builder  
- **Package Manager**: PNPM for efficient dependency management
- **UI Framework**: Tailwind CSS with custom game theme
- **State Management**: Angular Signals (reactive, built-in)
- **Testing**: Jest (unit), Playwright (E2E), @testing-library/angular
- **Code Quality**: ESLint + Prettier with Angular-specific rules
- **TypeScript**: v5.x with strict mode enabled

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PNPM package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tic-tac-toe-showcase

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Start development server (http://localhost:4200)
pnpm serve
# or
pnpm nx serve ui

# Build for production
pnpm build
# or  
pnpm nx build ui

# Run unit tests
pnpm test
# or
pnpm nx test ui

# Run E2E tests
pnpm test:e2e
# or
pnpm nx e2e ui-e2e

# Run linting
pnpm lint
# or
pnpm nx lint ui

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# View dependency graph
pnpm graph
# or
pnpm nx graph
```

### Development Server

The development server runs with:
- **Hot Module Replacement (HMR)** for fast development
- **Vite builder** for optimal performance
- **Angular DevTools** support
- **Tailwind CSS** with JIT compilation

## 🎮 Game Features

- **Interactive Tic-Tac-Toe Board**: Clean, responsive game interface
- **AI Computer Player**: Intelligent opponent with configurable difficulty
- **Real-time Game State**: Reactive updates using Angular Signals
- **Win Detection**: Automatic game end and winner announcement  
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

## 🧪 Testing

### Unit Testing
- **Framework**: Jest with Angular testing utilities
- **Location**: Tests colocated with source files (`*.spec.ts`)
- **Coverage**: Target 85% code coverage
- **Pattern**: Arrange-Act-Assert methodology

### Integration Testing
- **Framework**: @testing-library/angular for user-centric tests
- **Focus**: Component interactions and service integration
- **Mocking**: Comprehensive service and dependency mocking

### E2E Testing
- **Framework**: Playwright for reliable cross-browser testing
- **Location**: `apps/ui-e2e/`
- **Coverage**: Critical user journeys and game functionality

## 📁 Project Structure

### Applications
- `apps/ui/` - Main Angular application
  - `src/app/components/` - Standalone Angular components  
  - `src/app/pages/` - Route components
  - `src/app/services/` - Angular services
  - `src/styles/` - Global styles and Tailwind configuration

### Libraries
- `libs/engine/` - Game engine, AI logic, and move validation
- `libs/shared/` - Shared types, interfaces, and utilities

### Key Files
- `nx.json` - Nx workspace configuration
- `tsconfig.base.json` - TypeScript configuration with strict mode
- `apps/ui/tailwind.config.js` - Tailwind CSS customization
- `.eslintrc.json` - ESLint rules and Angular-specific linting

## 🎨 Styling

### Tailwind CSS Integration
- **Configuration**: Custom theme with game-specific colors
- **Components**: Pre-built component classes for game elements
- **Utilities**: Extended spacing, animations, and responsive helpers
- **Performance**: JIT compilation for optimal bundle size

### Custom Theme
```scss
// Game-specific color palette
--game-board: #1f2937
--game-cell: #374151  
--game-x-color: #ef4444
--game-o-color: #10b981
--game-winning: #fbbf24
```

## 🔧 Development Guidelines

### Code Standards
- **TypeScript Strict Mode**: All code uses strict TypeScript
- **Standalone Components**: Angular 17+ pattern throughout  
- **OnPush Change Detection**: Optimized performance
- **Signal-Based State**: Reactive state management
- **Dependency Injection**: `inject()` function over constructors

### File Naming Conventions
- Components: `game-board.component.ts`
- Services: `game.service.ts`  
- Types: `game.types.ts`
- Tests: `*.spec.ts`
- E2E Tests: `*.e2e-spec.ts`

## 🚀 Build and Deployment

### Production Build
```bash
pnpm build
```

Output: `dist/apps/ui/`
- Optimized bundle with tree-shaking
- Asset optimization and compression
- Source maps for debugging
- Bundle analysis available

### Build Configuration
- **Target**: ES2020 for modern browser support
- **Bundle Budget**: 500KB warning, 1MB error threshold  
- **Optimization**: Full optimization in production mode
- **SSR Ready**: Server-side rendering configuration included

## 🔍 Troubleshooting

### Common Issues

**Development server won't start:**
```bash
# Clear Nx cache and reinstall
pnpm nx reset
rm -rf node_modules
pnpm install
```

**Tailwind styles not applying:**
- Verify `tailwind.config.js` content paths
- Check PostCSS configuration
- Ensure styles are imported correctly

**Build errors:**
- Check TypeScript strict mode compliance
- Verify all imports and exports
- Run linting to catch issues early

**Test failures:**
- Update test snapshots if needed
- Check mock configurations
- Verify test environment setup

### Performance Tips
- Use `nx affected` commands for large workspaces
- Enable Nx Cloud for distributed caching
- Monitor bundle size with build budgets
- Use lazy loading for route components

## 📚 Documentation

- [Angular Architecture Guide](./docs/ui-architecture/)
- [Component Standards](./docs/ui-architecture/component-architecture-standards.md)  
- [Testing Guidelines](./docs/ui-architecture/testing-requirements.md)
- [Deployment Guide](./docs/deployment/)

## 🤝 Contributing

1. Follow the established code standards and patterns
2. Write comprehensive tests for new features  
3. Update documentation as needed
4. Use conventional commit messages
5. Ensure all quality gates pass before merging

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with Angular 17+, Nx, and Tailwind CSS** 🚀