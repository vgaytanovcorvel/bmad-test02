# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Tic Tac Toe Showcase project. ADRs document significant architectural decisions, their context, rationale, and consequences.

## ADR Process

When making architectural decisions that affect the project structure, technology choices, or development patterns:

1. **Create a new ADR** using the format `ADR-XXX-short-description.md`
2. **Number sequentially** starting from ADR-001
3. **Follow the standard template** with Status, Context, Decision, and Consequences sections
4. **Update this index** with the new ADR entry
5. **Reference in code** when implementing the decision

## Current ADRs

| Number | Title | Status | Date |
|--------|-------|--------|------|
| [ADR-001](./ADR-001-tech-stack.md) | Technology Stack Selection | Accepted | 2025-09-25 |
| [ADR-002](./ADR-002-project-structure.md) | Project Structure and Monorepo Organization | Accepted | 2025-09-25 |
| [ADR-003](./ADR-003-engine-design.md) | Game Engine Design and Architecture | Accepted | 2024-01-15 |

## ADR Statuses

- **Proposed**: Under consideration
- **Accepted**: Decision approved and implemented
- **Deprecated**: No longer recommended but still in use
- **Superseded**: Replaced by a newer decision

## Contributing

Before making significant architectural changes:

1. Check existing ADRs for related decisions
2. Create a new ADR if the decision is architectural significant
3. Discuss the proposal with the team
4. Update implementation documentation after acceptance

For detailed contributing guidelines, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Legal and Attribution Notes

All architectural decisions must consider third-party licensing requirements:

- **MIT Licensed Dependencies**: Include copyright notice and license text
- **Apache 2.0 Dependencies**: Include NOTICE file information and attribution
- **Custom Licenses**: Follow specific attribution requirements per license terms

For complete third-party attribution requirements, see:
- [LICENSE](../../LICENSE) - Project license
- [NOTICE](../../NOTICE) - Third-party attributions  
- [Credits Implementation Plan](../credits/credits-implementation.md) - Epic 4 attribution strategy