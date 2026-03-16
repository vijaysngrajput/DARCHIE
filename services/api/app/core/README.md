# Core Runtime Layer

## What This Is
This folder contains shared backend runtime infrastructure used by all backend modules.

## Files
- `config.py`: application settings
- `database.py`: SQLAlchemy engine and session factory
- `events.py`: domain event staging contract
- `errors.py`: shared API error model and app error type
- `logging.py`: reserved for structured logging helpers
- `security.py`: reserved for shared security helpers

## Run and Validate
From `/workspace/DARCHIE/services/api`:

```bash
uv run pytest app/tests/unit/test_event_publisher.py app/tests/unit/test_exception_handlers.py
```

## Notes
This is the dependency root for all backend runtime modules.
Do not place domain-specific logic here.
