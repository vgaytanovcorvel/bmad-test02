# Agentic AI Tic-Tac-Toe Showcase

A sophisticated tic-tac-toe implementation demonstrating Angular 17+, Nx monorepo architecture, Tailwind CSS, and intelligent AI game engine capabilities.

## 🏗️ Architecture

### Project Structure

This project is built using a modern monorepo structure with Nx workspace:

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

### Core Architecture Principles

**Separation of Concerns:**
- **UI Layer** (`apps/ui`): Pure presentation and user interaction
- **Engine Layer** (`libs/engine`): Game logic, rules, and AI decision-making
- **Shared Layer** (`libs/shared`): Common types, interfaces, and utilities
- **Testing Layer** (`apps/ui-e2e`): End-to-end behavioral validation

**Dependency Direction:**
- UI depends on Engine and Shared
- Engine depends only on Shared
- Shared has no dependencies
- Clear, unidirectional dependency flow prevents circular references

### Game Engine Design Rationale

The game engine represents the core intellectual property of this showcase, demonstrating enterprise-grade architectural patterns applied to game development.

#### Immutable State Management

**Design Decision**: All game state is immutable with pure function transformations.

```typescript
// Pure state transition - no mutations
function applyMove(currentState: GameState, move: Move): GameState {
  return {
    ...currentState,
    board: updateBoard(currentState.board, move),
    currentPlayer: getNextPlayer(currentState.currentPlayer),
    moveHistory: [...currentState.moveHistory, move]
  };
}
```

**Rationale:**
- **Predictable Debugging**: State snapshots enable time-travel debugging
- **Comprehensive Testing**: Pure functions are easily testable in isolation
- **Undo/Redo Support**: Complete move history enables game replay functionality
- **Concurrent Safety**: Immutable objects are inherently thread-safe
- **Caching Optimization**: Unchanged state objects can be safely cached

#### Exhaustive Search Algorithm for Optimal AI

**Algorithm Choice**: Complete minimax search with position evaluation for 3x3 and 4x4 boards.

**Performance Characteristics:**
- **3x3 Board**: Maximum 9 positions, optimal move calculation <1ms
- **4x4 Board**: Maximum 16 positions with k=3 condition, optimal move <5ms
- **Algorithm Complexity**: O(n²) for board scan, O(k) for line evaluation
- **Memory Usage**: Minimal due to position-based representation

**Why Exhaustive Search Works:**

*3x3 Tic-Tac-Toe (Traditional):*
- **Total Game States**: ~5,478 unique board positions
- **Decision Tree Depth**: Maximum 9 moves (alternating players)
- **Computational Load**: Modern processors handle complete search <10ms
- **Perfect Play**: AI can guarantee optimal outcome (win or draw)

*4x4 Tic-Tac-Toe (K=3):*
- **Total Positions**: 16 cells = 2^16 possible states, but game ends early
- **Winning Condition**: 3-in-a-row is achievable, preventing excessive game length
- **Search Pruning**: Games typically end within 6-10 moves due to multiple winning lines
- **Practical Performance**: Real-world optimal moves calculated <5ms

**Algorithm Implementation:**
```typescript
// K-in-row detection with configurable parameters
function findWinningLines(board: Board, k: number): WinningLine[] {
  const lines: WinningLine[] = [];
  const size = Math.sqrt(board.length);
  
  // Scan all directions: horizontal, vertical, diagonal, anti-diagonal
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      [[0,1], [1,0], [1,1], [1,-1]].forEach(([deltaRow, deltaCol]) => {
        const line = extractLine(board, row, col, deltaRow, deltaCol, k);
        if (isWinningLine(line)) lines.push(line);
      });
    }
  }
  return lines;
}
```

#### Factory Pattern for Engine Configuration

**Design Pattern**: Factory methods provide pre-configured engines for different game modes.

```typescript
// Centralized configuration prevents misconfiguration
export class EngineFactory {
  static create3x3Engine(): GameEngine {
    return new GameEngine({ boardSize: 3, winCondition: 3 });
  }
  
  static create4x4Engine(): GameEngine {
    return new GameEngine({ boardSize: 4, winCondition: 3 });
  }
}
```

**Benefits:**
- **Consistency**: Prevents invalid board size + k-value combinations
- **Extensibility**: New game modes added through factory methods
- **Documentation**: Factory methods serve as usage examples
- **Testing**: Known-good configurations simplify test setup

