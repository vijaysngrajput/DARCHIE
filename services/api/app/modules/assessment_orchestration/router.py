from fastapi import APIRouter, Depends

from app.modules.assessment_orchestration.dependencies import (
    get_assessment_session_service,
    get_gating_service,
    get_progression_service,
    require_candidate_session_actor,
)
from app.modules.assessment_orchestration.gating_service import GatingService
from app.modules.assessment_orchestration.progression_service import ProgressionService
from app.modules.assessment_orchestration.schemas.commands import (
    CancelSessionCommand,
    CreateSessionCommand,
    EvaluateNextCommand,
    MarkTaskSubmittedCommand,
    RefreshGatingCommand,
    ResumeSessionCommand,
    StartSessionCommand,
)
from app.modules.assessment_orchestration.schemas.queries import CurrentUnitQuery, ProgressQuery, SessionAccessContext, SessionLookupQuery
from app.modules.assessment_orchestration.schemas.responses import (
    CurrentUnitResponse,
    GatingStatusResponse,
    ProgressionDecisionResponse,
    ProgressResponse,
    SessionSummaryResponse,
)
from app.modules.assessment_orchestration.service import AssessmentSessionService

router = APIRouter(tags=["assessment-orchestration"])


@router.get("/sessions/_health")
def orchestration_health() -> dict[str, str]:
    return {"module": "assessment_orchestration", "status": "ok"}


@router.post("/sessions", response_model=SessionSummaryResponse)
def create_session(
    command: CreateSessionCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.create_session(command, actor)


@router.post("/sessions/{session_id}/start", response_model=SessionSummaryResponse)
def start_session(
    session_id: str,
    command: StartSessionCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.start_session(session_id, command, actor)


@router.post("/sessions/{session_id}/resume", response_model=SessionSummaryResponse)
def resume_session(
    session_id: str,
    command: ResumeSessionCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.resume_session(session_id, command, actor)


@router.post("/sessions/{session_id}/cancel", response_model=SessionSummaryResponse)
def cancel_session(
    session_id: str,
    command: CancelSessionCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.cancel_session(session_id, command, actor)


@router.get("/sessions/{session_id}", response_model=SessionSummaryResponse)
def get_session_summary(
    session_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.get_session_summary(SessionLookupQuery(session_id=session_id), actor)


@router.get("/sessions/{session_id}/current-unit", response_model=CurrentUnitResponse)
def get_current_unit(
    session_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> CurrentUnitResponse:
    return session_service.get_current_unit(CurrentUnitQuery(session_id=session_id), actor)


@router.get("/sessions/{session_id}/progress", response_model=ProgressResponse)
def get_progress(
    session_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> ProgressResponse:
    return session_service.get_progress(ProgressQuery(session_id=session_id), actor)


@router.post("/sessions/{session_id}/tasks/{task_id}/mark-submitted", response_model=ProgressionDecisionResponse)
def mark_task_submitted(
    session_id: str,
    task_id: str,
    command: MarkTaskSubmittedCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    progression_service: ProgressionService = Depends(get_progression_service),
) -> ProgressionDecisionResponse:
    payload = command.model_copy(update={"task_id": task_id})
    return progression_service.mark_task_submitted(session_id, payload, actor)


@router.post("/sessions/{session_id}/progress/evaluate-next", response_model=ProgressionDecisionResponse)
def evaluate_next(
    session_id: str,
    command: EvaluateNextCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    progression_service: ProgressionService = Depends(get_progression_service),
) -> ProgressionDecisionResponse:
    return progression_service.evaluate_next(session_id, command, actor)


@router.post("/sessions/{session_id}/gating/refresh", response_model=GatingStatusResponse)
def refresh_gating(
    session_id: str,
    command: RefreshGatingCommand,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    gating_service: GatingService = Depends(get_gating_service),
) -> GatingStatusResponse:
    _ = actor
    return gating_service.refresh_gating(session_id, command)
