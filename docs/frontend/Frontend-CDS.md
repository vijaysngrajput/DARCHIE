# D-ARCHIE Frontend Component Design Spec (CDS)

## 1. Purpose
This document converts the frontend LLD into code-generation-ready design for the shared web app.

Parent documents:
- [`Frontend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-HLD.md)
- [`Frontend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-LLD.md)

Assumed frontend stack:
- Next.js App Router
- React
- TypeScript
- role-based shared web app

## 2. Canonical Frontend Layout
```text
apps/web/src/
  app/
    (public)/login/page.tsx
    candidate/
      layout.tsx
      sessions/[sessionId]/page.tsx
      sessions/[sessionId]/task/page.tsx
      sessions/[sessionId]/complete/page.tsx
    recruiting/
      layout.tsx
      candidates/[candidateId]/page.tsx
      comparisons/page.tsx
    admin/
      layout.tsx
      assessments/page.tsx
    reviewer/
      layout.tsx
      queue/page.tsx
      reviews/[reviewId]/page.tsx
  components/
    auth/
    candidate/
    recruiting/
    admin/
    reviewer/
    shared/
  lib/
    api/
    auth/
    routing/
    state/
    telemetry/
  hooks/
  tests/
```

## 3. Route and Screen Ownership
### 3.1 Candidate Routes
- `candidate/layout.tsx`
  - role guard and candidate nav shell
- `candidate/sessions/[sessionId]/page.tsx`
  - session landing screen
- `candidate/sessions/[sessionId]/task/page.tsx`
  - current task shell and response editor host
- `candidate/sessions/[sessionId]/complete/page.tsx`
  - completion screen

### 3.2 Recruiting Routes
- candidate scorecard page
- component comparison page

### 3.3 Admin Routes
- assessment list shell only in first pass

### 3.4 Reviewer Routes
- queue shell and review detail shell

## 4. UI Components to Generate
### 4.1 Candidate First Slice
- `AuthGate`
- `SessionLandingCard`
- `TaskShell`
- `ResponseEditorShell`
- `ProgressHeader`
- `AutosaveStatusBadge`
- `CandidateErrorBanner`

### 4.2 Shared Components
- `RoleAreaLayout`
- `LoadingState`
- `EmptyState`
- `ApiErrorState`

## 5. API Client Modules
```text
lib/api/
  auth.ts
  sessions.ts
  responses.ts
  reports.ts
```

Required exports:
```ts
export async function fetchCurrentUser(): Promise<CurrentUser>;
export async function fetchSession(sessionId: string): Promise<SessionSummary>;
export async function fetchCurrentUnit(sessionId: string): Promise<CurrentUnit>;
export async function fetchProgress(sessionId: string): Promise<ProgressState>;
export async function saveDraft(input: SaveDraftRequest): Promise<DraftSaveResult>;
export async function finalizeResponse(input: FinalizeResponseRequest): Promise<FinalizeResponseResult>;
```

## 6. State and Hook Contracts
```text
lib/state/
  auth-store.ts
  candidate-session-store.ts
hooks/
  useCurrentUser.ts
  useCandidateSession.ts
  useAutosaveDraft.ts
```

Hook signatures:
```ts
function useCurrentUser(): { user: CurrentUser | null; loading: boolean; error: string | null };
function useCandidateSession(sessionId: string): CandidateSessionViewModel;
function useAutosaveDraft(input: UseAutosaveDraftInput): UseAutosaveDraftResult;
```

## 7. Types to Freeze
```ts
type DraftSaveStatus = "idle" | "saving" | "saved" | "error";

interface CurrentUser {
  userId: string;
  roles: string[];
}

interface CurrentUnit {
  sessionId: string;
  componentId: string | null;
  taskId: string | null;
  taskState: string;
  gated: boolean;
}
```

## 8. Interaction Rules
- Protected routes must resolve current user before rendering role areas.
- Candidate task page must load session summary, current unit, and progress before showing editor.
- Autosave must debounce client changes and call `saveDraft`.
- Autosave failures must not discard local editor state.
- Unauthorized API responses must redirect to the login or safe landing page.

## 9. Test Targets
- Component tests:
  - `TaskShell`
  - `AutosaveStatusBadge`
  - `AuthGate`
- Hook tests:
  - `useAutosaveDraft`
  - `useCandidateSession`
- Route tests:
  - candidate session landing
  - candidate task page guard behavior

## 10. Code Engine Acceptance
A code engine implementing this CDS must generate the route tree above, the first-slice candidate components, typed API client modules, state hooks for auth/session/autosave, and tests proving candidate session load, current-task rendering, and autosave status transitions.
