# D-ARCHIE Frontend Implementation Plan

## 1. Objective
Implement the shared web app shell and the first candidate-facing vertical slice.

Primary source docs:
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)
- [`Frontend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 0 for shell
- Milestones 1 through 4 for candidate slice

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell for API targets
- identity APIs for auth gate
- orchestration APIs for session and current-unit
- response APIs for draft save

Downstream consumers:
- later recruiting/admin/reviewer areas

## 3. Local Execution Order
### Phase 1: Route Skeleton
- implement public login route
- implement role-based layout skeletons
- implement candidate session and task routes

### Phase 2: API Client Layer
- implement `lib/api/auth.ts`
- implement `lib/api/sessions.ts`
- implement `lib/api/responses.ts`

### Phase 3: State and Hooks
- implement auth state store
- implement candidate session state store
- implement `useCurrentUser`
- implement `useCandidateSession`
- implement `useAutosaveDraft`

### Phase 4: Candidate Components
- implement `AuthGate`
- implement `SessionLandingCard`
- implement `TaskShell`
- implement `ResponseEditorShell`
- implement `ProgressHeader`
- implement `AutosaveStatusBadge`

### Phase 5: Tests
- add component tests
- add hook tests
- add route tests for candidate flow and auth guard behavior

## 4. First Files and Components
Implement first:
- `app/(public)/login/page.tsx`
- `app/candidate/layout.tsx`
- `app/candidate/sessions/[sessionId]/page.tsx`
- `lib/api/auth.ts`
- `lib/api/sessions.ts`

Core components/hooks:
- `AuthGate`
- `SessionLandingCard`
- `TaskShell`
- `ResponseEditorShell`
- `useCurrentUser`
- `useCandidateSession`
- `useAutosaveDraft`

## 5. Local Completion Criteria
- candidate routes are guarded
- session landing page renders from live API data
- current task shell renders from orchestration APIs
- autosave status updates correctly
- local editor state survives save failure
- frontend route/component/hook tests pass

## 6. Handoff
This component hands off:
- candidate first-view demo for validation
- route and layout baseline for later recruiting/admin/reviewer areas
- API client patterns for later frontend features