#### Position-Based Board Representation

**Representation**: Linear array with mathematical coordinate conversion.

```typescript
// 3x3 positions:     4x4 positions:
// 0 | 1 | 2          0  | 1  | 2  | 3
// --|---|--          ---|----|----|---
// 3 | 4 | 5          4  | 5  | 6  | 7
// --|---|--          ---|----|----|---
// 6 | 7 | 8          8  | 9  | 10 | 11
//                    ---|----|----|---
//                    12 | 13 | 14 | 15

// Conversion functions
function positionToCoordinates(position: number, boardSize: number): [number, number] {
  return [Math.floor(position / boardSize), position % boardSize];
}

function coordinatesToPosition(row: number, col: number, boardSize: number): number {
  return row * boardSize + col;
}
```

**Advantages:**
- **Efficient Storage**: Single array instead of nested data structures
- **Fast Access**: Direct indexing without nested loops
- **Universal Scanning**: Same algorithm works for any board size
- **Memory Optimization**: Minimal memory footprint for game state

### Future Extensibility Architecture

**Designed for Growth**: Current architecture supports planned extensions without breaking changes.

**Board Size Scaling:**
- **Algorithm Support**: K-in-row scales to any board size (5x5, 6x6, etc.)
- **Performance Path**: For large boards (8x8+), algorithm switches to alpha-beta pruning
- **Memory Management**: Position-based representation scales linearly
- **UI Adaptation**: Component architecture supports dynamic board rendering

**AI Strategy Extensions:**
- **Difficulty Levels**: Current perfect play can be reduced for casual play
- **Machine Learning**: Pure function architecture enables training data collection
- **Multi-Agent**: Immutable state supports multiple AI opponents
- **Opening Books**: Pre-computed optimal opening moves for enhanced performance

**Game Type Extensions:**
- **Connect Four**: Same k-in-row algorithm with gravity constraints
- **Gomoku**: Larger boards (15x15) with k=5 winning condition
- **Multi-Player**: State management supports >2 players
- **Network Play**: Immutable state serializes perfectly for network sync

### Performance Optimizations

**Current Optimizations:**
- **Early Termination**: Move validation stops on first invalid condition
- **Lazy Evaluation**: Win detection only runs after moves, not continuously
- **Efficient Lookups**: Mathematical coordinate conversion vs. lookup tables
- **Minimal Allocations**: Board arrays reused where possible

**Benchmarked Performance:**
- **3x3 Optimal Move**: <1ms on modern hardware
- **4x4 Optimal Move**: <5ms on modern hardware
- **Memory Usage**: <1KB per game state
- **Bundle Size Impact**: Game engine adds <50KB to application bundle

See [ADR-003: Engine Design](./docs/architecture/ADR-003-engine-design.md) for complete technical specifications.

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

- **Node.js**: Version 18 or higher
- **Package Manager**: PNPM (recommended) or npm
- **Git**: For cloning and version control

**Installation Check:**
```bash
# Verify prerequisites
node --version  # Should be 18.x.x or higher
pnpm --version  # Should be 8.x.x or higher
git --version   # Any recent version
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tic-tac-toe-showcase

# Install dependencies (uses PNPM workspaces)
pnpm install

# Verify installation
pnpm graph  # Shows dependency graph if successful
```

### Development Commands

**Core Development:**
```bash
# Start development server (http://localhost:4200)
pnpm serve
# Alternative: pnpm nx serve ui

# Build for production
pnpm build
# Alternative: pnpm nx build ui

# Build UI only (faster)
pnpm build:ui

# Build with production optimizations
pnpm build:ui:prod

# Build for static hosting (Vercel/Netlify)
pnpm build:ui:static
```

**Testing Commands:**
```bash
# Run all unit tests
pnpm test
# Alternative: pnpm nx test ui

# Run unit tests only (excludes integration tests)
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run tests in watch mode during development
pnpm test:watch

# Run E2E tests (mandatory before release)
pnpm test:e2e
# Alternative: pnpm e2e

# Generate test coverage report
pnpm coverage
```

**Code Quality Commands:**
```bash
# Run linting
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Format code with Prettier
pnpm format

# Check formatting without fixing
pnpm format:check

# Run complete validation pipeline (lint → test → build)
pnpm validate
```

