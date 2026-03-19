from datetime import datetime

from pydantic import BaseModel

from app.modules.response_capture.schemas.responses import DraftSaveResponse, ResponseSummaryResponse


class SessionSummaryResponse(BaseModel):
    session_id: str
    assignment_id: str
    assessment_version_id: str
    session_state: str
    current_component_id: str | None
    current_task_id: str | None
    started_at: datetime | None
    expires_at: datetime | None
    is_resumable: bool = False
    is_expired: bool = False
    is_completed: bool = False
    next_route: str
    time_remaining_seconds: int | None = None


class CurrentUnitResponse(BaseModel):
    session_id: str
    component_id: str | None
    task_id: str | None
    task_state: str
    gated: bool
    evaluation_mode: str | None = None


class ProgressResponse(BaseModel):
    session_id: str
    total_components: int
    completed_components: int
    total_tasks: int
    completed_tasks: int
    submitted_tasks: int
    current_index: int
    percent_complete: float


class GatingStatusResponse(BaseModel):
    session_id: str
    task_id: str
    gating_status: str
    evaluation_mode: str
    released: bool


class ProgressionDecisionResponse(BaseModel):
    session_id: str
    component_id: str | None
    task_id: str | None
    task_state: str | None
    session_state: str
    gating_status: str | None
    next_component_id: str | None
    next_task_id: str | None


class CandidateProfileResponse(BaseModel):
    user_id: str
    email: str | None
    display_name: str | None


class CandidateAssignmentSummaryResponse(BaseModel):
    assignment_id: str
    assessment_version_id: str
    assignment_state: str
    invite_expires_at: datetime | None
    current_session_id: str | None
    latest_completed_session_id: str | None
    latest_progress_summary: ProgressResponse | None
    primary_action: str | None
    primary_route: str | None
    secondary_action: str | None
    secondary_route: str | None
    current_task_id: str | None = None
    current_session_expires_at: datetime | None = None
    time_remaining_seconds: int | None = None


class CandidateHomeViewResponse(BaseModel):
    candidate_profile: CandidateProfileResponse
    assignments: list[CandidateAssignmentSummaryResponse]


class CandidateLandingViewResponse(BaseModel):
    session: SessionSummaryResponse
    current_unit: CurrentUnitResponse
    progress: ProgressResponse


class CandidateTaskViewResponse(BaseModel):
    session: SessionSummaryResponse
    current_unit: CurrentUnitResponse
    progress: ProgressResponse
    draft: DraftSaveResponse | None
    response_summary: ResponseSummaryResponse | None
