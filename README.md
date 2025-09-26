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

### Interactive Tic-Tac-Toe Gameplay

**Game Board & Interaction:**
- **Clean Responsive Interface**: Centered game board that adapts to screen sizes while maintaining square cells
- **Real-time Updates**: Game state changes instantly using Angular Signals for smooth, reactive gameplay
- **Click to Play**: Simply click any empty cell to place your X or O marker
- **Visual Feedback**: Cells highlight on hover to show available moves, current player indicator displays whose turn it is

**AI Computer Player:**
- **Intelligent Opponent**: Smart AI that makes strategic, optimal moves for challenging gameplay
- **Two Game Modes**: Switch between "Human vs Human" (two players) and "Human vs Computer" (play against AI)
- **Strategic Decision Making**: Computer player analyzes board position and makes intelligent moves to win or block

**Game State Management:**
- **Win Detection**: Automatic detection of winning combinations with visual highlighting of winning line
- **Winner Announcement**: Clear display of game results when someone wins or game ends in draw
- **Draw Scenarios**: Intelligent detection when board is full with no winner
- **Game End Behavior**: Board automatically disables further moves after win/draw is detected

**Responsive Design Features:**
- **Multi-Device Support**: Fully functional on desktop computers, tablets, and mobile phones
- **Adaptive Layout**: Board and controls automatically adjust to screen size while maintaining usability
- **Touch-Friendly**: Mobile-optimized touch targets for easy gameplay on phones and tablets
- **Consistent Experience**: Same great gameplay across all device types

**Accessibility Implementation:**
- **Keyboard Navigation**: Full keyboard support - use Tab/Shift+Tab to navigate, Space/Enter to select cells
- **Screen Reader Support**: Semantic markup and ARIA attributes communicate game state to assistive technologies  
- **Game State Communication**: Current player, cell contents, and game results clearly announced to screen readers
- **High Contrast**: Visual indicators work well with high contrast and reduced motion preferences

### User Controls

**Board Interaction:**
- **Mouse/Touch**: Click or tap any empty cell to place your move (X or O)
- **Keyboard Navigation**: 
  - Tab/Shift+Tab to move between cells and controls
  - Space or Enter to select highlighted cell
  - Arrow keys for grid navigation (if supported by browser)

**Game Mode Controls:**
- **Mode Toggle**: Switch between "Human vs Human" and "Human vs Computer" modes
- **Mode Persistence**: Your selected mode stays active across multiple games
- **Turn Alternation**: In Human vs Human mode, turns automatically alternate between X and O players
- **Computer Player**: In Human vs Computer mode, AI automatically makes moves after your turn

**Board Size & Reset Controls:**
- **Board Size Selection**: Choose different board dimensions (3x3 standard, with potential for larger boards)
- **New Game Button**: Reset the board and start fresh while keeping your preferred mode and size
- **Auto-Reset**: Changing board size automatically starts a new game
- **State Preservation**: Mode and size settings remember your preferences between games

**Game Status Display:**
- **Current Player Indicator**: Always shows whose turn it is (X or O player)
- **Move History**: Visual indication of move sequence and game progression
- **Win/Draw Announcement**: Clear messaging when game ends with winner or draw result
- **Game State**: Real-time status updates throughout gameplay

### Gameplay Instructions

**Getting Started:**
1. **Choose Your Mode**: Select "Human vs Human" for two-player local play, or "Human vs Computer" to play against AI
2. **Select Board Size**: Pick your preferred board dimensions (default is classic 3x3)
3. **Start Playing**: Click any cell to place the first move (typically X goes first)

**Human vs Human Mode:**
- Player 1 places X markers, Player 2 places O markers
- Players alternate turns by clicking empty cells
- Game continues until someone gets three in a row or board fills (draw)
- Use "New Game" to reset and play again with same mode

