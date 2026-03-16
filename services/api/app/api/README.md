# API Layer

## What This Is
This folder contains the HTTP-facing backend shell layer.

Current responsibilities:
- root API router
- shared request-scoped dependencies
- shared exception mapping

## Files
- `router.py`: root route registration and shell endpoints
- `dependencies.py`: request context, DB session, event publisher dependencies
- `exception_handlers.py`: stable API error mapping

## Run
From `/workspace/DARCHIE/services/api`:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Tests
```bash
uv run pytest app/tests/unit/test_request_context.py app/tests/unit/test_exception_handlers.py app/tests/integration/test_candidate_request_context.py
```

## Notes
This layer should stay thin. Domain logic belongs in module services, not here.
