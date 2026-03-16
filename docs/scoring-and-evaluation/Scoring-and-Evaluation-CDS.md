# D-ARCHIE Scoring and Evaluation Component Design Spec (CDS)

## 1. Purpose
This document converts the scoring LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Scoring-and-Evaluation-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-HLD.md)
- [`Scoring-and-Evaluation-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-LLD.md)
- [`Assessment-Content-Management-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-CDS.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    scoring_evaluation/
      router.py
      dependencies.py
      evaluation_service.py
      path_resolver.py
      rule_evaluator.py
      rubric_evaluator.py
      manual_review_service.py
      aggregation_service.py
      readiness_service.py
      repositories.py
      models.py
      schemas/
        evaluation.py
        reviews.py
        scores.py
      clients/
        content_client.py
        orchestration_client.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `evaluation_service.py`
- Define `EvaluationExecutionService`.
- Own evaluation start, evaluation lookup, and orchestration-triggered evaluation execution.

### 3.2 `path_resolver.py`
- Define `EvaluationPathResolver`.
- Resolve `rule_based`, `rubric_based`, `manual_review`, or `hybrid_review` using content runtime metadata.

### 3.3 `rule_evaluator.py`
- Define `RuleBasedEvaluator`.
- Execute deterministic evaluation logic for objective tasks.

### 3.4 `rubric_evaluator.py`
- Define `RubricEvaluationCoordinator`.
- Build rubric-driven evaluation inputs and prepare human-review or rubric-derived results.

### 3.5 `manual_review_service.py`
- Define `ManualReviewService`.
- Own review request creation, review submission, override handling, and review-state transitions.

### 3.6 `aggregation_service.py`
- Define `ScoreAggregationService`.
- Recompute task, component, and assessment outputs after evaluation or review changes.

### 3.7 `readiness_service.py`
- Define `ReadinessStateService`.
- Publish readiness updates back to orchestration and expose readiness lookups.

### 3.8 `repositories.py`
- Define repositories for:
  - `EvaluationRecordRepository`
  - `TaskScoreRepository`
  - `ComponentScoreRepository`
  - `AssessmentScoreRepository`
  - `ReviewRecordRepository`
  - `ReadinessStateRepository`

### 3.9 `models.py`
- Define ORM models:
  - `EvaluationRecordModel`
  - `TaskScoreModel`
  - `ComponentScoreModel`
  - `AssessmentScoreModel`
  - `ReviewRecordModel`
  - `ReadinessStateModel`

### 3.10 `schemas/evaluation.py`
- `StartEvaluationRequest`
- `EvaluationRecordResponse`
- `EvaluationReadinessResponse`

### 3.11 `schemas/reviews.py`
- `SubmitReviewRequest`
- `ReviewRecordResponse`

### 3.12 `schemas/scores.py`
- `TaskScoreResponse`
- `SessionScoreResponse`
- `FinalizedScoreEventPayload`

### 3.13 `clients/content_client.py`
- `ScoringContentClient` for rubric metadata and evaluation-linked task configuration.

### 3.14 `clients/orchestration_client.py`
- `ScoringOrchestrationClient` for readiness notification and status sync.

### 3.15 `events.py`
- `EvaluationStartedEvent`
- `EvaluationCompletedEvent`
- `ReviewRequestedEvent`
- `ReviewCompletedEvent`
- `ScoreFinalizedEvent`

### 3.16 `errors.py`
- `EvaluationNotFoundError`
- `InvalidEvaluationPathError`
- `InvalidReviewStateError`
- `ScoreAggregationError`

## 4. Class and Method Contracts
```python
class EvaluationExecutionService:
    def start_evaluation(self, command: StartEvaluationRequest) -> EvaluationRecordResponse: ...
    def get_evaluation(self, evaluation_id: str) -> EvaluationRecordResponse: ...
    def process_response_submission(self, session_id: str, task_id: str, submission_id: str) -> EvaluationRecordResponse: ...

class EvaluationPathResolver:
    def resolve(self, runtime_task_payload: dict) -> str: ...

class ManualReviewService:
    def submit_review(self, evaluation_id: str, command: SubmitReviewRequest, actor_id: str) -> ReviewRecordResponse: ...
    def request_review(self, evaluation_id: str) -> ReviewRecordResponse: ...

class ScoreAggregationService:
    def recompute_for_task(self, evaluation_id: str) -> TaskScoreResponse: ...
    def recompute_for_session(self, session_id: str) -> SessionScoreResponse: ...

class ReadinessStateService:
    def get_readiness(self, session_id: str, task_id: str) -> EvaluationReadinessResponse: ...
    def publish_readiness_update(self, session_id: str, task_id: str) -> None: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `POST /evaluations/start` | `start_evaluation` | `EvaluationExecutionService.start_evaluation` |
| `GET /evaluations/{evaluation_id}` | `get_evaluation` | `EvaluationExecutionService.get_evaluation` |
| `GET /scores/task/{task_id}` | `get_task_score` | `ScoreAggregationService.recompute_for_task` or score query adapter |
| `GET /scores/session/{session_id}` | `get_session_score` | `ScoreAggregationService.recompute_for_session` or score query adapter |
| `POST /reviews/{evaluation_id}` | `submit_review` | `ManualReviewService.submit_review` |

## 6. Finalized Score Output Contract
```python
class FinalizedScoreEventPayload(BaseModel):
    session_id: str
    assessment_version_id: str
    candidate_id: str
    task_scores: list[dict]
    component_scores: list[dict]
    assessment_score: dict
    finalized_at: datetime
```

This payload is the canonical score contract consumed by reporting.

## 7. Repository Contracts
```python
class EvaluationRecordRepository(Protocol):
    def create(self, model: EvaluationRecordModel) -> EvaluationRecordModel: ...
    def get_by_id(self, evaluation_id: str) -> EvaluationRecordModel | None: ...
    def update(self, model: EvaluationRecordModel) -> EvaluationRecordModel: ...
    def get_by_submission_key(self, submission_key: str) -> EvaluationRecordModel | None: ...
```

## 8. Dependency Injection
- `dependencies.py` must expose:
  - `get_evaluation_execution_service`
  - `get_manual_review_service`
  - `get_score_aggregation_service`
  - `get_readiness_state_service`

## 9. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `EvaluationNotFoundError` | 404 |
| `InvalidEvaluationPathError` | 422 |
| `InvalidReviewStateError` | 409 |
| `ScoreAggregationError` | 500 |

## 10. Tests to Generate
- Unit:
  - `test_path_resolver.py`
  - `test_rule_evaluator.py`
  - `test_manual_review_service.py`
  - `test_aggregation_service.py`
- Integration:
  - `test_start_evaluation_route.py`
  - `test_review_completion_recomputes_scores.py`
  - `test_score_finalized_event.py`
- Fixtures:
  - runtime task payload fixture
  - rubric metadata fixture
  - evaluation/review record fixtures

## 11. Code Engine Acceptance
A code engine implementing this CDS must generate explicit evaluation-path, review, aggregation, and readiness services; freeze the finalized score payload consumed by reporting; and provide tests for deterministic evaluation, manual review completion, aggregation recomputation, and finalized-score event emission.
