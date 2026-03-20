# 11 High-Level Design

## Purpose
Define the production architecture, system boundaries, main services, and deployment shape for DARCHIE v1.

## Decisions This Document Owns
- Architecture style
- major subsystems
- deployment topology
- primary technology choices
- external dependencies

## Inputs / Dependencies
- `docs/01-product/04-prd.md`
- `docs/01-product/06-information-architecture.md`

## Required Sections
- Architecture overview
- subsystems
- stack
- deployment
- integrations

## Output Format
System architecture document.

## Completion Criteria
- Teams can agree on the overall production architecture.
- Boundaries between frontend, app backend, and execution systems are explicit.

## Architecture Overview
DARCHIE will use a modular web architecture with a single primary web application and one isolated execution service.

### Core architectural decision
- Frontend and application backend: `Next.js 15` with App Router and TypeScript
- Primary database and auth: `Supabase` for Postgres, Auth, and Storage
- ORM and schema management: `Prisma`
- Background job and queue layer: `Upstash Redis` plus queue workers
- Code execution service: isolated `Execution Worker` deployed separately in containers
- Visual builder engine: frontend-first simulation using `React Flow` with server-side validation and persistence

## Major Subsystems
### 1. Marketing Website
- Public pages and SEO content
- Pricing and sign-up entry points

### 2. Authenticated Web App
- Dashboard, practice modules, progress, settings, billing

### 3. App API Layer
- Route handlers for auth-aware app APIs
- Exercise loading, attempt persistence, progress aggregation, subscription checks

### 4. Practice Engine
- Orchestrates exercise metadata, starter state, validation, scoring, feedback generation

### 5. Execution Worker
- Handles Python and SQL submissions in isolated runtime environments
- Returns structured evaluation output

### 6. Visual Builder Engine
- Validates DAG and ERD rules
- Simulates execution order and failure states
- Produces scored feedback

### 7. Analytics And Observability
- Product analytics events
- app logs, errors, and performance traces

## Selected Stack
### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui primitives
- React Flow for visual builder surfaces
- Monaco Editor for SQL and Python editing
- Recharts for dashboard visualizations

### Backend
- Next.js Route Handlers
- Prisma
- Supabase Postgres
- Zod for validation
- Upstash Redis for queue/event support
- Stripe for billing foundation

### Execution
- Separate Node.js/TypeScript service
- Containerized isolated runners for SQL and Python
- Runtime limits for CPU, memory, execution time, and network access

## Deployment Topology
- Web app deployed on `Vercel`
- Postgres/Auth/Storage on `Supabase`
- Execution worker deployed on `Railway` or `Fly.io`
- Redis queue on `Upstash`
- Monitoring via `Sentry` and platform logs

## Key Boundaries
- The web app never executes arbitrary user code directly.
- The execution worker never has direct database write permissions beyond signed internal API workflows.
- Visual builder simulation is mostly deterministic application logic and should not depend on the code execution worker.

## External Integrations
- Supabase
- Stripe
- Google OAuth
- Sentry
- PostHog for analytics
