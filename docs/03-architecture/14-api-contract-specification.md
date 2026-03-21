# 14 API Contract Specification

## Purpose
Define the app-facing and internal APIs for DARCHIE v1.

## Decisions This Document Owns
- API style
- endpoint inventory
- request and response shapes
- auth and error conventions

## Inputs / Dependencies
- `docs/03-architecture/11-high-level-design.md`
- `docs/03-architecture/12-low-level-design.md`
- `docs/03-architecture/13-domain-model-data-model-spec.md`

## Required Sections
- API conventions
- endpoint list
- auth rules
- error model

## Output Format
REST API contract document.

## Completion Criteria
- Frontend and backend can implement against stable contracts.

## API Conventions
- Style: JSON REST under `/api`
- Auth: cookie-based session from Supabase auth, validated on protected routes
- Versioning: internal v1 without public version prefix; breaking changes require route-level migration
- Validation: all request bodies validated with Zod before processing

## Endpoint Inventory
### Public
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Onboarding And Profile
- `GET /api/me`
- `PATCH /api/me/profile`
- `POST /api/me/onboarding/complete`

### Catalog
- `GET /api/exercises?module=&difficulty=&tag=&page=`
- `GET /api/exercises/:id`
- `GET /api/modules/overview`

### Attempts
- `GET /api/attempts/:exerciseId/current`
- `PUT /api/attempts/:exerciseId/draft`
- `POST /api/attempts/:exerciseId/run`
- `POST /api/attempts/:exerciseId/submit`
- `GET /api/submissions/:submissionId`

### Progress
- `GET /api/progress/overview`
- `GET /api/progress/module/:moduleId`

### Mock Interviews
- `POST /api/mock-interviews`
- `GET /api/mock-interviews/:sessionId`
- `POST /api/mock-interviews/:sessionId/complete`

### Billing
- `GET /api/billing/status`
- `POST /api/billing/checkout-session`
- `POST /api/webhooks/stripe`

## Example Response Shapes
### `GET /api/exercises/:id`
```json
{
  "exercise": {
    "id": "ex_sql_001",
    "title": "Daily Active Users by Platform",
    "module": "sql",
    "difficulty": "interview-ready",
    "estimatedMinutes": 25,
    "prompt": "...",
    "starterState": {},
    "datasets": []
  },
  "draftAttempt": null,
  "entitlement": {
    "canAttempt": true,
    "plan": "free"
  }
}
```

### `POST /api/attempts/:exerciseId/submit`
```json
{
  "submissionId": "sub_123",
  "status": "queued"
}
```

### `POST /api/attempts/:exerciseId/run`
```json
{
  "status": "success",
  "summary": "Returned 8 rows from the sandboxed SQL dataset.",
  "columns": ["cohort_week", "active_week", "retained_users"],
  "rows": [[1, 1, 2]],
  "rowCount": 8,
  "explanation": "Use run previews to inspect shaped output before final submission."
}
```

## Internal Service Contract
- `POST /internal/evaluations/run`
- signed with internal service token
- accepted only from application backend
- payload includes normalized exercise and submission data

## Error Model
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Node configuration is incomplete",
    "details": {
      "field": "batchSize"
    }
  }
}
```

## Auth Rules
- All `/api/me`, `/api/attempts`, `/api/progress`, `/api/mock-interviews`, and `/api/billing/status` routes require authentication.
- Premium-only exercises return `403` with entitlement metadata.
- Internal evaluation routes require service authentication and are never exposed to the browser.
- Current implementation exception: the first SQL preview slice may expose exercise load, draft, run, and submit without full auth while preview-access rules remain under product definition.
