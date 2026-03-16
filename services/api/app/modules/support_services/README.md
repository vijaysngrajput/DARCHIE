# Notification, Audit, and Support Module

## What This Is
This module will own notification requests, audit logging, support event recording, and later operational hardening flows.

Current state:
- placeholder router exists
- implementation has not started yet

## Current Route
```text
GET /support/_health
```

## Current Check
```bash
curl http://localhost:8000/support/_health
```

## Planned Next Work
- notification request service
- audit writer service
- support event recorder
- delivery worker
- persistence and tests