**Human vs Computer Mode:**
- You play as X, computer plays as O (or vice versa based on settings)
- Make your move by clicking an empty cell
- Computer automatically makes its move after yours
- AI will try to win and block your winning moves
- Challenge yourself against the intelligent computer opponent

**Winning the Game:**
- **Objective**: Get three of your markers (X or O) in a row
- **Winning Lines**: Horizontal, vertical, or diagonal lines count as wins
- **Win Highlighting**: Winning line gets highlighted when game ends
- **Game End**: No more moves possible after someone wins

**Draw Games:**
- **Full Board**: If all 9 cells fill with no winner, game ends in draw
- **Draw Detection**: Automatic detection when no more winning moves possible
- **Draw Display**: Clear messaging that game ended in tie
- **Reset Option**: Start new game to play again

### Optional Visual Enhancements

**CSS Animation Features (Optional):**
- **Subtle Transitions**: Cell hover effects and move placement animations (≤200ms duration)
- **Performance Optimized**: Pure CSS animations for smooth performance without JavaScript overhead
- **Customizable**: Visual enhancements can be easily disabled by removing CSS classes
- **Lightweight**: No external animation libraries - uses standard CSS properties only

**Animation Customization:**
```css
/* To disable hover animations, comment out or remove: */
.game-cell:hover {
  /* transform: scale(1.02); */
  /* transition: transform 0.15s ease-in-out; */
}

/* To enhance move placement effects: */
.game-cell.new-move {
  /* animation: placeMove 0.2s ease-out; */
}
```

**3D Features (Future Scope):**
- **Current Version**: No 3D libraries included in v1.3 for optimal load times
- **Future Consideration**: 3D board effects and enhanced animations planned for future releases
- **Simplicity Focus**: Current implementation prioritizes compatibility and performance over complex effects
- **CSS-Only Approach**: All visual enhancements use standard web technologies for broad browser support

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

#### Running E2E Tests

**Pre-release Requirement**: All E2E tests must pass before any release.

```bash
# Run E2E tests (mandatory before release)
pnpm e2e

# Run E2E tests in headed mode for debugging
pnpm nx e2e ui-e2e --headed

# Run specific E2E test files
pnpm nx e2e ui-e2e --grep "game flow"

# Generate E2E test report
pnpm nx e2e ui-e2e --reporter=html
```

#### E2E Test Requirements

1. **Game Board Rendering**: Verify 3x3 grid displays correctly
2. **Player Moves**: Test X and O placement functionality
3. **Win Detection**: Validate winning combinations detection
4. **Game Reset**: Ensure game can be restarted properly
5. **AI Player**: Test computer player makes valid moves
6. **Responsive Design**: Verify mobile and desktop layouts

#### E2E Test Troubleshooting

**Tests fail to start:**
- Ensure development server is running: `pnpm serve`
- Check if port 4200 is available
- Verify Playwright browsers are installed: `npx playwright install`

**Tests are flaky:**
- Add appropriate wait conditions
- Use data-testid selectors for reliability
- Increase timeout values if needed
- Check for race conditions in async operations

**Performance issues:**
- Run tests in headless mode for faster execution
- Use `--workers` flag to control parallelization
- Enable test sharding for large test suites

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
# Build UI with production optimizations and build hash injection
npm run build:ui:prod

# Alternative: Build all projects
pnpm build
```

Output: `dist/apps/ui/browser/` (static assets ready for hosting)
- Optimized bundle with tree-shaking
- Asset optimization and compression
- Source maps for debugging
- Build hash injection for version tracking
- Bundle analysis available

### Build Configuration
- **Target**: ES2020 for modern browser support
- **Bundle Budget**: 500KB warning, 1MB error threshold  
- **Optimization**: Full optimization in production mode
- **SSR Ready**: Server-side rendering configuration included
- **Build Hash**: Automatic injection for deployment tracking

### Local Preview Testing
```bash
# Build and serve locally (recommended before deployment)
npm run preview

