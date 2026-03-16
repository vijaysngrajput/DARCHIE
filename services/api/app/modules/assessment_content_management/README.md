# Assessment Content Management Module

## What This Is
This module will own authored assessments, version lifecycle, validation, publish flow, and runtime payload generation.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /content/_health
```

## Current Check
```bash
curl http://localhost:8000/content/_health
```

## Planned Next Work
- authoring service
- version and publish lifecycle
- validation rules
- immutable published runtime payload
- content persistence and tests
