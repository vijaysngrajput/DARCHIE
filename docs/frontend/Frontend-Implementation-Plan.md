# D-ARCHIE Frontend Implementation Plan

## 1. Objective
Implement the shared web app shell and the candidate-first redesign on top of a stable design-system layer.

Primary source docs:
- [`Frontend-Design-Spec.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Design-Spec.md)
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)
- [`Frontend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 0: shell and design tokens
- Milestones 1 through 4: candidate-first redesign
- Later milestones: recruiting, admin, reviewer shells and pages

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell for API targets
- identity APIs for auth gate
- orchestration APIs for session and current-unit
- response APIs for draft save/finalize

Downstream consumers:
- later recruiting/admin/reviewer areas
- reporting-oriented internal experiences

## 3. Local Execution Order
### Phase 0: Design System and Shell Freeze
- freeze shell variants from the design spec
- freeze route-to-layout mapping
- freeze design tokens for color, typography, spacing, radius, shadows, and motion
- freeze utility footer and sidebar behavior

### Phase 1: Shared Shell Chrome
- implement `AppHeader`
- implement `SideNav`
- implement `UtilityFooter`
- implement public, candidate, recruiting, admin, and reviewer layout shells

### Phase 2: Candidate Route Redesign
- redesign public login route inside public shell
- redesign candidate session landing inside candidate shell
- redesign candidate task workspace with left rail + editor surface
- redesign completion page inside candidate shell

### Phase 3: Shared Primitives and State UX
- implement `PageSection`, `SurfaceCard`, `InfoTile`, `ActionBar`, `StatusBadge`
- align loading, error, and empty states to shared shell patterns
- keep delayed transition feedback and stable loading skeleton behavior

### Phase 4: Recruiting/Admin/Reviewer Shell Baselines
- create recruiting list/detail shell placeholders
- create admin canvas/inspector shell placeholders
- create reviewer queue/workspace shell placeholders
- keep these implementation-light but architecturally complete

### Phase 5: Tests and Verification
- add shell-layout tests
- update candidate route/component tests
- verify responsive behavior manually for desktop/tablet/mobile

## 4. First Files and Components
Implement first:
- `app/layout.tsx`
- `app/(public)/layout.tsx`
- `app/candidate/layout.tsx`
- `components/shell/AppHeader.tsx`
- `components/shell/SideNav.tsx`
- `components/shell/UtilityFooter.tsx`
- `app/globals.css`

Core redesign components:
- `SessionLandingCard`
- `TaskShell`
- `ResponseEditorShell`
- `ProgressHeader`
- `TransitionOverlay`
- `CandidatePageSkeletons`

## 5. Local Completion Criteria
- protected role areas share a stable top-header + left-nav shell
- public entry uses a lighter shell with utility footer
- candidate session/task/complete screens match the design spec layout grammar
- candidate task page keeps editor dominant and rail compact
- loading, error, and status regions no longer cause layout instability
- route/component/hook tests pass
- recruiting/admin/reviewer shells exist as structural baselines even if content is still skeletal

## 6. Handoff
This component hands off:
- candidate-first redesigned product surface for validation
- shared shell framework for all later role areas
- design-token and primitive patterns for all future frontend work
- route and layout baseline for recruiting/admin/reviewer implementation