**Development Tools:**
```bash
# View dependency graph
pnpm graph

# Clear Nx cache (if build issues occur)
pnpm reset

# Local preview of production build
pnpm preview
```

### Development Server

The development server runs with:
- **Hot Module Replacement (HMR)** for fast development
- **Vite builder** for optimal performance  
- **Angular DevTools** support
- **Tailwind CSS** with JIT compilation

**Development Server Features:**
- **Auto-reload**: Changes trigger automatic browser refresh
- **Error Overlay**: Build errors displayed in browser
- **Source Maps**: Full debugging support with original TypeScript
- **Fast Builds**: Initial build <5 seconds, incremental builds <1 second

### Build Process

**Build Configurations:**
```bash
# Development build (fast, unoptimized)
pnpm nx build ui

# Production build (optimized, compressed)
pnpm build:ui:prod

# Static hosting build (SPA optimized)
pnpm build:ui:static
```

**Build Output Structure:**
```
dist/apps/ui/browser/
├── index.html              # SPA entry point
├── main-[hash].js          # Application bundle
├── polyfills-[hash].js     # Browser polyfills
├── styles-[hash].css       # Compiled styles
├── assets/                 # Static assets
└── [additional chunks]     # Lazy-loaded modules
```

**Build Optimizations:**
- **Tree Shaking**: Removes unused code
- **Code Splitting**: Lazy loading for optimal performance
- **Asset Optimization**: Image compression and optimization
- **Bundle Analysis**: Available via build reports

**Build Verification:**
```bash
# Build and test locally
pnpm preview

# Check build health
curl http://localhost:4200/health

# Verify all routes work
# Navigate to: /, /health, /credits
```

### Troubleshooting Setup and Build Issues

**Common Installation Problems:**

**Node.js Version Issues:**
```bash
# Check Node.js version
node --version

# If version < 18, update Node.js
# Use nvm (recommended): nvm install 18 && nvm use 18
# Or download from nodejs.org
```

**PNPM Installation Issues:**
```bash
# Install PNPM globally
npm install -g pnpm

# Or use Corepack (Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

**Dependency Installation Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm store prune
pnpm install

# Alternative: Reset Nx cache
pnpm nx reset
pnpm install
```

**Build Failures:**

**TypeScript Compilation Errors:**
```bash
# Check for type errors
pnpm nx type-check ui

# Clear TypeScript cache
rm -rf .angular/cache
pnpm build
```

**Memory Issues During Build:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm build
```

**Vite Build Issues:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
pnpm build
```

**Development Server Issues:**

**Port Already in Use:**
```bash
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :4200  # Windows - then kill PID

# Or use different port
pnpm nx serve ui --port 4201
```

**Hot Reload Not Working:**
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check browser console for WebSocket connection errors
- Restart development server

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

### Accessibility and Inclusive Design

This application prioritizes accessibility to ensure an inclusive gaming experience for all users, including those using assistive technologies.

#### Current Accessibility Features (v1.3)

**Keyboard Navigation Support:**
- **Complete Keyboard Access**: All interactive elements accessible via keyboard
- **Tab Navigation**: Tab/Shift+Tab moves between cells and controls
- **Activation Keys**: Space or Enter activates focused elements (place moves, reset game)
- **Focus Management**: Clear visual focus indicators on all interactive elements
- **Logical Tab Order**: Focus moves in intuitive sequence through game controls

**Screen Reader Compatibility:**
- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3) throughout application
- **ARIA Labels**: Game board cells have descriptive labels for screen readers
- **Game State Announcements**: Current player and game status communicated to assistive technologies
- **Dynamic Content**: Game state changes announced via semantic markup updates
- **Descriptive Content**: All game information available to screen readers

**Visual Accessibility:**
- **High Contrast Support**: Game elements maintain accessibility in high contrast mode
- **Clear Visual Hierarchy**: Distinct styling for different game states and UI elements
- **Scalable Interface**: UI adapts to browser zoom levels up to 200%
- **Color Independence**: Game state never relies solely on color (uses symbols + color)

**Reduced Motion Support:**
- **Respects User Preferences**: `@media (prefers-reduced-motion: reduce)` implemented
- **Animation Override**: CSS animation system can be disabled completely
- **Subtle Effects Only**: Animations limited to ≤200ms for essential feedback
- **Performance Optimized**: Pure CSS animations, no JavaScript-driven effects

#### Accessibility Implementation Details

