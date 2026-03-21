# DARCHIE

DARCHIE is a premium interview-practice platform for data engineers.

The current repo contains:
- a Next.js frontend in `apps/web`
- planning and governance docs in `docs/`
- a FastAPI backend area in `services/api`
- a VS Code devcontainer setup for local development

## Current Status
The frontend foundation is implemented with:
- marketing pages
- auth shells
- app shells
- premium design system foundation
- practice hub and module landing pages
- a first functional SQL workspace slice backed by FastAPI preview APIs

The backend is now partially wired for the SQL module preview path. Python, data-modeling, pipeline-builder, auth, billing, and persistence are still incomplete.
Python now mirrors the SQL workspace UI structure in the browser, but its run and submit flows remain mocked and frontend-only.
Data Modeling now has a frontend-interactive React Flow design canvas with real ERD validation, a full-width prompt section, a palette-first builder workflow, and mocked submit/review behavior.

## Recommended Setup
Use the devcontainer.

### Open In Devcontainer
1. Open the repo in VS Code.
2. Run `Dev Containers: Reopen in Container`.
3. Wait for the container to finish booting.

The devcontainer already provides:
- Node 22
- pnpm 10
- Python 3.12
- Postgres
- Redis

## Install Dependencies
If dependencies are not installed yet, run:

```bash
pnpm install
```

## Run The Website
From the repo root:

```bash
pnpm dev:web
```

This starts the frontend at:

```text
http://localhost:3000
```

Useful routes:
- `/`
- `/modules`
- `/pricing`
- `/about`
- `/signin`
- `/signup`
- `/onboarding`
- `/app/dashboard`
- `/app/practice`
- `/app/progress`
- `/app/settings`

If port `3000` is already busy, run:

```bash
pnpm --filter darchie-web exec next dev -H 0.0.0.0 -p 3001
```

Then open `http://localhost:3001`.

## Run The API
From the repo root:

```bash
pnpm dev:api
```

This starts the FastAPI backend at:

```text
http://localhost:8000
```

The SQL workspace in `/app/practice/sql/session-retention-breakdown` expects the API to be available there unless `NEXT_PUBLIC_API_BASE_URL` is set differently.
The Python workspace at `/app/practice/python/events-normalization-job` reuses the same focused exercise layout as SQL, but it does not require the API yet.
The Data Modeling workspace at `/app/practice/data-modeling/marketplace-core-entities` is frontend-only in this slice and does not require the API yet.

## Frontend Commands
Run from the repo root.

Start dev server:

```bash
pnpm dev:web
```

Production build:

```bash
pnpm build:web
```

Unit tests:

```bash
pnpm test:web -- --run
```

Playwright smoke tests:

```bash
pnpm --filter darchie-web exec playwright test tests/smoke.spec.ts
```

API tests:

```bash
pnpm test:api
```

## Notes
- Playwright currently clears stale `.next` output before starting its web server to avoid intermittent runtime chunk issues.
- You may still see a non-blocking Next.js dev warning about `allowedDevOrigins` during Playwright runs.
- The SQL module now includes a first FastAPI-backed preview flow with draft save, run, and submit behavior.
- SQL execution currently uses a narrow local sandbox runner behind the FastAPI service while the broader sandboxed MySQL production path remains a later architecture step.
- SQL, Python, and Data Modeling exercise routes now use a focused top-header layout instead of the heavier desktop sidebar.
- Python currently matches the SQL workspace UX structure, but its execution/review behavior is still mocked.
- SQL and Python keep the sticky prompt-left, work-surface-center, sticky-review-right structure.
- Data Modeling now uses a full-width prompt section above the workspace, a dominant React Flow architecture canvas, a full-height builder palette on the right, and a full-width validation/review surface beneath the canvas.
- Data Modeling is now canvas-first: entity and shape labels are renamed inline, entity fields can be added and edited directly in the node card, and the older left inspector / below-canvas action-strip pattern has been removed.
- Data Modeling no longer shows the `Starter hint` block in the prompt area.
- Data Modeling supports hybrid architecture shapes for canvas composition, but only ERD entities and relationships participate in blocking validation in this slice.

## Important Docs
Start here if you want the implementation/planning context:
- `docs/00-governance/01-master-index.md`
- `docs/00-governance/31-implementation-change-log.md`
- `docs/00-governance/32-implementation-context-log.md`

## Next Recommended Work
- expand the SQL runtime from the first preview slice into a fuller sandbox implementation
- move Python from the mirrored mocked workspace into a real runtime-backed contract
- add persistence and backend-backed validation/scoring for the Data Modeling builder
- connect real auth, persistence, and entitlement flows later
