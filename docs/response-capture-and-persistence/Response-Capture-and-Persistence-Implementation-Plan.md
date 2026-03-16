# D-ARCHIE Response Capture and Persistence Implementation Plan

## 1. Objective
Implement draft persistence, final submission, artifact linkage, and orchestration checkpoint signaling.

Primary source docs:
- [`Response-Capture-and-Persistence-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-CDS.md)
- [`Response-Capture-and-Persistence-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-Task-Pack.md)
- [`Unified-Execution-Backlog.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Unified-Execution-Backlog.md)

Milestone placement:
- Milestone 3

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell
- identity and access
- orchestration APIs and session rules

Downstream consumers:
- frontend autosave and finalize flows
- later scoring event triggers

## 3. Local Execution Order
### Phase 1: Router and Schemas
- implement response `router.py`
- implement command and response schemas
- implement actor-resolution dependency

### Phase 2: Draft and Finalize Services
- implement `ResponseCaptureService`
- support save draft, fetch draft, finalize response, and summary fetch

### Phase 3: Artifact and Checkpoint Integration
- implement `ResponseArtifactService`
- implement orchestration eligibility client
- implement checkpoint signaling

### Phase 4: Persistence and Events
- implement ORM models and repositories
- implement response events
- wire dependencies

### Phase 5: Tests
- add unit tests for draft save, finalization, and artifact service
- add integration tests for idempotent draft save and submission events

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/commands.py`
- `schemas/responses.py`
- `service.py`
- `artifact_service.py`

Core classes/interfaces:
- `ResponseCaptureService`
- `ResponseArtifactService`
- `OrchestrationEligibilityClient`

## 5. Local Completion Criteria
- draft save is upsert-based
- final submission is immutable
- checkpoint updates reach orchestration through declared client boundary
- draft/finalize route coverage exists
- response tests pass

## 6. Handoff
This component hands off:
- draft save and finalize APIs to frontend
- response-submitted events to later scoring flow
- checkpoint state to orchestration