**Semantic HTML Structure:**
```html
<!-- Game board with proper semantics -->
<main role="main" aria-label="Tic Tac Toe Game">
  <div role="grid" aria-label="Game board">
    <button role="gridcell" 
            aria-label="Row 1, Column 1, Empty" 
            aria-pressed="false">
      <!-- Cell content -->
    </button>
  </div>
</main>
```

**Screen Reader Game State Communication:**
- **Current Player**: "Player X's turn" or "Player O's turn"
- **Cell States**: "Row 1, Column 2, contains X" or "Row 3, Column 1, empty"
- **Game Results**: "Player X wins with three in a row" or "Game ended in draw"
- **Controls**: "New Game button", "Mode selector: Human vs Computer"

**Keyboard Navigation Patterns:**
1. **Page Load**: Focus starts on game mode selector
2. **Game Board**: Arrow keys navigate cells, Tab moves to controls
3. **Cell Selection**: Space/Enter places move in focused cell
4. **Game End**: Focus moves to "New Game" button
5. **Persistent Focus**: Focus position maintained through game state changes

**Reduced Motion CSS Implementation:**
```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Optional animation enhancement */
.game-cell {
  transition: transform 0.15s ease-in-out;
}

.game-cell:hover {
  transform: scale(1.02);
}

/* Disable hover effects for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .game-cell:hover {
    transform: none;
  }
}
```

#### Accessibility Testing Approach

**Manual Testing:**
- **Keyboard-Only Navigation**: Complete game playable without mouse
- **Screen Reader Testing**: Basic compatibility verified with common screen readers
- **High Contrast Mode**: Interface remains functional in high contrast
- **Browser Zoom**: Layout maintains integrity at 200% zoom level

**Automated Testing:**
- **ESLint A11Y**: Automated accessibility linting during development
- **Semantic Structure**: HTML validation ensures proper document structure
- **ARIA Attributes**: Automated verification of ARIA implementation
- **Color Contrast**: Automated checking of color accessibility ratios

#### Current Accessibility Scope and Limitations

**Fully Implemented (v1.3):**
- ✅ Basic keyboard navigation and focus management
- ✅ Semantic HTML structure with proper headings
- ✅ Screen reader compatibility for game state communication
- ✅ Reduced motion preference support
- ✅ High contrast mode compatibility
- ✅ Browser zoom support up to 200%

**Future Accessibility Enhancements (Planned):**
- 🔄 **Advanced ARIA**: Live regions for dynamic game state announcements
- 🔄 **Enhanced Focus Management**: Advanced focus trapping and restoration
- 🔄 **WCAG 2.1 AA Compliance**: Comprehensive accessibility audit and fixes
- 🔄 **Screen Reader Optimization**: Advanced screen reader testing and optimization
- 🔄 **Voice Control**: Compatibility with voice navigation software
- 🔄 **Cognitive Accessibility**: Clear instructions and error prevention

#### Accessibility Guidelines for Contributors

**Development Standards:**
- Always include `data-testid` attributes for reliable automated testing
- Use semantic HTML elements instead of generic divs where possible
- Ensure interactive elements have accessible names (aria-label or text content)
- Test keyboard navigation for any new interactive features
- Verify screen reader compatibility when adding dynamic content
- Respect `prefers-reduced-motion` in any new animations

**Testing Requirements:**
- Manual keyboard navigation test for new features
- Screen reader spot-check for dynamic content changes
- High contrast mode verification
- Automated accessibility linting must pass

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

#### Pre-Deployment Preparation

**Build for Static Hosting:**
```bash
# Build optimized static assets
npm run build:ui:static

# Verify build output
ls -la dist/apps/ui/browser/
# Should contain: index.html, main-*.js, styles-*.css, assets/

# Test locally before deployment
npm run preview
# Navigate to http://localhost:4200 and test all routes
```

**Pre-Deployment Checklist:**
- [ ] `npm run build:ui:static` completes without errors
- [ ] `npm run preview` serves application correctly
- [ ] All routes accessible: `/`, `/health`, `/credits`
- [ ] Health endpoint shows green status and build hash
- [ ] No console errors in browser developer tools

#### Vercel Deployment

