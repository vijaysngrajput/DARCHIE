# D-ARCHIE Assessment Orchestration Code Engine Task Pack

Source spec:
- [`Assessment-Orchestration-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-CDS.md)

## 1. Router and DTO Tasks
1. Create `services/api/app/modules/assessment_orchestration/router.py`.
2. Add FastAPI endpoints for all session and progression routes from CDS section 5.
3. Create `schemas/commands.py`, `schemas/queries.py`, and `schemas/responses.py`.
4. Implement request validation and response serialization using Pydantic models from CDS sections 6.1 and 6.2.

## 2. Service and State Tasks
1. Create `service.py` with `AssessmentSessionService`.
2. Create `progression_service.py` with `ProgressionService`.
3. Create `gating_service.py` with `GatingService`.
4. Create `state_machine.py` with allowed session/task transition enforcement.
5. Create `policy_service.py` for timing and attempt checks.

## 3. Persistence Tasks
1. Create `models.py` with all orchestration ORM models from CDS section 3.8.
2. Create `repositories.py` with repository protocols and SQLAlchemy implementations.
3. Ensure repositories operate inside shared backend transaction boundaries.

## 4. Integration Tasks
1. Create `clients/content_client.py`.
2. Create `clients/response_client.py`.
3. Create `clients/scoring_client.py`.
4. Create `events.py` for orchestration domain event objects and publishing helpers.
5. Wire dependency injection in `dependencies.py`.

## 5. Error and Test Tasks
1. Create `errors.py` and map errors to HTTP statuses from CDS section 10.
2. Add unit tests listed in CDS section 11.1.
3. Add integration tests listed in CDS section 11.2.
4. Add fixtures listed in CDS section 11.3.

## 6. Completion Criteria
- All listed files exist.
- Endpoint-to-service mapping matches CDS section 5.
- Services use constructor injection only.
- Invalid transitions and policy violations return stable errors.
- Create-session, current-unit, and submission progression tests pass.
