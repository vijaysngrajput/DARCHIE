# D-ARCHIE Unified Execution Backlog

## 1. Purpose
This backlog converts component CDS task packs into execution-ready epics, features, and tasks for the code engine.

Task format:
- `Epic`: domain/workstream
- `Feature`: grouped CDS capability
- `Task`: concrete implementation unit with source CDS, target files, dependencies, and acceptance

## 2. Epic A: Backend Shell
Source:
- [`Backend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-CDS.md)
- [`Backend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-Task-Pack.md)

### Feature A1: FastAPI App Skeleton
Task A1.1
- Implement `services/api/app/main.py`.
- Source CDS: section 3.1.
- Dependencies: none.
- Acceptance: app instance boots and root router registers.

Task A1.2
- Implement `services/api/app/api/router.py`.
- Source CDS: sections 3.2 and 4.
- Dependencies: A1.1.
- Acceptance: root router supports module-router registration.

Task A1.3
- Implement `services/api/app/api/exception_handlers.py`.
- Source CDS: sections 3.4 and 6.
- Dependencies: A1.1.
- Acceptance: shared domain errors map to stable `ErrorResponse`.

### Feature A2: Shared Runtime Infrastructure
Task A2.1
- Implement `services/api/app/core/config.py`.
- Source CDS: section 3.5.
- Dependencies: none.
- Acceptance: typed settings object exists for runtime configuration.

Task A2.2
- Implement `services/api/app/core/database.py`.
- Source CDS: sections 3.6 and 7.
- Dependencies: A2.1.
- Acceptance: SQLAlchemy engine, session factory, and transaction helper exist.

Task A2.3
- Implement `services/api/app/core/events.py`.
- Source CDS: sections 3.7 and 7.
- Dependencies: A2.2.
- Acceptance: `DomainEventPublisher.stage(...)` is usable by domain modules.

Task A2.4
- Implement `services/api/app/api/dependencies.py`.
- Source CDS: section 5.
- Dependencies: A2.2, A2.3.
- Acceptance: request context, DB session, and event publisher are injectable.

### Feature A3: Shell Validation
Task A3.1
- Add backend shell unit tests.
- Source CDS: section 9.
- Dependencies: A1.1 to A2.4.
- Acceptance: request context, exception handler, and event publisher tests pass.

## 3. Epic B: Identity and Access
Source:
- [`Identity-and-Access-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-CDS.md)
- [`Identity-and-Access-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-Task-Pack.md)

### Feature B1: Auth Session APIs
Task B1.1
- Implement identity router and auth DTOs.
- Target files: `router.py`, `schemas/auth.py`.
- Dependencies: Epic A.
- Acceptance: login/logout/me/refresh routes compile and use typed DTOs.

Task B1.2
- Implement `AuthenticationService` and `AccessSessionService`.
- Target files: `auth_service.py`, `session_service.py`.
- Dependencies: B1.1.
- Acceptance: login, logout, refresh, and current-user flows exist.

### Feature B2: Authorization and Permissions
Task B2.1
- Implement `AuthorizationService` and `permissions.py`.
- Dependencies: B1.2.
- Acceptance: deny-by-default and role/resource checks are centralized.

Task B2.2
- Implement `schemas/access.py` and access routes.
- Dependencies: B2.1.
- Acceptance: access-check and access-context APIs work through auth context.

### Feature B3: Identity Persistence and Tests
Task B3.1
- Implement identity ORM models and repositories.
- Dependencies: Epic A.
- Acceptance: user, role, session, grant, and audit entities persist through repositories.

Task B3.2
- Add auth/access unit and integration tests.
- Dependencies: B1.2, B2.2, B3.1.
- Acceptance: login flow, deny-by-default, and role assignment tests pass.

## 4. Epic C: Assessment Orchestration
Source:
- [`Assessment-Orchestration-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-CDS.md)
- [`Assessment-Orchestration-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-Task-Pack.md)

### Feature C1: Session APIs and DTOs
Task C1.1
- Implement orchestration router and schemas.
- Dependencies: Epic A, Epic B.
- Acceptance: session and progression endpoints compile and are auth-aware.

Task C1.2
- Implement `AssessmentSessionService`.
- Dependencies: C1.1.
- Acceptance: create/start/resume/cancel/get summary/current-unit/progress methods exist.

### Feature C2: Progression and State
Task C2.1
- Implement `SessionStateMachine` and `TimingAttemptPolicyService`.
- Dependencies: C1.2.
- Acceptance: state transitions and timing/attempt checks are enforceable.

Task C2.2
- Implement `ProgressionService` and `GatingService`.
- Dependencies: C2.1.
- Acceptance: submission progression, next-step evaluation, and gating refresh work.

### Feature C3: Persistence, Integrations, and Tests
Task C3.1
- Implement orchestration ORM models and repositories.
- Dependencies: Epic A.
- Acceptance: session, task state, component state, gating, and transition log persistence exist.

Task C3.2
- Implement content/response/scoring client interfaces and dependencies.
- Dependencies: C2.2, C3.1.
- Acceptance: orchestration integration points are wired without tight cross-module coupling.