# Manual preview testing
npm run build:ui:prod
pnpm nx serve-static ui
# Navigate to http://localhost:4200
```

### Static Hosting Deployment

This application is configured for static hosting on Vercel, Netlify, or similar platforms with SPA (Single Page Application) routing support.

#### Vercel Deployment

**CLI Method (Recommended):**
```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Deploy from project root
vercel

# Production deployment
vercel --prod
```

**Configuration**: Uses `vercel.json` in project root
- **Build Command**: `npm run build:ui:static`
- **Output Directory**: `dist/apps/ui/browser`
- **SPA Routing**: Automatic fallback to `/index.html`

**Drag-and-Drop Method:**
1. Run `npm run build:ui:static`
2. Navigate to [vercel.com/new](https://vercel.com/new)
3. Drag the `dist/apps/ui/browser` folder to the deployment area
4. Vercel automatically detects and deploys the static assets

#### Netlify Deployment

**CLI Method (Recommended):**
```bash
# Install Netlify CLI (one-time)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project root
netlify deploy

# Production deployment
netlify deploy --prod
```

**Configuration**: Uses `netlify.toml` in project root
- **Build Command**: `npm run build:ui:static`
- **Publish Directory**: `dist/apps/ui/browser`
- **SPA Routing**: Redirect rules configured for Angular Router

**Drag-and-Drop Method:**
1. Run `npm run build:ui:static`
2. Navigate to [netlify.com/drop](https://netlify.com/drop)
3. Drag the `dist/apps/ui/browser` folder to the deployment area
4. Netlify automatically configures SPA routing

#### Environment Variable Configuration

**Production Environment Variables:**
- `BUILD_HASH`: Automatically generated during build (format: `YYYY-MM-DD-{random}`)
- `NODE_VERSION`: 18+ (specified in `netlify.toml`)
- `PNPM_VERSION`: 8+ (specified in `netlify.toml`)

**Custom Build Hash:**
```bash
# Set custom build hash before deployment
BUILD_HASH="v1.3.0-release-001" npm run build:ui:static
```

#### Deployment Verification Checklist

Before deploying to production, verify:

- [ ] **Local Preview Works**: `npm run preview` serves correctly
- [ ] **Health Endpoint**: `/health` displays app info and green status
- [ ] **SPA Routing**: Direct navigation to `/health` works (not 404)
- [ ] **Build Assets**: `dist/apps/ui/browser/` contains optimized files
- [ ] **Build Hash**: Unique hash appears in health check page
- [ ] **Environment**: Shows "Production" in health check
- [ ] **No Console Errors**: Browser dev tools show clean console

#### Deployment Troubleshooting

**Build Failures:**
```bash
# Clear cache and rebuild
pnpm nx reset
npm run build:ui:static
```

**SPA Routing Issues (404 on refresh):**
- Verify `vercel.json` or `netlify.toml` redirect rules
- Check hosting platform SPA configuration
- Ensure `index.html` is in root of publish directory

**Missing Build Hash:**
- Verify build injection script runs: `npm run build:inject`
- Check `tools/build-hash.js` exists and is executable
- Ensure environment restoration: `npm run build:restore`

**Environment Detection Issues:**
- Health page should show "Production" when deployed
- Dev environment shows "Development" locally
- Verify environment files are correctly configured

#### Performance and Monitoring

**Build Optimization:**
- Bundle size optimized with tree-shaking
- Asset compression enabled by hosting platforms
- CDN distribution automatic on Vercel/Netlify

**Health Check Monitoring:**
- Health endpoint: `https://your-domain.com/health`
- Monitor build hash to verify deployments
- Status indicator shows green for healthy application

**Security Headers:**
- Configured in `netlify.toml` for enhanced security
- Content Security Policy ready for implementation
- HTTPS enforced by hosting platforms

#### Custom Domain Configuration

**Vercel:**
```bash
# Add custom domain via CLI
vercel domains add your-domain.com

# Or configure via Vercel dashboard
```

