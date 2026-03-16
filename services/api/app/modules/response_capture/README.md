# Response Capture Module

## What This Is
This module will own draft persistence, final submission, artifact linkage, and orchestration checkpoint updates.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /responses/_health
```

## Current Check
```bash
curl http://localhost:8000/responses/_health
```

## Planned Next Work
- draft save API
- final submission API
- artifact metadata handling
- orchestration eligibility integration
- response persistence and tests
