# D-ARCHIE Frontend Component Design Spec (CDS)

## 1. Purpose
This document converts the frontend LLD into code-generation-ready design for the shared web app.

Parent documents:
- [`Frontend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-HLD.md)
- [`Frontend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-LLD.md)
- [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md)

Assumed frontend stack:
- Next.js App Router
- React
- TypeScript
- role-based shared web app

## 2. Canonical Frontend Layout
The route tree below is constrained by the page inventory, shell variants, and layout grammar in [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md).

```text
apps/web/src/
  app/
    layout.tsx
    (public)/
      layout.tsx
      login/page.tsx
    candidate/
      layout.tsx
      sessions/[sessionId]/page.tsx
      sessions/[sessionId]/task/page.tsx
      sessions/[sessionId]/complete/page.tsx
    recruiting/
      layout.tsx
      candidates/page.tsx
      candidates/[candidateId]/page.tsx
      candidates/[candidateId]/components/[componentId]/page.tsx
      comparisons/page.tsx
    admin/
      layout.tsx
      assessments/page.tsx
      assessments/[assessmentId]/page.tsx
      assessments/[assessmentId]/versions/[versionId]/editor/page.tsx
      assessments/[assessmentId]/versions/[versionId]/review/page.tsx
      assessments/[assessmentId]/versions/[versionId]/publish/page.tsx
      library/page.tsx
    reviewer/
      layout.tsx
      queue/page.tsx
      reviews/[reviewId]/page.tsx
      reviews/[reviewId]/complete/page.tsx
  components/
    auth/
    candidate/
    recruiting/
    admin/
    reviewer/
    shell/
    shared/
  lib/
    api/
    auth/
    routing/
    state/
    telemetry/
    design/
  hooks/
  tests/
```

## 3. Route and Shell Ownership
### 3.1 Public Routes
- `(public)/layout.tsx`
  - public shell with simplified header and utility footer
- `(public)/login/page.tsx`
  - candidate-first entry page

### 3.2 Candidate Routes
- `candidate/layout.tsx`
  - auth gate + candidate shell
- `candidate/sessions/[sessionId]/page.tsx`
  - session landing page
- `candidate/sessions/[sessionId]/task/page.tsx`
  - assessment workspace page
- `candidate/sessions/[sessionId]/complete/page.tsx`
  - completion page

### 3.3 Recruiting Routes
- `recruiting/layout.tsx`
  - recruiting shell
- candidate list, scorecard, evidence detail, and comparison pages

### 3.4 Admin Routes
- `admin/layout.tsx`
  - admin shell
- assessment index, overview, editor, review, publish, and library pages

### 3.5 Reviewer Routes
- `reviewer/layout.tsx`
  - reviewer shell
- queue, review detail, and completion pages

## 4. Shell and Primitive Components to Generate
### 4.1 Shell Chrome
- `AppHeader`
- `SideNav`
- `UtilityFooter`
- `RoleAreaLayout`
- `TransitionOverlay`

### 4.2 Candidate First Slice
- `AuthGate`
- `SessionLandingCard`
- `TaskShell`
- `ResponseEditorShell`
- `ProgressHeader`
- `AutosaveStatusBadge`
- `CandidateErrorBanner`
- `CandidatePageSkeletons`

### 4.3 Shared Primitives
- `PageSection`
- `SurfaceCard`
- `InfoTile`
- `ActionBar`
- `StatusBadge`
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
  admin.ts
  reviewer.ts
```

Required candidate exports:
```ts
export async function fetchCurrentUser(): Promise<CurrentUser>;
export async function login(input: LoginRequest): Promise<CurrentUser>;
export async function fetchCandidateLandingView(sessionId: string): Promise<CandidateLandingView>;
export async function fetchCandidateTaskView(sessionId: string): Promise<CandidateTaskView>;
export async function saveDraft(input: SaveDraftRequest): Promise<DraftSaveResult>;
export async function finalizeResponse(input: FinalizeResponseRequest): Promise<FinalizeResponseResult>;
```

## 6. State and Hook Contracts
```text
lib/state/
  auth-store.ts
  shell-state.ts
  candidate-session-store.ts
hooks/
  useCurrentUser.ts
  useCandidateSession.ts
  useAutosaveDraft.ts
  useDelayedFlag.ts
```

Hook signatures:
```ts
function useCurrentUser(): { user: CurrentUser | null; loading: boolean; error: string | null };
function useCandidateSession(sessionId: string): CandidateSessionViewModel;
function useAutosaveDraft(input: UseAutosaveDraftInput): UseAutosaveDraftResult;
function useDelayedFlag(active: boolean, delayMs?: number): boolean;
```

## 7. Types to Freeze
```ts
type DraftSaveStatus = "idle" | "saving" | "saved" | "error";

type ShellVariant = "public" | "candidate" | "recruiting" | "admin" | "reviewer";

interface CurrentUser {
  userId: string;
  roles: string[];
  displayName?: string;
}

interface CurrentUnit {
  sessionId: string;
  componentId: string | null;
  taskId: string | null;
  taskState: string;
  gated: boolean;
}

interface CandidateLandingView {
  session: SessionSummary;
  currentUnit: CurrentUnit | null;
  progress: ProgressState | null;
}

interface CandidateTaskView {
  session: SessionSummary;
  currentUnit: CurrentUnit;
  progress: ProgressState;
  draft: DraftSummary | null;
  responseSummary?: ResponseSummary | null;
}
```

## 8. Interaction Rules
- protected routes must resolve current user before rendering protected content,
- shell chrome must remain stable while route content resolves,
- candidate task page must load workspace-shaped skeletons before task data is ready,
- autosave must debounce client changes and call `saveDraft`,
- autosave failures must not discard local editor state,
- unauthorized API responses must redirect to login or safe landing page,
- transition overlays must be delayed so fast actions do not flash intermediate UI.

## 9. Test Targets
- shell/layout tests:
  - candidate shell guard behavior
  - utility footer presence
- component tests:
  - `TaskShell`
  - `AutosaveStatusBadge`
  - `AuthGate`
- hook tests:
  - `useAutosaveDraft`
  - `useCandidateSession`
  - `useDelayedFlag`
- route tests:
  - candidate session landing
  - candidate task page guard behavior
  - stable loading-state rendering

## 10. Code Engine Acceptance
A code engine implementing this CDS must generate the route tree above, shared shell chrome, candidate-first components, typed API client modules, state hooks for auth/session/autosave/transition smoothing, and tests proving guarded candidate navigation, current-task rendering, autosave status transitions, and stable loading behavior.
