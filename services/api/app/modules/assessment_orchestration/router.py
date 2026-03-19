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
    CandidateHomeViewResponse,
    CandidateLandingViewResponse,
    CandidateTaskViewResponse,
    CurrentUnitResponse,
    GatingStatusResponse,
    ProgressionDecisionResponse,
    ProgressResponse,
    SessionSummaryResponse,
)
from app.modules.assessment_orchestration.service import AssessmentSessionService
from app.modules.response_capture.dependencies import get_response_capture_service
from app.modules.response_capture.service import ResponseCaptureService

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


@router.get("/candidate/home-view", response_model=CandidateHomeViewResponse)
def get_candidate_home_view(
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> CandidateHomeViewResponse:
    return session_service.build_candidate_home_view(actor)


@router.post("/candidate/assignments/{assignment_id}/start-session", response_model=SessionSummaryResponse)
def start_assignment_session(
    assignment_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> SessionSummaryResponse:
    return session_service.start_assignment_session(assignment_id, actor)


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


@router.get("/candidate/sessions/{session_id}/landing-view", response_model=CandidateLandingViewResponse)
def get_candidate_landing_view(
    session_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
) -> CandidateLandingViewResponse:
    session, current_unit, progress = session_service.build_candidate_landing_view(SessionLookupQuery(session_id=session_id), actor)
    return CandidateLandingViewResponse(session=session, current_unit=current_unit, progress=progress)


@router.get("/candidate/sessions/{session_id}/task-view", response_model=CandidateTaskViewResponse)
def get_candidate_task_view(
    session_id: str,
    actor: SessionAccessContext = Depends(require_candidate_session_actor),
    session_service: AssessmentSessionService = Depends(get_assessment_session_service),
    response_service: ResponseCaptureService = Depends(get_response_capture_service),
) -> CandidateTaskViewResponse:
    session, current_unit, progress = session_service.build_candidate_landing_view(SessionLookupQuery(session_id=session_id), actor)
    draft = None
    response_summary = None
    if current_unit.task_id:
        try:
            draft = response_service.get_draft(session_id, current_unit.task_id, actor.actor_id)
        except Exception:
            draft = None
        response_summary = response_service.get_response_summary(session_id, current_unit.task_id, actor.actor_id)
    return CandidateTaskViewResponse(session=session, current_unit=current_unit, progress=progress, draft=draft, response_summary=response_summary)


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