**Netlify:**
```bash
# Add custom domain via CLI
netlify sites:create --name your-site-name
netlify domains:create your-domain.com
```

#### Continuous Deployment

Both platforms support automatic deployment from Git repositories:

1. **Connect Repository**: Link your Git repository to hosting platform
2. **Build Settings**: 
   - Build command: `npm run build:ui:prod`
   - Publish directory: `dist/apps/ui/browser`
3. **Environment Variables**: Set `NODE_VERSION=18` if needed
4. **Deploy Branches**: Configure which branches trigger deployments

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

## 🔒 Quality Assurance

### Quality Gate Requirements

Before any code merge or release, the following quality gates must pass:

#### 1. Code Quality Pipeline
```bash
# Run complete validation pipeline
pnpm validate
```
This executes:
- **Linting**: ESLint + Prettier validation across all projects
- **Testing**: Unit + Integration tests with 85% coverage threshold
- **Building**: Production build verification for all projects

#### 2. E2E Testing (Manual Gate)
```bash
# Mandatory before release
pnpm e2e
```

#### 3. Coverage Requirements
- **Threshold**: ≥85% code coverage (lines, functions, branches, statements)
- **Enforcement**: Coverage thresholds block builds below threshold
- **Reporting**: HTML, text, and LCOV reports generated

#### 4. Pre-Merge Checklist
- [ ] `pnpm validate` passes without errors
- [ ] `pnpm e2e` passes all tests
- [ ] Coverage maintains ≥85% threshold
- [ ] No ESLint errors or warnings
- [ ] All TypeScript compilation succeeds
- [ ] Code follows established patterns and standards

### Quality Automation Scripts

```bash
# Individual quality checks
pnpm lint              # ESLint across all projects
pnpm test              # Unit + Integration tests
pnpm test:unit         # Unit tests only
pnpm test:integration  # Integration tests only
pnpm coverage          # Generate coverage reports
pnpm build             # Build all projects
pnpm e2e               # E2E tests (manual gate)

# Combined pipeline
pnpm validate          # lint → test → build sequence
```

### Failure Resolution

**Lint Failures:**
- Fix ESLint errors: `pnpm lint:fix`
- Address remaining warnings manually
- Follow Angular and TypeScript best practices

**Test Failures:**
- Review test output for specific failures
- Update tests if behavior changes are intentional
- Maintain coverage threshold ≥85%

**Build Failures:**
- Check TypeScript compilation errors
- Verify all imports and dependencies
- Ensure proper configuration files

**E2E Failures:**
- Check development server is running
- Review Playwright test reports
- Update tests for UI changes
- Verify cross-browser compatibility

## 🤝 Contributing

1. Follow the established code standards and patterns
2. Write comprehensive tests for new features  
3. Update documentation as needed
4. Use conventional commit messages
5. **Ensure all quality gates pass before merging** (see Quality Assurance section above)

## 📄 Legal and License Information

### License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for complete details.

### Third-Party Attributions

This project uses several open-source libraries and tools. Complete attribution information can be found in the [NOTICE](./NOTICE) file, including:

- **Angular** (MIT License) - Web application framework
- **Nx** (MIT License) - Monorepo development tools
- **Vite** (MIT License) - Build tool and development server
- **Tailwind CSS** (MIT License) - Utility-first CSS framework
- **TypeScript** (Apache 2.0) - Typed JavaScript language
- **Playwright** (Apache 2.0) - End-to-end testing framework

### Compliance

This project complies with all applicable open source licenses. The MIT License allows for:
- ✅ Commercial use
- ✅ Private use
- ✅ Modification
- ✅ Distribution
- ✅ Patent use (within license scope)

**Requirements**: Include copyright notice and license text when distributing the software.

### Contributing License Agreement

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Built with Angular 17+, Nx, and Tailwind CSS** 🚀