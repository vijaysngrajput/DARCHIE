# D-ARCHIE Frontend Code Engine Task Pack

Source spec:
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)

## 1. App Structure Tasks
1. Create the Next.js route tree from CDS section 2.
2. Create role layouts for candidate, recruiting, admin, and reviewer areas.
3. Create public login entry page.

## 2. Candidate First Slice Tasks
1. Create `SessionLandingCard`.
2. Create `TaskShell`.
3. Create `ResponseEditorShell`.
4. Create `ProgressHeader`.
5. Create `AutosaveStatusBadge`.
6. Create `CandidateErrorBanner`.

## 3. Client and State Tasks
1. Create API clients in `lib/api`.
2. Create auth and candidate session state stores.
3. Create `useCurrentUser`, `useCandidateSession`, and `useAutosaveDraft`.
4. Freeze shared TypeScript interfaces from CDS section 7.

## 4. Guard and Error Tasks
1. Create `AuthGate`.
2. Implement route guarding and unauthorized redirects.
3. Implement recoverable API error and empty states.

## 5. Test Tasks
1. Add component, hook, and route tests from CDS section 9.
2. Verify autosave state transitions and candidate task-page guard behavior.

## 6. Completion Criteria
- Candidate can reach session landing and task shell through guarded routes.
- Typed API client layer exists.
- Autosave hook and badge work together through shared status states.
- Candidate-route tests pass.