Task C3.3
- Add orchestration tests.
- Dependencies: C2.2, C3.2.
- Acceptance: create-session, current-unit, gating, and invalid transition tests pass.

## 5. Epic D: Response Capture and Persistence
Source:
- [`Response-Capture-and-Persistence-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-CDS.md)
- [`Response-Capture-and-Persistence-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-Task-Pack.md)

### Feature D1: Draft and Finalize APIs
Task D1.1
- Implement response router and DTOs.
- Dependencies: Epic A, Epic B.
- Acceptance: draft, finalize, artifact, and summary routes exist and are auth-aware.

Task D1.2
- Implement `ResponseCaptureService`.
- Dependencies: D1.1, Epic C.
- Acceptance: draft save, fetch, finalize, and summary behaviors exist.

### Feature D2: Artifact and Checkpoint Integration
Task D2.1
- Implement `ResponseArtifactService`.
- Dependencies: D1.2.
- Acceptance: artifact metadata creation supports draft/submission linkage.

Task D2.2
- Implement orchestration eligibility client and checkpoint signaling.
- Dependencies: D1.2, Epic C.
- Acceptance: finalization checks and checkpoint updates work through integration interface.

### Feature D3: Persistence and Tests
Task D3.1
- Implement response ORM models and repositories.
- Dependencies: Epic A.
- Acceptance: draft, submission, artifact, and checkpoint persistence exist.

Task D3.2
- Add response capture tests.
- Dependencies: D1.2, D2.2, D3.1.
- Acceptance: draft idempotency, immutable final submission, and submission-event tests pass.

## 6. Epic E: Frontend Candidate Slice
Source:
- [`Frontend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-CDS.md)
- [`Frontend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Task-Pack.md)

### Feature E1: Route and Layout Skeleton
Task E1.1
- Implement public login route and role-area layouts.
- Dependencies: Epic B.
- Acceptance: guarded candidate route tree exists.

Task E1.2
- Implement candidate session landing and task page routes.
- Dependencies: E1.1, Epic C.
- Acceptance: candidate can navigate to session landing and task shell.

### Feature E2: API Client and State Layer
Task E2.1
- Implement frontend API client modules for auth, sessions, and responses.
- Dependencies: Epic B, Epic C, Epic D.
- Acceptance: typed API functions exist for current user, session, current unit, progress, and draft save.

Task E2.2
- Implement `useCurrentUser`, `useCandidateSession`, and `useAutosaveDraft`.
- Dependencies: E2.1.
- Acceptance: hooks provide auth/session/autosave state without undefined contracts.

### Feature E3: Candidate Components and Tests
Task E3.1
- Implement `AuthGate`, `SessionLandingCard`, `TaskShell`, `ResponseEditorShell`, `ProgressHeader`, and `AutosaveStatusBadge`.
- Dependencies: E2.2.
- Acceptance: candidate flow renders and preserves local editor state on save failure.

Task E3.2
- Add frontend component, hook, and route tests.
- Dependencies: E3.1.
- Acceptance: route guard, task rendering, and autosave state tests pass.

## 7. Epic F: Assessment Content Management
Execution window:
- after first candidate slice demo is stable.

Features:
- authoring CRUD
- version lifecycle and validation
- publish flow
- runtime payload generation

Dependencies:
- Epic A

Acceptance:
- published runtime payload replaces seeded content assumptions

## 8. Epic G: Scoring and Evaluation
Execution window:
- after content runtime payload is stable.

Features:
- evaluation-path resolution
- scoring execution
- review flow
- score aggregation
- readiness signaling

Dependencies:
- Epic A
- Epic C
- Epic D
- Epic F

Acceptance:
- finalized score payload is emitted and ready for reporting

## 9. Epic H: Reporting and Analytics
Execution window:
- after finalized score payload is stable.

Features:
- read-model refresh
- scorecards
- component insights
- comparisons

Dependencies:
- Epic A
- Epic B
- Epic G

Acceptance:
- recruiter-facing reporting works from finalized scores only

## 10. Epic I: Notification / Audit / Support
Execution window:
- can start in parallel for hardening after first slice, but should not block Milestones 0 through 4.

Features:
- append-only audit
- notification request and delivery
- support event recording

Dependencies:
- Epic A
- Epic B
- state-changing flows in Epics C, D, F, G, H

Acceptance:
- privileged changes and async notifications are durable and auditable

## 11. First-Slice Exit Gate
The code engine should consider the first implementation slice complete only when all of the following are true:
- candidate can authenticate
- candidate can open a session landing page
- candidate can fetch current task and progress
- candidate can save a draft response
- unauthorized access is blocked
- backend and frontend tests for the slice pass

## 12. Backlog Execution Rules
- Do not start Epics F through I before Epics A through E produce one working candidate flow.
- Each task implementation must reference its source CDS and keep file/class/method ownership unchanged.
- Cross-domain integrations must use declared clients and event contracts, not ad hoc imports.
- If a task reveals a missing contract, update the execution docs before broadening implementation.
