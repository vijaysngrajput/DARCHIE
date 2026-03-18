from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session, get_event_publisher, get_request_context
from app.modules.assessment_orchestration.dependencies import (
    get_assessment_session_repository,
    get_progression_service,
    get_session_task_state_repository,
)
from app.modules.assessment_orchestration.progression_service import ProgressionService
from app.modules.assessment_orchestration.repositories import (
    SQLAlchemyAssessmentSessionRepository,
    SQLAlchemySessionTaskStateRepository,
)
from app.modules.response_capture.artifact_service import ResponseArtifactService
from app.modules.response_capture.clients.orchestration_client import OrchestrationEligibilityClient
from app.modules.response_capture.repositories import (
    SQLAlchemyResponseArtifactRepository,
    SQLAlchemyResponseCheckpointRepository,
    SQLAlchemyResponseDraftRepository,
    SQLAlchemyResponseSubmissionRepository,
)
from app.modules.response_capture.service import ResponseCaptureService


def get_response_draft_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyResponseDraftRepository:
    return SQLAlchemyResponseDraftRepository(session)


def get_response_submission_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyResponseSubmissionRepository:
    return SQLAlchemyResponseSubmissionRepository(session)


def get_response_artifact_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyResponseArtifactRepository:
    return SQLAlchemyResponseArtifactRepository(session)


def get_response_checkpoint_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyResponseCheckpointRepository:
    return SQLAlchemyResponseCheckpointRepository(session)


def get_orchestration_eligibility_client(
    session_repository: SQLAlchemyAssessmentSessionRepository = Depends(get_assessment_session_repository),
    task_repository: SQLAlchemySessionTaskStateRepository = Depends(get_session_task_state_repository),
    checkpoint_repository: SQLAlchemyResponseCheckpointRepository = Depends(get_response_checkpoint_repository),
    progression_service: ProgressionService = Depends(get_progression_service),
) -> OrchestrationEligibilityClient:
    return OrchestrationEligibilityClient(session_repository, task_repository, checkpoint_repository, progression_service)


def get_response_capture_service(
    draft_repository: SQLAlchemyResponseDraftRepository = Depends(get_response_draft_repository),
    submission_repository: SQLAlchemyResponseSubmissionRepository = Depends(get_response_submission_repository),
    artifact_repository: SQLAlchemyResponseArtifactRepository = Depends(get_response_artifact_repository),
    checkpoint_repository: SQLAlchemyResponseCheckpointRepository = Depends(get_response_checkpoint_repository),
    orchestration_client: OrchestrationEligibilityClient = Depends(get_orchestration_eligibility_client),
    event_publisher=Depends(get_event_publisher),
) -> ResponseCaptureService:
    return ResponseCaptureService(
        draft_repository,
        submission_repository,
        artifact_repository,
        checkpoint_repository,
        orchestration_client,
        event_publisher,
    )


def get_response_artifact_service(
    artifact_repository: SQLAlchemyResponseArtifactRepository = Depends(get_response_artifact_repository),
    draft_repository: SQLAlchemyResponseDraftRepository = Depends(get_response_draft_repository),
    submission_repository: SQLAlchemyResponseSubmissionRepository = Depends(get_response_submission_repository),
    orchestration_client: OrchestrationEligibilityClient = Depends(get_orchestration_eligibility_client),
    event_publisher=Depends(get_event_publisher),
) -> ResponseArtifactService:
    return ResponseArtifactService(
        artifact_repository,
        draft_repository,
        submission_repository,
        orchestration_client,
        event_publisher,
    )


def get_actor_id(request_context=Depends(get_request_context)) -> str:
    return request_context.actor_id or ""