**CLI Method (Recommended):**
```bash
# Install Vercel CLI (one-time setup)
npm install -g vercel

# First deployment (follow prompts)
vercel
# Choose: Link to existing project? [y/N] N
# Enter project name or press Enter for auto-generated
# Choose: In which directory is your code located? ./
# Auto-detected: Other
# Build command: npm run build:ui:static
# Output directory: dist/apps/ui/browser

# Production deployment
vercel --prod

# View deployment
vercel --prod --open
```

**Configuration**: Uses `vercel.json` in project root
```json
{
  "buildCommand": "npm run build:ui:static",
  "outputDirectory": "dist/apps/ui/browser",
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Drag-and-Drop Method:**
1. **Build**: `npm run build:ui:static`
2. **Navigate**: [vercel.com/new](https://vercel.com/new)
3. **Deploy**: Drag `dist/apps/ui/browser/` folder to upload area
4. **Verify**: Check deployed URL for functionality

**Vercel Environment Variables:**
- `NODE_VERSION`: Set to `18` if needed
- `BUILD_HASH`: Automatically generated during build
- `PNPM_VERSION`: Set to `8` for consistent builds

#### Netlify Deployment  

**CLI Method (Recommended):**
```bash
# Install Netlify CLI (one-time setup)
npm install -g netlify-cli

# Login to Netlify
netlify login

# First deployment
netlify deploy
# Follow prompts to create new site

# Production deployment  
netlify deploy --prod

# Open deployed site
netlify open:site
```

**Configuration**: Uses `netlify.toml` in project root
```toml
[build]
  command = "npm run build:ui:static"
  publish = "dist/apps/ui/browser"

[build.environment]
  NODE_VERSION = "18"
  PNPM_VERSION = "8"

