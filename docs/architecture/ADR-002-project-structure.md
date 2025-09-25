# ADR-002: Project Structure and Monorepo Organization

## Status
Accepted

## Date
2025-09-25

## Context

The Tic Tac Toe Showcase project requires a well-organized code structure that supports:
- Clear separation between game logic, UI presentation, and shared utilities
- Testable architecture with distinct layers and responsibilities
- Code reusability across different applications and components
- Future extensibility for additional games or AI implementations
- Professional development practices with proper dependency management

The project must demonstrate enterprise-grade architecture patterns while remaining simple enough to showcase core concepts effectively.

## Decision

We have adopted an Nx-based monorepo structure with the following organization:

### Top-Level Structure
```
tic-tac-toe-showcase/
├── apps/                    # Applications
│   ├── ui/                 # Main Angular application
│   └── ui-e2e/             # End-to-end test application
├── libs/                    # Shared libraries
│   ├── engine/             # Game engine library
│   ├── shared/             # Shared utilities and types
│   └── ai/                 # Future AI implementations
├── docs/                    # Documentation
├── tools/                   # Build and development tools
└── [config files]          # Root configuration
```

### Application Layer (`apps/`)
- **`ui/`**: Primary Angular application containing all UI components, pages, and services
- **`ui-e2e/`**: Dedicated Playwright testing application for end-to-end scenarios

### Library Layer (`libs/`)
- **`engine/`**: Core game logic, rules, and state management (framework-agnostic)
- **`shared/`**: Common types, interfaces, and utilities used across applications
- **`ai/`**: Future library for AI implementations and computer player strategies

### UI Application Structure (`apps/ui/`)
```
src/
├── app/
│   ├── components/          # Standalone Angular components
│   │   ├── game-board/     # Game board display and interaction
│   │   ├── game-controls/  # Game control interface
│   │   ├── game-status/    # Status and winner display
│   │   └── health-check/   # Health check indicator
│   ├── pages/              # Route-level page components
│   │   ├── game/           # Main game page
│   │   ├── health/         # Health check page
│   │   └── credits/        # Credits and attributions page
│   ├── services/           # Angular services for UI logic
│   │   ├── game.service.ts # Game state management and UI orchestration
│   │   └── [other services]
│   ├── app.routes.ts       # Application routing configuration
│   ├── app.config.ts       # Application-wide configuration
│   └── app.component.ts    # Root application component
├── assets/                 # Static assets and resources
├── styles/                 # Global styles and Tailwind configuration
└── environments/           # Environment-specific configurations
```

## Rationale

### Apps vs Libraries Separation
- **Clear Boundaries**: Applications consume libraries but never depend on other applications
- **Testable Architecture**: Libraries contain pure logic that's easily unit tested
- **Code Reuse**: Multiple applications can share the same game engine and utilities
- **Deployment Independence**: Applications can be deployed separately if needed

### Game Engine as Separate Library
- **Framework Independence**: Game logic works with any frontend framework
- **Pure Functions**: Engine methods are deterministic and easily testable
- **Business Logic Isolation**: UI concerns separated from game rules and validation
- **Future Extensibility**: Engine can support multiple game types and AI strategies
- **Performance**: Core logic optimized without UI framework overhead

### Component Organization Principles
- **Feature-Based Grouping**: Components organized by game functionality
- **Page-Level Routing**: Clear distinction between routed pages and reusable components
- **Service Layer**: UI logic centralized in Angular services for testability
- **Standalone Components**: Modern Angular 17+ patterns with explicit imports

### Shared Library Strategy
- **Common Types**: Centralized interfaces and type definitions
- **Utility Functions**: Reusable helpers for formatting, validation, and calculations
- **Constants**: Game configuration and shared enumerations
- **Cross-Application**: Types and utilities used by both UI and testing applications

## Consequences

### Positive
- **Modular Architecture**: Clear separation enables independent development and testing
- **Code Reusability**: Shared libraries reduce duplication across applications
- **Testable Design**: Business logic in libraries is easily unit tested in isolation
- **Scalable Structure**: Foundation supports additional games, features, and applications
- **Professional Standards**: Enterprise-grade architecture patterns and practices
- **Dependency Management**: Clear import boundaries and dependency direction
- **Future-Proof**: Structure supports AI extensions and multiplayer features

### Negative
- **Initial Complexity**: More structure overhead for a simple tic-tac-toe game
- **Build Configuration**: Nx monorepo requires additional build and configuration setup
- **Import Overhead**: Cross-library imports require path mapping and configuration
- **Learning Curve**: Developers must understand monorepo concepts and Nx tooling

### Implementation Guidelines

#### Library Import Patterns
```typescript
// ✅ Correct: Libraries import from other libraries
import { GameEngine } from '@libs/engine';
import { GameState, Player } from '@libs/shared';

// ✅ Correct: Applications import from libraries
import { GameService } from '../services/game.service';
import { GameEngine } from '@libs/engine';

// ❌ Incorrect: Libraries should not import from applications
import { GameComponent } from '@apps/ui/components/game';
```

#### Dependency Direction Rules
- **Applications** may depend on **Libraries**
- **Libraries** may depend on other **Libraries**
- **Libraries** must never depend on **Applications**
- **Shared** library has no dependencies on other project libraries
- **Engine** library may only depend on **Shared** library

#### Service Layer Responsibilities
- **UI Services** (`apps/ui/services/`): Angular-specific logic, component orchestration, UI state
- **Engine Services** (`libs/engine/`): Pure game logic, rules, validation, state transitions
- **Shared Utilities** (`libs/shared/`): Common functions, formatting, type guards, constants

## Validation and Testing

### Architecture Validation
- Nx dependency graph ensures proper library boundaries
- ESLint rules enforce import restrictions between layers
- Build process validates that libraries remain framework-independent
- Unit tests verify that engine logic works without UI dependencies

### Testing Strategy by Layer
- **Engine Library**: Pure unit tests with 100% coverage of game logic
- **Shared Library**: Utility function tests with edge case coverage
- **UI Components**: Integration tests with @testing-library/angular
- **Application**: End-to-end tests covering complete user workflows

## Future Considerations

### Planned Extensions
- **AI Library**: Machine learning models and computer player strategies
- **Multiplayer Library**: Real-time game synchronization and networking
- **Analytics Library**: Game statistics and performance tracking
- **Mobile App**: React Native or Flutter application using same engine

### Migration Path
- Engine library design supports multiple frontend frameworks
- Shared types and interfaces provide stable contracts for extensions
- Modular architecture enables incremental feature additions
- API boundaries allow for microservice extraction if needed

## References
- [Nx Monorepo Best Practices](https://nx.dev/guides/monorepo-nx-enterprise)
- [Angular Library Architecture](https://angular.io/guide/creating-libraries)
- [Project Structure Documentation](../ui-architecture/project-structure.md)
- [Component Architecture Standards](../ui-architecture/component-architecture-standards.md)