# Assessment Orchestration Module

## What This Is
This module will own session lifecycle, current-unit resolution, progression, and gating behavior for candidate assessments.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /sessions/_health
```

## Current Check
```bash
curl http://localhost:8000/sessions/_health
```

## Planned Next Work
- session APIs
- session service
- state machine
- progression service
- gating service
- orchestration persistence and tests
