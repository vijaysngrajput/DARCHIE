# D-ARCHIE Frontend Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design of the shared role-based web app.

Parent document:
- [`Frontend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-HLD.md)

## 2. Top-Level App Areas
- `/app/candidate/*`
- `/app/recruiting/*`
- `/app/admin/*`
- `/app/reviewer/*`

Hiring manager uses recruiting area with narrower access.

## 3. Route Groups
### 3.1 Candidate
- assessment landing
- session shell
- task screen
- progress/status
- completion screen

### 3.2 Recruiting
- candidate scorecard
- component insight
- comparison view

### 3.3 Admin
- assessment list
- draft editor shell
- review/publish shell
- reusable content library shell

### 3.4 Reviewer
- review queue
- review detail
- review submission confirmation

## 4. Shared Frontend State
- authenticated user context
- role-aware nav state
- active assessment/session context
- draft save status
- loading/error banners

## 5. Candidate First-View Slice
Required screens/components:
- auth gate / entry
- session landing page
- first task view shell
- response editor shell
- progress header
- autosave indicator

## 6. Frontend-to-Backend API Contracts
### 6.1 Candidate
- `GET /auth/me`
- `GET /sessions/{id}`
- `GET /sessions/{id}/current-unit`
- `GET /sessions/{id}/progress`
- `POST /responses/draft`
- `POST /responses/finalize`

### 6.2 Recruiting
- `GET /reports/candidates/{candidateId}`
- `GET /reports/candidates/{candidateId}/components`
- `GET /reports/comparisons`

### 6.3 Admin
- content authoring and publish API groups from backend

### 6.4 Reviewer
- review queue and review submit API groups

## 7. UI State Rules
- role context must load before protected area render.
- Candidate session page must not render task editor until session and current unit both resolve.
- Draft save indicator states:
  - `idle`
  - `saving`
  - `saved`
  - `error`

## 8. Autosave Behavior
- Debounced draft save on supported response changes.
- Save payload keyed by `sessionId + taskId`.
- On save success update indicator and last-saved timestamp.
- On save failure preserve local state and show recoverable error.

## 9. Access Guards
- route-level guard by role area
- resource-level guard by backend response permission
- unauthorized views redirect to safe landing page

## 10. Failure Handling
- auth failure -> redirect to login/entry
- missing session/task -> show recoverable unavailable state
- draft save failure -> non-destructive warning
- report unavailable -> report-specific empty/error state

## 11. Observability
- capture route load timings
- candidate task render timings
- autosave success/failure
- major API failure counts

## 12. Implementation Readiness Checklist
- route map frozen
- first slice screen list frozen
- autosave behavior frozen
- access-guard strategy frozen
