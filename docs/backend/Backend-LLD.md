# D-ARCHIE Backend Low-Level Design (LLD)

## 1. Purpose
This document defines the application-shell design for the modular monolith backend.

Parent document:
- [`Backend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-HLD.md)

## 2. Module Composition
Backend modules:
- `identity_access`
- `assessment_orchestration`
- `assessment_content_management`
- `response_capture`
- `scoring_evaluation`
- `reporting_analytics`
- `support_services`

Shared technical layers:
- API/Web layer
- request context layer
- validation layer
- transaction coordination layer
- storage adapters
- event dispatch layer
- audit/observability layer

## 3. API Grouping
### 3.1 Candidate APIs
- auth context
- assessment/session
- task retrieval
- draft/final response submission
- progress/status

### 3.2 Recruiter/Hiring Manager APIs
- assignment
- report retrieval
- comparison retrieval

### 3.3 Admin APIs
- content authoring
- content review/publish
- privileged operational inspection

### 3.4 Reviewer APIs
- review queue
- review submission
- evaluation state queries

## 4. Request Context Model
Each request context must include:
- request id
- authenticated user id
- role set
- tenant/org scope if applicable later
- audit metadata
- transaction boundary metadata for mutating requests

## 5. Runtime Coordination Rules
- Backend routes to exactly one primary domain module per command.
- Cross-module updates use events or explicit orchestrated service calls.
- Mutating requests must define one clear transaction owner.
- Long-running work must dispatch through async job/event layer.

## 6. Response Capture Inclusion
Response persistence remains in backend scope for MVP.

Primary commands:
- save draft response
- submit final response
- upload/link artifact metadata
- fetch response summary for authorized module use

## 7. Storage Boundaries
- Relational store:
  - operational entities
- Object store:
  - response artifacts
- Cache:
  - request/session acceleration
  - read-heavy lookups
- Event bus / queue:
  - scoring triggers
  - report refresh triggers
  - support notifications

## 8. Error Model
Standard backend error classes:
- authentication failure
- authorization failure
- validation failure
- resource not found
- conflict / invalid state transition
- downstream dependency unavailable

Mutating requests must return stable error categories and never expose internal module details directly.

## 9. Sequence Flows
### 9.1 Candidate Task Load
Frontend -> Backend candidate API -> identity check -> orchestration current unit -> content/task retrieval -> response payload

### 9.2 Draft Save
Frontend -> Backend response API -> identity check -> validation -> response capture write -> optional orchestration checkpoint signal -> response

### 9.3 Final Submission
Frontend -> Backend response API -> identity check -> response persistence -> dispatch scoring/orchestration events -> response

## 10. Validation and Invariants
- All protected APIs require authenticated request context.
- All mutating APIs require authorization before domain execution.
- Response final submission must not bypass session/task ownership checks.
- Admin/reviewer routes must not be callable by candidate role.

## 11. Failure and Retry
- Async dispatch uses idempotent event keys.
- Draft save is upsert by `sessionId + taskId + attemptNo`.
- Final submission is idempotent by submission marker.
- Partial failure after persistence but before dispatch must be recoverable via retryable outbox/event mechanism.

## 12. Observability
- structured logs on every mutating request
- trace propagation across module and event boundaries
- metrics:
  - request latency by API group
  - submission volume
  - auth failure rate
  - async dispatch backlog

## 13. Implementation Readiness Checklist
- API group map frozen
- request context fields frozen
- transaction ownership rules frozen
- error class map frozen
