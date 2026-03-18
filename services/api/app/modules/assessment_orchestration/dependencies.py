from fastapi import Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session, get_event_publisher
from app.modules.assessment_orchestration.clients.content_client import ContentClient
from app.modules.assessment_orchestration.clients.response_client import ResponseCheckpointClient
from app.modules.assessment_orchestration.clients.scoring_client import ScoringStatusClient
from app.modules.assessment_orchestration.gating_service import GatingService
from app.modules.assessment_orchestration.policy_service import TimingAttemptPolicyService
from app.modules.assessment_orchestration.progression_service import ProgressionService
from app.modules.assessment_orchestration.repositories import (
    SQLAlchemyAssessmentSessionRepository,
    SQLAlchemyGatingStateRepository,
    SQLAlchemySessionComponentStateRepository,
    SQLAlchemySessionTaskStateRepository,
    SQLAlchemyWorkflowTransitionLogRepository,
)
from app.modules.assessment_orchestration.schemas.queries import SessionAccessContext
from app.modules.assessment_orchestration.service import AssessmentSessionService
from app.modules.assessment_orchestration.state_machine import SessionStateMachine
from app.modules.identity_access.dependencies import get_access_context, require_role
from app.modules.identity_access.schemas.access import AccessContextResponse


def get_assessment_session_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyAssessmentSessionRepository:
    return SQLAlchemyAssessmentSessionRepository(session)


def get_session_component_state_repository(session: Session = Depends(get_db_session)) -> SQLAlchemySessionComponentStateRepository:
    return SQLAlchemySessionComponentStateRepository(session)


def get_session_task_state_repository(session: Session = Depends(get_db_session)) -> SQLAlchemySessionTaskStateRepository:
    return SQLAlchemySessionTaskStateRepository(session)


def get_gating_state_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyGatingStateRepository:
    return SQLAlchemyGatingStateRepository(session)


def get_workflow_transition_log_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyWorkflowTransitionLogRepository:
    return SQLAlchemyWorkflowTransitionLogRepository(session)


def get_content_client() -> ContentClient:
    return ContentClient()


def get_response_checkpoint_client() -> ResponseCheckpointClient:
    return ResponseCheckpointClient()


def get_scoring_status_client() -> ScoringStatusClient:
    return ScoringStatusClient()


def get_session_state_machine() -> SessionStateMachine:
    return SessionStateMachine()


def get_timing_attempt_policy_service() -> TimingAttemptPolicyService:
    return TimingAttemptPolicyService()


def get_gating_service(
    gating_repository: SQLAlchemyGatingStateRepository = Depends(get_gating_state_repository),
    scoring_client: ScoringStatusClient = Depends(get_scoring_status_client),
    event_publisher=Depends(get_event_publisher),
) -> GatingService:
    return GatingService(gating_repository, scoring_client, event_publisher)


def get_progression_service(
    session_repository: SQLAlchemyAssessmentSessionRepository = Depends(get_assessment_session_repository),
    component_repository: SQLAlchemySessionComponentStateRepository = Depends(get_session_component_state_repository),
    task_repository: SQLAlchemySessionTaskStateRepository = Depends(get_session_task_state_repository),
    gating_service: GatingService = Depends(get_gating_service),
    log_repository: SQLAlchemyWorkflowTransitionLogRepository = Depends(get_workflow_transition_log_repository),
    state_machine: SessionStateMachine = Depends(get_session_state_machine),
    policy_service: TimingAttemptPolicyService = Depends(get_timing_attempt_policy_service),
    response_client: ResponseCheckpointClient = Depends(get_response_checkpoint_client),
    event_publisher=Depends(get_event_publisher),
) -> ProgressionService:
    return ProgressionService(
        session_repository,
        component_repository,
        task_repository,
        gating_service,
        log_repository,
        state_machine,
        policy_service,
        response_client,
        event_publisher,
    )


def get_assessment_session_service(
    session: Session = Depends(get_db_session),
    session_repository: SQLAlchemyAssessmentSessionRepository = Depends(get_assessment_session_repository),
    component_repository: SQLAlchemySessionComponentStateRepository = Depends(get_session_component_state_repository),
    task_repository: SQLAlchemySessionTaskStateRepository = Depends(get_session_task_state_repository),
    gating_repository: SQLAlchemyGatingStateRepository = Depends(get_gating_state_repository),
    log_repository: SQLAlchemyWorkflowTransitionLogRepository = Depends(get_workflow_transition_log_repository),
    state_machine: SessionStateMachine = Depends(get_session_state_machine),
    policy_service: TimingAttemptPolicyService = Depends(get_timing_attempt_policy_service),
    progression_service: ProgressionService = Depends(get_progression_service),
    content_client: ContentClient = Depends(get_content_client),
    event_publisher=Depends(get_event_publisher),
) -> AssessmentSessionService:
    return AssessmentSessionService(
        session_repository,
        component_repository,
        task_repository,
        gating_repository,
        log_repository,
        state_machine,
        policy_service,
        progression_service,
        content_client,
        event_publisher,
        session,
    )


def get_session_access_context(access_context: AccessContextResponse = Depends(get_access_context)) -> SessionAccessContext:
    return SessionAccessContext(
        actor_id=access_context.actor_id,
        roles=access_context.roles,
        access_session_id=access_context.access_session_id,
    )


def require_candidate_session_actor(access_context: AccessContextResponse = Depends(require_role("candidate", "admin"))) -> SessionAccessContext:
    return SessionAccessContext(
        actor_id=access_context.actor_id,
        roles=access_context.roles,
        access_session_id=access_context.access_session_id,
    )
