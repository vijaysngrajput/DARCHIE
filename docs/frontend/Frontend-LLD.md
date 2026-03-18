# D-ARCHIE Frontend Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design of the shared role-based web app.

Parent documents:
- [`Frontend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-HLD.md)
- [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md)

## 2. Top-Level App Areas
- `/app/(public)/*`
- `/app/candidate/*`
- `/app/recruiting/*`
- `/app/admin/*`
- `/app/reviewer/*`

Hiring manager uses recruiting area with narrower access.

## 3. Shell Variants
### 3.1 Public Shell
- simplified top header,
- no persistent left navigation,
- two-panel entry layout support,
- lightweight utility footer.

### 3.2 Candidate Shell
- top header,
- compact candidate side navigation,
- stable shell chrome,
- specialized task workspace inside shell for `/candidate/sessions/[sessionId]/task`.

### 3.3 Recruiting Shell
- top header,
- full left nav,
- list/detail workspace structure,
- filter/action region support.

### 3.4 Admin Shell
- top header,
- full left nav,
- command bar,
- central editor canvas,
- optional inspector rail.

### 3.5 Reviewer Shell
- top header,
- full left nav,
- queue list shell,
- split-pane review workspace.

## 4. Route Groups
The detailed route inventory is defined in [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md). This LLD freezes runtime route groups, shell ownership, and UI-state rules.

### 4.1 Candidate
- login entry handoff
- session landing
- task workspace
- completion confirmation

### 4.2 Recruiting
- candidate list
- candidate scorecard
- component insight
- comparison view

### 4.3 Admin
- assessment list
- assessment overview
- editor shell
- review shell
- publish shell
- library shell

### 4.4 Reviewer
- review queue
- review detail
- review completion

## 5. Shared Frontend State
- authenticated user context,
- role-aware navigation state,
- shell collapse/drawer state,
- active assessment/session context,
- draft save status,
- loading/error banners,
- delayed transition indicator state.

## 6. Candidate First-View Slice
Required screens/components:
- public entry shell,
- auth gate / candidate shell,
- session landing page,
- task workspace,
- response editor shell,
- progress rail,
- autosave indicator,
- utility footer.

## 7. Frontend-to-Backend API Contracts
### 7.1 Candidate
- `POST /auth/login`
- `GET /auth/me`
- `GET /candidate/sessions/{id}/landing-view`
- `GET /candidate/sessions/{id}/task-view`
- `POST /responses/draft`
- `POST /responses/finalize`

### 7.2 Recruiting
- `GET /reports/candidates/{candidateId}`
- `GET /reports/candidates/{candidateId}/components`
- `GET /reports/comparisons`

### 7.3 Admin
- content authoring and publish API groups from backend

### 7.4 Reviewer
- review queue and review submit API groups

## 8. UI State Rules
- protected areas load shell chrome consistently before route-specific content settles,
- candidate session page must not destroy shell chrome while session data resolves,
- candidate task page must keep workspace-shaped loading skeletons,
- status and error regions must reserve space where they appear,
- fast actions must not flash immediate transition overlays,
- delayed progress overlays appear only when an action exceeds the transition threshold.

## 9. Autosave Behavior
- debounced draft save on supported response changes,
- save payload keyed by `sessionId + taskId`,
- on save success update indicator and last-saved timestamp,
- on save failure preserve local state and show recoverable error.

## 10. Access Guards
- route-level guard by role area,
- resource-level guard by backend response permission,
- unauthorized views redirect to safe landing page,
- shell should degrade to access-denied view without collapsing app chrome abruptly.

## 11. Failure Handling
- auth failure -> redirect to login/entry,
- missing session/task -> show recoverable unavailable state inside shell,
- draft save failure -> non-destructive warning,
- report unavailable -> report-specific empty/error state.

## 12. Observability
- capture route load timings,
- candidate task render timings,
- autosave success/failure,
- major API failure counts,
- transition-overlay frequency and duration.

## 13. Implementation Readiness Checklist
- route map frozen,
- shell variants frozen,
- first slice screen list frozen,
- design tokens frozen,
- autosave behavior frozen,
- access-guard strategy frozen,
- route-to-layout mapping frozen.
