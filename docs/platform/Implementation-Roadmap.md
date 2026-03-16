# D-ARCHIE Implementation Roadmap

## 1. Purpose
This document defines the implementation sequence, milestone structure, and dependency order for converting the D-ARCHIE design stack into a working product.

Source planning stack:
- [`BRD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/BRD.md)
- component HLDs
- component LLDs
- component CDS documents
- domain task packs

## 2. Delivery Strategy
Implementation should proceed as `candidate-first vertical slices`, not as isolated domain completion.

Execution rule:
- build only enough of each domain to enable one usable end-to-end workflow,
- validate the workflow,
- then layer in dependent domains that enrich or extend the platform.

The first production-worthy flow is:
- login/auth context
- candidate session landing
- current task retrieval
- draft save
- progress/status response

## 3. Milestone Sequence
### Milestone 0: Repo and Runtime Bootstrap
Goal:
- establish runnable backend and frontend application shells.

Domains:
- Backend
- Frontend

Outputs:
- FastAPI app shell boots
- Next.js app shell boots
- shared request context scaffolding exists
- shared error handling and route registration exist
- frontend role-based route skeleton exists

Entry criteria:
- CDS and task packs complete for first-slice domains.

Exit criteria:
- backend and frontend shells run locally
- no business workflow yet required

### Milestone 1: Identity and Access Foundation
Goal:
- establish authentication, access session, and role/resource protection required for protected candidate flow.

Domains:
- Identity and Access
- Backend integration
- Frontend auth gate

Outputs:
- login/logout/me/refresh APIs
- access context and deny-by-default policy
- route guards for candidate area
- request context propagation from backend to domain modules

Exit criteria:
- authenticated candidate can enter protected frontend area
- unauthorized access is blocked consistently

### Milestone 2: Candidate Session Runtime
Goal:
- enable session creation, start, current-unit resolution, and progress retrieval.

Domains:
- Assessment Orchestration
- Backend integration
- Frontend candidate session shell

Outputs:
- session APIs and state machine
- orchestration repositories/models
- current-unit and progress APIs
- candidate session landing page and task shell load path

Exit criteria:
- authenticated candidate can open a session and see current task metadata

### Milestone 3: Draft Save and Submission Foundation
Goal:
- enable response draft persistence and final submission path.

Domains:
- Response Capture and Persistence
- Assessment Orchestration integration
- Frontend autosave and response editor shell

Outputs:
- draft save API
- finalize response API
- checkpoint signaling to orchestration
- autosave hook and UI state

Exit criteria:
- candidate can enter response content, autosave draft, and see save/progress status

### Milestone 4: Candidate First-View Validation
Goal:
- prove one working end-to-end candidate flow.

Domains:
- Backend
- Identity and Access
- Assessment Orchestration
- Response Capture and Persistence
- Frontend

Outputs:
- integrated test path for login -> session landing -> current task -> draft save
- stable error handling for auth/session/draft failures
- first vertical slice ready for design and product validation

Exit criteria:
- working demo path exists
- slice is testable without content authoring, scoring, or reporting completion

### Milestone 5: Content Authoring and Published Runtime Content
Goal:
- enable internal content operations and replace assumed seed content with governed authored content.

Domains:
- Assessment Content Management
- Backend integration
- Admin frontend area

Outputs:
- authoring, validation, review, publish flows
- immutable published runtime payload
- admin authoring shell

Exit criteria:
- published assessment content can drive orchestration without manual seeding assumptions

### Milestone 6: Evaluation and Review
Goal:
- enable scoring, review, readiness signaling, and score finalization.

Domains:
- Scoring and Evaluation
- Assessment Content Management integration
- Assessment Orchestration integration
- Reviewer frontend area

Outputs:
- evaluation start/review/score APIs
- finalized score event payload
- readiness signaling back to orchestration

Exit criteria:
- submitted responses can produce finalized score outputs

### Milestone 7: Reporting and Decision Support
Goal:
- expose recruiter and hiring-manager scorecards and comparison views.

Domains:
- Reporting and Analytics
- Frontend recruiting area
- Identity/access scope enforcement

Outputs:
- report refresh flow
- candidate scorecards
- component insights
- basic comparisons

Exit criteria:
- finalized scores are visible through recruiter-facing reporting

### Milestone 8: Operational Hardening
Goal:
- add operational support, audit durability, notification flow, and platform hardening.

Domains:
- Notification / Audit / Support
- observability hardening across all prior domains

Outputs:
- append-only audit
- notification request and delivery flow
- support event tracking
- operational alerts and reviewability

Exit criteria:
- privileged actions and critical state changes are auditable
- async support behavior is durable and retry-safe

## 4. Dependency Matrix
### 4.1 First-Slice Critical Dependencies
- Backend -> all backend runtime domains
- Identity and Access -> required before protected candidate routes
- Assessment Orchestration -> depends on backend shell and identity context
- Response Capture -> depends on orchestration eligibility and backend shell
- Frontend candidate slice -> depends on identity, orchestration, response APIs

### 4.2 Later Dependencies
- Content Management -> required before full internal authoring workflow and production-grade runtime content management
- Scoring -> depends on content metadata and response submission events
- Reporting -> depends on finalized scoring outputs
- Notification / Audit / Support -> cross-cutting, but can harden after first working slice

## 5. Code Engine Start Rule
The code engine should not start with all domains at once.

Start order for implementation:
1. [`Backend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-Task-Pack.md)
2. [`Identity-and-Access-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-Task-Pack.md)
3. [`Assessment-Orchestration-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-Task-Pack.md)
4. [`Response-Capture-and-Persistence-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-Task-Pack.md)
5. [`Frontend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/frontend/Frontend-Task-Pack.md)

All later task packs remain backlog-ready but should not preempt the candidate-first slice.

## 6. Milestone Acceptance
Implementation is ready to move from roadmap to coding when:
- first-slice CDS documents are frozen,
- first-slice backlog tasks are dependency-ordered,
- one thin end-to-end flow is defined as the initial success metric,
- later domains are backlog-prepared but not allowed to derail milestone 1 through 4.
