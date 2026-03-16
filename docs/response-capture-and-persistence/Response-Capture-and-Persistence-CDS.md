# D-ARCHIE Response Capture and Persistence Component Design Spec (CDS)

## 1. Purpose
This document converts the response capture LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Response-Capture-and-Persistence-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/response-capture-and-persistence/Response-Capture-and-Persistence-LLD.md)
- [`Backend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-LLD.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    response_capture/
      router.py
      dependencies.py
      service.py
      artifact_service.py
      repositories.py
      models.py
      schemas/
        commands.py
        responses.py
      clients/
        orchestration_client.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `router.py`
- Expose draft, finalize, artifact, and summary endpoints.

### 3.2 `service.py`
- Define `ResponseCaptureService`.
- Own draft save, draft fetch, final submission, and summary fetch.

### 3.3 `artifact_service.py`
- Define `ResponseArtifactService`.
- Own artifact metadata creation and object-reference linkage.

### 3.4 `repositories.py`
- Define repositories for:
  - `ResponseDraftRepository`
  - `ResponseSubmissionRepository`
  - `ResponseArtifactRepository`
  - `ResponseCheckpointRepository`

### 3.5 `models.py`
- Define ORM models:
  - `ResponseDraftModel`
  - `ResponseSubmissionModel`
  - `ResponseArtifactModel`
  - `ResponseCheckpointModel`

### 3.6 `schemas/commands.py`
- `SaveDraftRequest`
- `FinalizeResponseRequest`
- `CreateArtifactMetadataRequest`

### 3.7 `schemas/responses.py`
- `DraftSaveResponse`
- `ResponseSummaryResponse`
- `FinalizeResponseResponse`
- `ArtifactMetadataResponse`

### 3.8 `clients/orchestration_client.py`
- Define `OrchestrationEligibilityClient` for final-submission eligibility and checkpoint signaling.

### 3.9 `events.py`
- `ResponseDraftSavedEvent`
- `ResponseSubmittedEvent`
- `ResponseArtifactLinkedEvent`

### 3.10 `errors.py`
- `ResponseAccessDeniedError`
- `InvalidSubmissionStateError`
- `ArtifactReferenceError`
- `DraftNotFoundError`

## 4. Class and Method Contracts
```python
class ResponseCaptureService:
    def save_draft(self, command: SaveDraftRequest, actor_id: str) -> DraftSaveResponse: ...
    def get_draft(self, session_id: str, task_id: str, actor_id: str) -> DraftSaveResponse: ...
    def finalize_response(self, command: FinalizeResponseRequest, actor_id: str) -> FinalizeResponseResponse: ...
    def get_response_summary(self, session_id: str, task_id: str, actor_id: str) -> ResponseSummaryResponse: ...

class ResponseArtifactService:
    def create_artifact_metadata(self, command: CreateArtifactMetadataRequest, actor_id: str) -> ArtifactMetadataResponse: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `POST /responses/draft` | `save_draft` | `ResponseCaptureService.save_draft` |
| `GET /responses/draft/{session_id}/{task_id}` | `get_draft` | `ResponseCaptureService.get_draft` |
| `POST /responses/finalize` | `finalize_response` | `ResponseCaptureService.finalize_response` |
| `POST /responses/artifacts` | `create_artifact_metadata` | `ResponseArtifactService.create_artifact_metadata` |
| `GET /responses/summary/{session_id}/{task_id}` | `get_response_summary` | `ResponseCaptureService.get_response_summary` |

## 6. DTO Shapes
```python
class SaveDraftRequest(BaseModel):
    session_id: str
    task_id: str
    payload: dict
    attempt_no: int

class FinalizeResponseRequest(BaseModel):
    session_id: str
    task_id: str
    payload: dict
    submission_key: str
```

## 7. Repository Contracts
```python
class ResponseDraftRepository(Protocol):
    def upsert_current(self, session_id: str, task_id: str, actor_id: str, payload: dict, attempt_no: int) -> ResponseDraftModel: ...
    def get_current(self, session_id: str, task_id: str, actor_id: str) -> ResponseDraftModel | None: ...
```

## 8. Cross-Domain Dependencies
- `OrchestrationEligibilityClient.assert_submission_allowed(session_id: str, task_id: str, actor_id: str) -> None`
- `OrchestrationEligibilityClient.update_checkpoint(session_id: str, task_id: str, milestone: str) -> None`

## 9. Dependency Injection
- `dependencies.py` must expose:
  - `get_response_capture_service`
  - `get_response_artifact_service`
  - `get_actor_id`

## 10. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `ResponseAccessDeniedError` | 403 |
| `DraftNotFoundError` | 404 |
| `InvalidSubmissionStateError` | 409 |
| `ArtifactReferenceError` | 422 |

## 11. Tests to Generate
- Unit:
  - `test_save_draft.py`
  - `test_finalize_response.py`
  - `test_artifact_service.py`
- Integration:
  - `test_response_routes.py`
  - `test_finalize_emits_submission_event.py`
  - `test_draft_upsert_idempotency.py`

## 12. Code Engine Acceptance
A code engine implementing this CDS must generate explicit draft/final submission services, immutable final submission handling, checkpoint updates back to orchestration, artifact metadata linkage, and tests for idempotent draft save, immutable finalization, and submission-event emission.
