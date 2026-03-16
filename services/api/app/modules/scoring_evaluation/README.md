# Scoring and Evaluation Module

## What This Is
This module will own evaluation execution, review handling, score aggregation, readiness updates, and finalized score emission.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /evaluations/_health
```

## Current Check
```bash
curl http://localhost:8000/evaluations/_health
```

## Planned Next Work
- evaluation execution service
- evaluation path resolver
- review flow
- aggregation service
- readiness signaling
- score persistence and tests
