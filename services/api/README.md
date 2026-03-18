# Backend Service

## What This Is
This is the Python backend service for D-ARCHIE.

Current state:
- FastAPI backend shell is implemented.
- Shared app boot, router registration, request context, DB wiring, error handling, and event staging are available.
- Identity and access plus the first orchestration runtime slice are implemented.
- Runtime startup now bootstraps the local database schema and seeds a small dev user set for manual testing.

## Stack
- Python 3.12
- FastAPI
- SQLAlchemy
- uv
- pytest

## Main Entry Point
- `app/main.py`

## Run Commands
From `/workspace/DARCHIE/services/api`:

```bash
uv sync --group dev
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Test Commands
From `/workspace/DARCHIE/services/api`:

```bash
uv run pytest
```

## Local Runtime Bootstrap
On server startup, the backend now:
- creates the SQLAlchemy tables in the configured database
- seeds local dev users and roles when `SEED_DEV_DATA=true`

Default seeded users:
- candidate: `candidate-1` / `candidate@example.com` / password `secret123`
- admin: `admin-1` / `admin@example.com` / password `admin123`
- recruiter: `recruiter-1` / `recruiter@example.com` / password `recruiter123`
- reviewer: `reviewer-1` / `reviewer@example.com` / password `review123`

Useful manual-test headers:

```bash
x-actor-id: candidate-1
x-roles: candidate
```

## Important Environment
Expected from the devcontainer:

```bash
DATABASE_URL
REDIS_URL
BACKEND_HOST
BACKEND_PORT
ENABLE_RUNTIME_BOOTSTRAP
SEED_DEV_DATA
```
