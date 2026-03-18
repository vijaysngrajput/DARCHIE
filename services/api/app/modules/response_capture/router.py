from fastapi import APIRouter, Depends

from app.modules.identity_access.dependencies import require_role
from app.modules.identity_access.schemas.access import AccessContextResponse
from app.modules.response_capture.artifact_service import ResponseArtifactService
from app.modules.response_capture.dependencies import get_actor_id, get_response_artifact_service, get_response_capture_service
from app.modules.response_capture.schemas.commands import CreateArtifactMetadataRequest, FinalizeResponseRequest, SaveDraftRequest
from app.modules.response_capture.schemas.responses import ArtifactMetadataResponse, DraftSaveResponse, FinalizeResponseResponse, ResponseSummaryResponse
from app.modules.response_capture.service import ResponseCaptureService

router = APIRouter(tags=["response-capture"])


@router.get("/responses/_health")
def response_health() -> dict[str, str]:
    return {"module": "response_capture", "status": "ok"}


@router.post("/responses/draft", response_model=DraftSaveResponse)
def save_draft(
    command: SaveDraftRequest,
    _: AccessContextResponse = Depends(require_role("candidate")),
    actor_id: str = Depends(get_actor_id),
    service: ResponseCaptureService = Depends(get_response_capture_service),
) -> DraftSaveResponse:
    return service.save_draft(command, actor_id)


@router.get("/responses/draft/{session_id}/{task_id}", response_model=DraftSaveResponse)
def get_draft(
    session_id: str,
    task_id: str,
    _: AccessContextResponse = Depends(require_role("candidate")),
    actor_id: str = Depends(get_actor_id),
    service: ResponseCaptureService = Depends(get_response_capture_service),
) -> DraftSaveResponse:
    return service.get_draft(session_id, task_id, actor_id)


@router.post("/responses/finalize", response_model=FinalizeResponseResponse)
def finalize_response(
    command: FinalizeResponseRequest,
    _: AccessContextResponse = Depends(require_role("candidate")),
    actor_id: str = Depends(get_actor_id),
    service: ResponseCaptureService = Depends(get_response_capture_service),
) -> FinalizeResponseResponse:
    return service.finalize_response(command, actor_id)


@router.post("/responses/artifacts", response_model=ArtifactMetadataResponse)
def create_artifact_metadata(
    command: CreateArtifactMetadataRequest,
    _: AccessContextResponse = Depends(require_role("candidate")),
    actor_id: str = Depends(get_actor_id),
    service: ResponseArtifactService = Depends(get_response_artifact_service),
) -> ArtifactMetadataResponse:
    return service.create_artifact_metadata(command, actor_id)


@router.get("/responses/summary/{session_id}/{task_id}", response_model=ResponseSummaryResponse)
def get_response_summary(
    session_id: str,
    task_id: str,
    _: AccessContextResponse = Depends(require_role("candidate")),
    actor_id: str = Depends(get_actor_id),
    service: ResponseCaptureService = Depends(get_response_capture_service),
) -> ResponseSummaryResponse:
    return service.get_response_summary(session_id, task_id, actor_id)