# SPA fallback routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Drag-and-Drop Method:**
1. **Build**: `npm run build:ui:static`
2. **Navigate**: [netlify.com/drop](https://netlify.com/drop)
3. **Deploy**: Drag `dist/apps/ui/browser/` folder to upload area
4. **Configure**: SPA routing automatically configured

**Netlify Build Settings (Dashboard):**
- **Build command**: `npm run build:ui:static`
- **Publish directory**: `dist/apps/ui/browser`
- **Node version**: `18` (in environment variables)

#### Alternative Static Hosting Platforms

**GitHub Pages:**
```bash
# Build for GitHub Pages
npm run build:ui:static

# Deploy using gh-pages package
npm install -g gh-pages
gh-pages -d dist/apps/ui/browser
```

**Firebase Hosting:**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build and deploy
npm run build:ui:static
firebase login
firebase init hosting
firebase deploy
```

**Surge.sh:**
```bash
# Install Surge
npm install -g surge

# Build and deploy
npm run build:ui:static
cd dist/apps/ui/browser
echo "your-domain.surge.sh" > CNAME
surge
```

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

**Pre-Deployment Local Testing:**
- [ ] **Build Success**: `npm run build:ui:static` completes without errors
- [ ] **Local Preview**: `npm run preview` serves correctly at localhost:4200
- [ ] **Health Endpoint**: `/health` displays app info and green status
- [ ] **SPA Routing**: Direct navigation to `/health` and `/credits` works (no 404)
- [ ] **Build Assets**: `dist/apps/ui/browser/` contains optimized files
- [ ] **Build Hash**: Unique hash appears in health check page
- [ ] **Environment**: Shows "Production" in health check when built
- [ ] **No Console Errors**: Browser dev tools show clean console

**Post-Deployment Verification:**
- [ ] **Deployed URL Access**: Site loads at provided deployment URL
- [ ] **All Routes Functional**: Test `/`, `/health`, `/credits` via direct navigation
- [ ] **Game Functionality**: Tic-tac-toe game works correctly
- [ ] **Health Status**: Green status indicator shows on `/health`
- [ ] **Build Hash Unique**: Health page shows deployment-specific build hash
- [ ] **Performance**: Site loads within 3 seconds on standard connection
- [ ] **Mobile Compatibility**: Test on mobile device or browser dev tools

**Health Check Validation:**
```bash
# Test health endpoint (replace URL with your deployment)
curl https://your-app.vercel.app/health

# Should return 200 status code and HTML containing:
# - "Healthy" status indicator
# - Application name: "Tic Tac Toe Showcase"
# - Version: current version number
# - Build hash: deployment-specific hash
# - Environment: "Production"
```

#### Deployment Troubleshooting

**Build and Pre-Deployment Issues:**

**Build Failures:**
```bash
# Clear all caches and rebuild
pnpm nx reset
rm -rf node_modules/.vite
rm -rf .angular/cache
npm run build:ui:static

# Check for memory issues
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build:ui:static

# Verify build dependencies
pnpm install
npm run validate  # Run full validation pipeline
```

**Local Preview Issues:**
```bash
# Build not serving locally
npm run build:ui:static
cd dist/apps/ui/browser
python -m http.server 4200  # Python alternative
# or
npx serve -s . -l 4200      # Node.js alternative
```

**Deployment Platform Issues:**

**SPA Routing Issues (404 on refresh):**
- **Vercel**: Verify `vercel.json` contains `{"src": "/(.*)", "dest": "/index.html"}`
- **Netlify**: Verify `netlify.toml` contains `[[redirects]]` with fallback to `/index.html`
- **General**: Ensure hosting platform supports SPA routing configuration
- **Manual Fix**: Add `_redirects` file containing `/*    /index.html   200`

**Build Command Issues:**
```bash
# If platform doesn't recognize npm commands
# Use direct Node.js command instead:
node_modules/.bin/nx build ui --configuration=static

# Or specify full path to build:
./node_modules/.bin/pnpm run build:ui:static
```

**Environment Variable Issues:**
- **Missing BUILD_HASH**: Verify `tools/build-hash.js` runs during build
- **Wrong Environment**: Check environment shows "Production" on deployed health page
- **Version Mismatch**: Verify `package.json` version matches health page display

**Asset Loading Issues:**
- **Missing Static Files**: Check `dist/apps/ui/browser/assets/` contains required files
- **CORS Issues**: Verify hosting platform serves all file types correctly
- **Cache Issues**: Clear browser cache or test in incognito mode

**Performance Issues:**
```bash
# Analyze bundle size
npm run build:ui:static
ls -lh dist/apps/ui/browser/*.js
# Main bundle should be < 500KB gzipped

# Check for large dependencies
npx webpack-bundle-analyzer dist/apps/ui/browser
```

**Domain and HTTPS Issues:**
- **Mixed Content**: Verify all resources load over HTTPS in production
- **Custom Domain**: Check DNS configuration and SSL certificate status  
- **Redirect Loops**: Verify hosting platform HTTPS redirect settings

**Debug Deployment Issues:**
```bash
# Check deployment logs (platform-specific)
vercel logs <deployment-url>    # Vercel
netlify logs                    # Netlify

# Test production build locally
npm run build:ui:static
npm run preview
# Compare local preview with deployed version
```

#### Rollback and Recovery

**Quick Rollback (Vercel):**
```bash
# List recent deployments
vercel ls

# Promote previous deployment to production
vercel promote <deployment-url> --prod
```

**Quick Rollback (Netlify):**
```bash
# View deployment history
netlify sites:list

# Restore previous deployment via dashboard
# Or redeploy from previous Git commit
```

**Emergency Recovery:**
1. **Revert Git Changes**: `git revert <commit-hash>`
2. **Rebuild and Deploy**: `npm run build:ui:static` then redeploy
3. **Monitor Health**: Check `/health` endpoint shows green status
4. **Verify Functionality**: Test core game features work correctly

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

## 🌐 Browser Compatibility

### Supported Browsers

This application has been tested and verified to work correctly on the following browsers:

| Browser | Version | Desktop Support | Mobile Support | Notes |
|---------|---------|-----------------|----------------|--------|
| **Google Chrome** | 90+ | ✅ Fully Supported | ✅ Fully Supported | Recommended browser |
| **Mozilla Firefox** | 90+ | ✅ Fully Supported | ✅ Fully Supported | Excellent compatibility |
| **Microsoft Edge** | 90+ | ✅ Fully Supported | ✅ Fully Supported | Chromium-based |
| **Safari** | 14+ | ✅ Fully Supported | ✅ Fully Supported | WebKit engine |

### Technical Compatibility

**JavaScript Features:**
- ES2022+ syntax with polyfills for older browsers
- Angular 17+ standalone components
- Native async/await patterns
- Signal-based reactivity

**CSS Features:**
- CSS Grid and Flexbox (full modern browser support)
- CSS Custom Properties for theming
- Tailwind CSS utilities with autoprefixer
- Responsive design with mobile-first approach  

**Build System:**
- Vite bundling with automatic polyfill injection
- Code splitting and lazy loading
- Content hashing for optimal caching
- Bundle size: ~91KB gzipped (initial load)

### Mobile Support

**Responsive Design:**
- Mobile-first approach with breakpoints at 375px, 768px, 1024px
- Touch-friendly interface with ≥44px touch targets
- Optimized for both portrait and landscape orientations
- Smooth touch interactions for game board

**Performance:**
- Optimized bundle sizes for mobile networks
- Fast initial load times (target <3 seconds)
- Efficient memory usage and battery consumption

### Testing Coverage

Cross-browser testing includes:
- **Functional Testing**: All game features and routing
- **Visual Testing**: Layout consistency and styling
- **Performance Testing**: Loading times and responsiveness  
- **Accessibility Testing**: Keyboard navigation and screen readers
- **Mobile Testing**: Touch interactions and responsive design

### Known Issues and Workarounds

**Development Warnings:**
- Tailwind CSS may show utility class warnings during development (safe to ignore)
- Sass @import deprecation warnings (planned migration to @use syntax)
- Component style budget warnings for large CSS bundles (optimization in progress)

**Browser-Specific Notes:**
- Safari may require additional testing for WebKit-specific behaviors
- Internet Explorer is not supported (Angular 17+ requirement)
- Legacy browsers require modern JavaScript polyfills (automatically included)

### Reporting Browser Issues

If you encounter browser-specific issues:

1. **Document the issue** with browser version and OS
2. **Include steps to reproduce** the problem
3. **Check console** for JavaScript errors or warnings
4. **Test in multiple browsers** to verify browser-specific behavior
5. **Submit issue** with complete environment information

For detailed testing procedures and results, see:
- `docs/qa/cross-browser-testing/` - Complete testing documentation
- `docs/stories/4.4.cross-browser-smoke.md` - Testing story and results

## 📊 Performance Characteristics

### Bundle Size Analysis

This application is optimized for fast loading with a minimal bundle size:

| Metric | Size | Target | Status |
|--------|------|--------|---------|
| **Total Bundle (gzipped)** | 90.14 KB | <500 KB | ✅ Excellent (82% below target) |
| **Initial Load (gzipped)** | 77.36 KB | <500 KB | ✅ Optimal for first page experience |
| **Complete Bundle (raw)** | 362.5 KB | <1 MB | ✅ Well within limits |

### Bundle Breakdown

**Initial Chunks (Always Loaded):**
- Angular Framework Core: 42.04 KB (gzipped)
- Angular Platform & Router: 23.81 KB (gzipped)
- Browser Polyfills: 8.44 KB (gzipped)
- Application Code: 3.07 KB (gzipped)

**Lazy Chunks (Route-Based Loading):**
- Game Components: 12.78 KB (gzipped) - Loaded only when needed
- Credits & Health Pages: Separate chunks for optimal performance

### Performance Metrics

**Loading Performance:**
- **First Contentful Paint**: <1.5 seconds (target)
- **Time to Interactive**: <3 seconds on 3G connection
- **Bundle Compression**: 75% reduction with gzip compression
- **Initial Load Time**: Optimized for mobile-first experience

**Build Optimizations:**
- ✅ Tree shaking removes unused code
- ✅ Code splitting with route-based lazy loading
- ✅ Minification and compression applied
- ✅ Content hashing for optimal browser caching
- ✅ Angular standalone components for smaller footprint

### Performance Budget

The application maintains strict performance budgets:
- **Bundle Size Budget**: 500KB warning / 1MB error threshold
- **Component Style Budget**: 4KB warning / 8KB error threshold
- **Performance Grade**: **Excellent** - 82% below target with significant headroom

### Dependency Analysis

**Major Dependencies:**
- Angular 20.2.x (263 KB raw) - Modern framework with optimized bundle
- Game Engine (39 KB raw) - Custom tic-tac-toe implementation
- Tailwind CSS (10 KB raw) - Utility-first CSS with PurgeCSS optimization

**Third-Party Libraries:**
- `@angular/core`, `@angular/common`, `@angular/router`
- `rxjs` (Angular dependency, minimal usage)
- `zone.js` (Angular requirement)
- `tslib` (TypeScript runtime helpers)

For complete bundle analysis and optimization recommendations, see:
- `docs/performance/bundle-size-report.md` - Detailed size breakdown
- `docs/performance/optimization-recommendations.md` - Future optimization strategies

---

**Built with Angular 17+, Nx, and Tailwind CSS** 🚀