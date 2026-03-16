# D-ARCHIE Assessment Content Management Component Design Spec (CDS)

## 1. Purpose
This document converts the content-management LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Assessment-Content-Management-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-HLD.md)
- [`Assessment-Content-Management-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-LLD.md)
- [`Backend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-CDS.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    assessment_content_management/
      router.py
      dependencies.py
      authoring_service.py
      version_service.py
      validation_service.py
      publish_service.py
      runtime_payload_service.py
      repositories.py
      models.py
      schemas/
        authoring.py
        review_publish.py
        runtime.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `router.py`
- Expose authoring, version, review/publish, and runtime-read endpoints.
- Route admin/reviewer actions through dependency-injected services.

### 3.2 `authoring_service.py`
- Define `AssessmentAuthoringService`.
- Own creation and update of assessments, components, tasks, rubrics, and reusable content assets.

### 3.3 `version_service.py`
- Define `AssessmentVersionService`.
- Own draft lineage creation, version loading, and lifecycle transitions up to review submission.

### 3.4 `validation_service.py`
- Define `ContentValidationService`.
- Own integrity validation for task membership, follow-up targets, dependency cycles, rubric references, and publish readiness.

### 3.5 `publish_service.py`
- Define `ContentPublishService`.
- Own submit-for-review, publish, supersede, and auditable publish transition behavior.

### 3.6 `runtime_payload_service.py`
- Define `RuntimePayloadService`.
- Build immutable published runtime payloads for orchestration and scoring consumers.

### 3.7 `repositories.py`
- Define repositories for:
  - `AssessmentDefinitionRepository`
  - `AssessmentVersionRepository`
  - `AssessmentComponentRepository`
  - `TaskDefinitionRepository`
  - `RubricDefinitionRepository`
  - `ReusableContentAssetRepository`
  - `FollowUpRuleRepository`
  - `DependencyRuleRepository`
  - `PublishReviewRecordRepository`

### 3.8 `models.py`
- Define ORM models:
  - `AssessmentDefinitionModel`
  - `AssessmentVersionModel`
  - `AssessmentComponentDefinitionModel`
  - `TaskDefinitionModel`
  - `RubricDefinitionModel`
  - `ReusableContentAssetModel`
  - `FollowUpRuleModel`
  - `DependencyRuleModel`
  - `PublishReviewRecordModel`

### 3.9 `schemas/authoring.py`
- `CreateAssessmentRequest`
- `CreateAssessmentVersionRequest`
- `UpsertComponentRequest`
- `UpsertTaskRequest`
- `UpsertRubricRequest`
- `UpsertReusableAssetRequest`
- `AssessmentAuthoringResponse`

### 3.10 `schemas/review_publish.py`
- `SubmitForReviewRequest`
- `PublishVersionRequest`
- `VersionLifecycleResponse`
- `ContentValidationIssue`

### 3.11 `schemas/runtime.py`
- `RuntimeAssessmentPayload`
- `RuntimeComponentPayload`
- `RuntimeTaskPayload`
- `RuntimeRubricMetadata`

### 3.12 `events.py`
- `ContentSubmittedForReviewEvent`
- `ContentPublishedEvent`
- `ContentVersionSupersededEvent`
- `RubricUpdatedEvent`

### 3.13 `errors.py`
- `AssessmentDefinitionNotFoundError`
- `AssessmentVersionNotFoundError`
- `InvalidLifecycleTransitionError`
- `ContentValidationFailedError`
- `DuplicatePublishError`

## 4. Class and Method Contracts
```python
class AssessmentAuthoringService:
    def create_assessment(self, command: CreateAssessmentRequest, actor_id: str) -> AssessmentAuthoringResponse: ...
    def create_version(self, assessment_id: str, command: CreateAssessmentVersionRequest, actor_id: str) -> AssessmentAuthoringResponse: ...
    def upsert_component(self, version_id: str, command: UpsertComponentRequest, actor_id: str) -> AssessmentAuthoringResponse: ...
    def upsert_task(self, version_id: str, command: UpsertTaskRequest, actor_id: str) -> AssessmentAuthoringResponse: ...
    def upsert_rubric(self, version_id: str, command: UpsertRubricRequest, actor_id: str) -> AssessmentAuthoringResponse: ...
    def upsert_reusable_asset(self, command: UpsertReusableAssetRequest, actor_id: str) -> AssessmentAuthoringResponse: ...

class ContentValidationService:
    def validate_version(self, version_id: str) -> list[ContentValidationIssue]: ...
    def assert_publishable(self, version_id: str) -> None: ...

class ContentPublishService:
    def submit_for_review(self, version_id: str, command: SubmitForReviewRequest, actor_id: str) -> VersionLifecycleResponse: ...
    def publish_version(self, version_id: str, command: PublishVersionRequest, actor_id: str) -> VersionLifecycleResponse: ...

class RuntimePayloadService:
    def get_runtime_payload(self, version_id: str) -> RuntimeAssessmentPayload: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `POST /content/assessments` | `create_assessment` | `AssessmentAuthoringService.create_assessment` |
| `POST /content/assessments/{assessment_id}/versions` | `create_version` | `AssessmentAuthoringService.create_version` |
| `PUT /content/versions/{version_id}/components/{component_id}` | `upsert_component` | `AssessmentAuthoringService.upsert_component` |
| `PUT /content/versions/{version_id}/tasks/{task_id}` | `upsert_task` | `AssessmentAuthoringService.upsert_task` |
| `PUT /content/versions/{version_id}/rubrics/{rubric_id}` | `upsert_rubric` | `AssessmentAuthoringService.upsert_rubric` |
| `POST /content/versions/{version_id}/submit-review` | `submit_for_review` | `ContentPublishService.submit_for_review` |
| `POST /content/versions/{version_id}/publish` | `publish_version` | `ContentPublishService.publish_version` |
| `GET /content/runtime/versions/{version_id}` | `get_runtime_payload` | `RuntimePayloadService.get_runtime_payload` |

## 6. Runtime Payload Contract
```python
class RuntimeAssessmentPayload(BaseModel):
    assessment_version_id: str
    assessment_id: str
    title: str
    components: list["RuntimeComponentPayload"]

class RuntimeComponentPayload(BaseModel):
    component_id: str
    component_type: str
    title: str
    order_index: int
    tasks: list["RuntimeTaskPayload"]

class RuntimeTaskPayload(BaseModel):
    task_id: str
    task_type: str
    prompt: dict
    order_index: int
    follow_up_rules: list[dict]
    dependency_rules: list[dict]
    rubric_metadata: RuntimeRubricMetadata | None
```

This payload is the canonical content contract consumed by orchestration and scoring.

## 7. Repository Contracts
```python
class AssessmentVersionRepository(Protocol):
    def create(self, model: AssessmentVersionModel) -> AssessmentVersionModel: ...
    def get_by_id(self, version_id: str) -> AssessmentVersionModel | None: ...
    def get_published_for_assessment(self, assessment_id: str) -> AssessmentVersionModel | None: ...
    def update(self, model: AssessmentVersionModel) -> AssessmentVersionModel: ...
    def lock_by_id(self, version_id: str) -> AssessmentVersionModel | None: ...
```

## 8. Dependency Injection
- `dependencies.py` must expose:
  - `get_assessment_authoring_service`
  - `get_content_validation_service`
  - `get_content_publish_service`
  - `get_runtime_payload_service`

## 9. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `AssessmentDefinitionNotFoundError` | 404 |
| `AssessmentVersionNotFoundError` | 404 |
| `InvalidLifecycleTransitionError` | 409 |
| `ContentValidationFailedError` | 422 |
| `DuplicatePublishError` | 409 |

## 10. Tests to Generate
- Unit:
  - `test_content_validation_service.py`
  - `test_publish_service.py`
  - `test_runtime_payload_service.py`
- Integration:
  - `test_authoring_routes.py`
  - `test_submit_review_and_publish.py`
  - `test_runtime_payload_read.py`
- Fixtures:
  - draft version fixture
  - published version fixture
  - reusable asset fixture
  - rubric and dependency-rule fixtures

## 11. Code Engine Acceptance
A code engine implementing this CDS must generate authoring, validation, publish, and runtime-read services with immutable published version handling, a stable runtime payload contract for orchestration/scoring, and tests for validation failures, publish transitions, and published payload retrieval.
