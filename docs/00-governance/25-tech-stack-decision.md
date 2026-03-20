# 25 Tech Stack Decision

## Purpose
Capture the final approved technology stack for DARCHIE based on the current product scope, frontend requirements, backend requirements, and implementation priorities.

## Decisions This Document Owns
- Final frontend stack
- Final backend stack
- Testing stack
- Local development and environment tooling
- What is optional later versus required now

## Inputs / Dependencies
- `docs/01-product/02-product-vision.md`
- `docs/01-product/04-prd.md`
- `docs/02-design/07-frontend-ux-strategy.md`
- `docs/03-architecture/11-high-level-design.md`
- `docs/04-delivery/22-implementation-plan.md`

## Required Sections
- Decision summary
- frontend stack
- backend stack
- testing stack
- local development stack
- deferred technologies

## Output Format
Decision document for engineering and implementation planning.

## Completion Criteria
- The chosen stack is explicit enough to drive project bootstrap.
- Required-now and optional-later technologies are clearly separated.

## Decision Summary
DARCHIE will use a split web-and-API architecture:

- Frontend: `Next.js + React + TypeScript`
- Backend: `FastAPI + Python`
- Database: `PostgreSQL`
- Queue/cache support: `Redis`

This stack is optimized for:
- fast implementation
- production reliability
- debugging simplicity
- a strong fit for visual builders, code editors, dashboards, and authenticated product flows

## Final Frontend Stack
### Core framework
- `Next.js 15`
- `React 19`
- `TypeScript`

### Styling and UI
- `Tailwind CSS v4`
- `shadcn/ui`
- `next-themes`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`

### Forms and validation
- `Zod`
- `React Hook Form`
- `@hookform/resolvers`

### Data fetching and frontend state
- `TanStack Query`
- React local state by default
- `Zustand` only if builder/canvas state becomes complex enough to justify a dedicated store

### Product-specific frontend libraries
- `@xyflow/react` for drag-and-drop pipeline and data-model builders
- `@monaco-editor/react` for SQL and Python editors
- `Recharts` for progress dashboards and analytics cards
- `motion` for lightweight, purposeful UI animation

### Frontend testing
- `Playwright` for end-to-end testing
- `Vitest` for unit and component tests
- `@testing-library/react`
- `@testing-library/jest-dom`

## Frontend State Strategy
- Use `TanStack Query` for server state
- Use component and route-local React state for ordinary UI state
- Avoid Redux in v1
- Add `Zustand` only for advanced workspace/builder interactions if local state becomes hard to manage

## Final Backend Stack
### Core framework
- `Python 3.12`
- `FastAPI`
- `Uvicorn`

### Validation and schemas
- `Pydantic v2`

### Database and ORM
- `PostgreSQL`
- `SQLAlchemy 2.0`
- `Alembic`

### Queue / cache / async support
- `Redis`

### Python package and environment management
- `uv`

### Backend testing
- `pytest`

## Backend Architecture Direction
The backend will live in `services/api` as a dedicated FastAPI service.

It will initially handle:
- auth-ready API foundations
- user profile and onboarding APIs
- exercise catalog APIs
- draft save/load APIs
- progress APIs
- submission orchestration APIs

## Local Development Stack
- `Devcontainer`
- `Docker Compose`
- `PostgreSQL 16`
- `Redis 7`
- Node `22`
- `pnpm`
- Python `3.12`
- `uv`

## Deferred / Optional Later
These are not part of the initial required stack:

- `Zustand`
  - add only if builder state becomes too complex for local state
- `Celery`
  - add only if background jobs become heavy enough that FastAPI background tasks or simpler queue handling are no longer sufficient
- `Sentry`
  - recommended soon after bootstrap, but not required before the first app scaffold
- `PostHog`
  - recommended after initial product flows exist
- `Stripe`
  - required when billing implementation begins, not before frontend foundation/bootstrap

## Technologies Explicitly Not Chosen For V1
- `Redux Toolkit`
  - too heavy for current stage
- `Django`
  - too opinionated and broad for the current backend scope
- `Flask`
  - would require more manual assembly than FastAPI
- large opinionated component suites as the primary UI system
  - less flexible for the product-led custom UI we want

## Rationale
### Why this frontend stack
- `Next.js` is the best fit for a product that needs both a marketing site and an authenticated application
- `Tailwind + shadcn/ui` gives fast implementation with strong visual control
- `React Flow` and `Monaco` directly support the hardest parts of the product
- `TanStack Query` keeps async frontend code manageable and debuggable

### Why this backend stack
- `FastAPI` is fast to implement, typed, and easy to debug
- `Pydantic` and `SQLAlchemy` give strong data and schema control
- `PostgreSQL + Redis` cover the persistence and queue/cache needs cleanly

## Final Decision
DARCHIE will proceed with:

- Frontend: `Next.js 15 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui`
- Backend: `FastAPI + Python 3.12 + Pydantic v2 + SQLAlchemy 2.0`
- Data layer: `PostgreSQL + Redis`
- Testing: `Playwright + Vitest + Testing Library + pytest`
