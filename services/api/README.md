# Backend Service

## What This Is
This is the Python backend service for D-ARCHIE.

Current state:
- FastAPI backend shell is implemented.
- Shared app boot, router registration, request context, DB wiring, error handling, and event staging are available.
- Business domains are present as placeholder module routers and will be implemented incrementally.

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

## Important Environment
Expected from the devcontainer:

```bash
DATABASE_URL
REDIS_URL
BACKEND_HOST
BACKEND_PORT
```

## Current Coverage
Implemented now:
- backend shell
- placeholder routers for all platform backend modules
- backend shell tests

Not yet implemented:
- identity logic
- orchestration logic
- response capture logic
- content, scoring, reporting, support internals
