# D-ARCHIE Response Capture and Persistence Code Engine Task Pack

Source spec:
- [`Response-Capture-and-Persistence-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-CDS.md)

## 1. Router and DTO Tasks
1. Create response capture routes from CDS section 5.
2. Create command and response schemas.
3. Implement auth-aware actor resolution dependency.

## 2. Service Tasks
1. Create `ResponseCaptureService`.
2. Create `ResponseArtifactService`.
3. Implement draft save, draft fetch, final submission, artifact metadata, and summary logic.

## 3. Persistence and Integration Tasks
1. Create ORM models in `models.py`.
2. Create repositories in `repositories.py`.
3. Create orchestration client dependency in `clients/orchestration_client.py`.
4. Create response domain events in `events.py`.

## 4. Error and Test Tasks
1. Create `errors.py` with HTTP mapping from CDS section 10.
2. Add unit tests from CDS section 11.
3. Add integration tests for route coverage, draft idempotency, and submission event emission.

## 5. Completion Criteria
- Draft save is upsert-based and tested.
- Final submission is immutable and tested.
- Checkpoint signaling to orchestration is wired.
- Artifact metadata cannot finalize without valid reference state.
