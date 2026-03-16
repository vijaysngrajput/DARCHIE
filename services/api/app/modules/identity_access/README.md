# Identity and Access Module

## What This Is
This module will own authentication, access sessions, authorization, role checks, and protected access evaluation.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /auth/_health
```

## Run Backend
From `/workspace/DARCHIE/services/api`:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Current Check
```bash
curl http://localhost:8000/auth/_health
```

## Planned Next Work
- auth DTOs
- login/logout/me/refresh
- authorization service
- role/resource access checks
- persistence and tests
