# Verification Command Log

## Purpose
This file records the commands used to verify implemented code slices in the devcontainer.

Use it as:
- a repeatable manual verification checklist
- a record of what was actually exercised after implementation
- a quick handoff reference for future debugging or review

All commands below are intended to be run from `/workspace/DARCHIE` unless noted otherwise.

## Backend Shell

### Automated verification
```bash
uv run --directory services/api pytest
```

### App boot verification
```bash
uv run --directory services/api python -c "from app.main import app; print(app.title); print(len(app.routes))"
```

### Basic route smoke checks
```bash
uv run --directory services/api python -c "from fastapi.testclient import TestClient; from app.main import app; c=TestClient(app); print(c.get('/healthz').status_code, c.get('/auth/_health').status_code, c.get('/sessions/_health').status_code, c.get('/responses/_health').status_code)"
```

### Run server locally
```bash
uv run --directory services/api uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Runtime Bootstrap and Seed Data

### Seeded user verification
```bash
curl http://localhost:8000/auth/me \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

Expected:
- `user_id` = `candidate-1`
- role contains `candidate`

## Assessment Orchestration

### Create session
```bash
curl -X POST http://localhost:8000/sessions \
  -H "Content-Type: application/json" \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate" \
  -d '{"assignment_id":"assignment-1","assessment_version_id":"assessment-v1"}'
```

### Start session
```bash
SESSION_ID="<paste-session-id>"

curl -X POST http://localhost:8000/sessions/$SESSION_ID/start \
  -H "Content-Type: application/json" \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate" \
  -d '{}'
```

### Fetch current unit
```bash
curl http://localhost:8000/sessions/$SESSION_ID/current-unit \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

### Fetch progress
```bash
curl http://localhost:8000/sessions/$SESSION_ID/progress \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

## Response Capture and Persistence

### Save draft
```bash
curl -X POST http://localhost:8000/responses/draft \
  -H "Content-Type: application/json" \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate" \
  -d '{
    "session_id":"'$SESSION_ID'",
    "task_id":"task-assessment-v1-1",
    "payload":{"answer":"my draft response"},
    "attempt_no":1
  }'
```

### Fetch draft
```bash
curl http://localhost:8000/responses/draft/$SESSION_ID/task-assessment-v1-1 \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

### Fetch response summary
```bash
curl http://localhost:8000/responses/summary/$SESSION_ID/task-assessment-v1-1 \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

### Finalize response
```bash
curl -X POST http://localhost:8000/responses/finalize \
  -H "Content-Type: application/json" \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate" \
  -d '{
    "session_id":"'$SESSION_ID'",
    "task_id":"task-assessment-v1-1",
    "payload":{"answer":"final response"},
    "submission_key":"submission-key-1",
    "attempt_no":1
  }'
```

### Re-check orchestration progress after finalize
```bash
curl http://localhost:8000/sessions/$SESSION_ID/progress \
  -H "x-actor-id: candidate-1" \
  -H "x-roles: candidate"
```

## Current Expected Automated Result
```text
39 passed
```

## Maintenance Rule
When a new backend slice is implemented, append:
- the automated verification command(s)
- the minimal manual smoke commands
- the expected result or success condition
