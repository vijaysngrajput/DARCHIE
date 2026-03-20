# DARCHIE

DARCHIE is a premium interview-practice platform for data engineers.

The current repo contains:
- a Next.js frontend in `apps/web`
- planning and governance docs in `docs/`
- a future FastAPI backend area in `services/api`
- a VS Code devcontainer setup for local development

## Current Status
The frontend foundation is implemented with:
- marketing pages
- auth shells
- app shells
- premium design system foundation
- placeholder dashboard, practice, progress, and settings routes

The backend and real product logic are not wired yet.

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

## Notes
- Playwright currently clears stale `.next` output before starting its web server to avoid intermittent runtime chunk issues.
- You may still see a non-blocking Next.js dev warning about `allowedDevOrigins` during Playwright runs.
- The current pages use mocked content and placeholder flows.

## Important Docs
Start here if you want the implementation/planning context:
- `docs/00-governance/01-master-index.md`
- `docs/00-governance/31-implementation-change-log.md`
- `docs/00-governance/32-implementation-context-log.md`

## Next Recommended Work
- synchronize the design docs with the implemented premium UI
- build the module/workspace foundations
- connect real backend/auth/data flows later
