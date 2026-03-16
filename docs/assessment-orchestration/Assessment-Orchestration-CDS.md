# D-ARCHIE Assessment Orchestration Component Design Spec (CDS)

## 1. Purpose
This document converts the orchestration LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Assessment-Orchestration-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-HLD.md)
- [`Assessment-Orchestration-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-LLD.md)
- [`Backend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-LLD.md)

## 2. Target Package Layout
Canonical backend root:

```text
services/api/app/
  modules/
    assessment_orchestration/
      router.py
      dependencies.py
      service.py
      progression_service.py
      gating_service.py
      state_machine.py
      policy_service.py
      repositories.py
      models.py
      schemas/
        commands.py
        queries.py
        responses.py
      clients/
        content_client.py
        response_client.py
        scoring_client.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `router.py`
- Expose FastAPI routes for session commands, queries, and progression commands.
- Translate HTTP payloads into schema objects.
- Resolve authenticated access context.
- Delegate all business behavior to services.

### 3.2 `service.py`
- Define `AssessmentSessionService`.
- Own session creation, start, resume, cancel, fetch summary, fetch current unit, fetch progress.
- Coordinate repositories, policy service, and progression service.

### 3.3 `progression_service.py`
- Define `ProgressionService`.
- Own next-step evaluation, task advancement, branch resolution, component progression, and completion checks.

### 3.4 `gating_service.py`
- Define `GatingService`.
- Own review/score hold creation, refresh, release handling, and terminal gating validation.

### 3.5 `state_machine.py`
- Define `SessionStateMachine`.
- Enforce allowed session and task transitions.
- Reject invalid state transitions using orchestration-specific domain errors.

### 3.6 `policy_service.py`
- Define `TimingAttemptPolicyService`.
- Validate time windows, attempt limits, and candidate progression eligibility.

### 3.7 `repositories.py`
- Define repository interfaces and SQLAlchemy-backed implementations for:
  - `AssessmentSessionRepository`
  - `SessionComponentStateRepository`
  - `SessionTaskStateRepository`
  - `GatingStateRepository`
  - `WorkflowTransitionLogRepository`

### 3.8 `models.py`
- Define SQLAlchemy ORM models for:
  - `AssessmentSessionModel`
  - `SessionComponentStateModel`
  - `SessionTaskStateModel`
  - `GatingStateModel`
  - `TimingPolicySnapshotModel`
  - `AttemptPolicySnapshotModel`
  - `WorkflowTransitionLogModel`

### 3.9 `schemas/commands.py`
- Define Pydantic request models:
  - `CreateSessionCommand`
  - `StartSessionCommand`
  - `ResumeSessionCommand`
  - `CancelSessionCommand`
  - `MarkTaskSubmittedCommand`
  - `EvaluateNextCommand`
  - `RefreshGatingCommand`

### 3.10 `schemas/queries.py`
- Define Pydantic query/context models:
  - `SessionLookupQuery`
  - `CurrentUnitQuery`
  - `ProgressQuery`
  - `SessionAccessContext`

### 3.11 `schemas/responses.py`
- Define response DTOs:
  - `SessionSummaryResponse`
  - `CurrentUnitResponse`
  - `ProgressResponse`
  - `GatingStatusResponse`
  - `ProgressionDecisionResponse`

### 3.12 `clients/*.py`
- Define dependency-facing interfaces:
  - `ContentClient`
  - `ResponseCheckpointClient`
  - `ScoringStatusClient`
- Implement backend-internal adapters later under shared infrastructure.

### 3.13 `events.py`
- Define domain events:
  - `SessionCreatedEvent`
  - `TaskSubmittedForProgressionEvent`
  - `SessionGatingReleasedEvent`
  - `SessionCompletedEvent`
  - `SessionExpiredEvent`

### 3.14 `errors.py`
- Define domain exceptions:
  - `SessionNotFoundError`
  - `SessionAccessDeniedError`
  - `InvalidSessionStateError`
  - `InvalidTaskProgressionError`
  - `TimingPolicyViolationError`
  - `AttemptPolicyViolationError`
  - `GatingNotSatisfiedError`

## 4. Class and Method Contracts
### 4.1 `AssessmentSessionService`
```python
class AssessmentSessionService:
    def create_session(self, command: CreateSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse: ...
    def start_session(self, session_id: str, command: StartSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse: ...
    def resume_session(self, session_id: str, command: ResumeSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse: ...
    def cancel_session(self, session_id: str, command: CancelSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse: ...
    def get_session_summary(self, query: SessionLookupQuery, actor: SessionAccessContext) -> SessionSummaryResponse: ...
    def get_current_unit(self, query: CurrentUnitQuery, actor: SessionAccessContext) -> CurrentUnitResponse: ...
    def get_progress(self, query: ProgressQuery, actor: SessionAccessContext) -> ProgressResponse: ...
```

### 4.2 `ProgressionService`
```python
class ProgressionService:
    def mark_task_submitted(self, session_id: str, command: MarkTaskSubmittedCommand, actor: SessionAccessContext) -> ProgressionDecisionResponse: ...
    def evaluate_next(self, session_id: str, command: EvaluateNextCommand, actor: SessionAccessContext) -> ProgressionDecisionResponse: ...
    def resolve_current_unit(self, session: AssessmentSessionModel) -> CurrentUnitResponse: ...
    def release_after_gating(self, session_id: str, task_id: str) -> ProgressionDecisionResponse: ...
```

### 4.3 `GatingService`
```python
class GatingService:
    def create_or_update_gating(self, session_id: str, task_id: str, evaluation_mode: str) -> GatingStatusResponse: ...
    def refresh_gating(self, session_id: str, command: RefreshGatingCommand) -> GatingStatusResponse: ...
    def release_if_satisfied(self, session_id: str, task_id: str) -> bool: ...
```

### 4.4 `SessionStateMachine`
```python
class SessionStateMachine:
    def transition_session(self, current_state: str, target_state: str) -> str: ...
    def transition_task(self, current_state: str, target_state: str) -> str: ...
    def assert_command_allowed(self, session_state: str, command_name: str) -> None: ...
```

### 4.5 `TimingAttemptPolicyService`
```python
class TimingAttemptPolicyService:
    def assert_session_window_valid(self, session: AssessmentSessionModel, now_utc: datetime) -> None: ...
    def assert_attempt_allowed(self, task_state: SessionTaskStateModel, attempt_no: int) -> None: ...
    def build_policy_snapshots(self, assessment_version: dict) -> tuple[dict, dict]: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method | Primary DTOs |
| --- | --- | --- | --- |
| `POST /sessions` | `create_session` | `AssessmentSessionService.create_session` | `CreateSessionCommand`, `SessionSummaryResponse` |
| `POST /sessions/{session_id}/start` | `start_session` | `AssessmentSessionService.start_session` | `StartSessionCommand`, `SessionSummaryResponse` |
| `POST /sessions/{session_id}/resume` | `resume_session` | `AssessmentSessionService.resume_session` | `ResumeSessionCommand`, `SessionSummaryResponse` |
| `POST /sessions/{session_id}/cancel` | `cancel_session` | `AssessmentSessionService.cancel_session` | `CancelSessionCommand`, `SessionSummaryResponse` |
| `GET /sessions/{session_id}` | `get_session_summary` | `AssessmentSessionService.get_session_summary` | `SessionLookupQuery`, `SessionSummaryResponse` |
| `GET /sessions/{session_id}/current-unit` | `get_current_unit` | `AssessmentSessionService.get_current_unit` | `CurrentUnitQuery`, `CurrentUnitResponse` |
| `GET /sessions/{session_id}/progress` | `get_progress` | `AssessmentSessionService.get_progress` | `ProgressQuery`, `ProgressResponse` |
| `POST /sessions/{session_id}/tasks/{task_id}/mark-submitted` | `mark_task_submitted` | `ProgressionService.mark_task_submitted` | `MarkTaskSubmittedCommand`, `ProgressionDecisionResponse` |
| `POST /sessions/{session_id}/progress/evaluate-next` | `evaluate_next` | `ProgressionService.evaluate_next` | `EvaluateNextCommand`, `ProgressionDecisionResponse` |
| `POST /sessions/{session_id}/gating/refresh` | `refresh_gating` | `GatingService.refresh_gating` | `RefreshGatingCommand`, `GatingStatusResponse` |

## 6. DTO Shapes
### 6.1 Commands
```python
class CreateSessionCommand(BaseModel):
    assignment_id: str
    assessment_version_id: str

class MarkTaskSubmittedCommand(BaseModel):
    task_id: str
    submission_id: str
    submission_marker: str
    attempt_no: int
```

### 6.2 Responses
```python
class SessionSummaryResponse(BaseModel):
    session_id: str
    assessment_version_id: str
    session_state: str
    started_at: datetime | None
    expires_at: datetime | None

class CurrentUnitResponse(BaseModel):
    session_id: str
    component_id: str | None
    task_id: str | None
    task_state: str
    gated: bool
```

## 7. Repository Contracts
```python
class AssessmentSessionRepository(Protocol):
    def create(self, model: AssessmentSessionModel) -> AssessmentSessionModel: ...
    def get_by_id(self, session_id: str) -> AssessmentSessionModel | None: ...
    def update(self, model: AssessmentSessionModel) -> AssessmentSessionModel: ...
    def lock_by_id(self, session_id: str) -> AssessmentSessionModel | None: ...
```

All repositories must accept a shared SQLAlchemy session injected by the backend transaction layer.

## 8. Cross-Domain Dependencies
- `ContentClient.get_published_assessment_version(assessment_version_id: str) -> dict`
- `ResponseCheckpointClient.get_task_checkpoint(session_id: str, task_id: str) -> dict | None`
- `ScoringStatusClient.get_task_readiness(session_id: str, task_id: str) -> dict`
- `ScoringStatusClient.publish_progression_hold(session_id: str, task_id: str, evaluation_mode: str) -> None`

## 9. Dependency Injection
- `dependencies.py` must expose:
  - `get_assessment_session_service`
  - `get_progression_service`
  - `get_gating_service`
  - `get_session_access_context`
- All services receive repositories, clients, state machine, policy service, logger, and event publisher through constructor injection.

## 10. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `SessionNotFoundError` | 404 |
| `SessionAccessDeniedError` | 403 |
| `InvalidSessionStateError` | 409 |
| `InvalidTaskProgressionError` | 409 |
| `TimingPolicyViolationError` | 422 |
| `AttemptPolicyViolationError` | 422 |
| `GatingNotSatisfiedError` | 409 |

## 11. Tests to Generate
### 11.1 Unit Tests
- `test_state_machine.py`
- `test_progression_service.py`
- `test_gating_service.py`
- `test_policy_service.py`

### 11.2 Integration Tests
- `test_session_router.py`
- `test_create_session_flow.py`
- `test_mark_submitted_and_gating.py`
- `test_session_expiry_rules.py`

### 11.3 Fixtures
- published assessment version fixture
- candidate access context fixture
- session/task state fixtures
- fake content/response/scoring client fixtures

## 12. Code Engine Acceptance
A code engine implementing this CDS must create the exact package layout above, generate the listed classes and DTOs, preserve the method names/signatures, and write unit/integration tests for create-session, current-unit lookup, submission progression, gating release, and invalid transition handling.
