from datetime import datetime

from pydantic import BaseModel


class SessionSummaryResponse(BaseModel):
    session_id: str
    assignment_id: str
    assessment_version_id: str
    session_state: str
    current_component_id: str | None
    current_task_id: str | None
    started_at: datetime | None
    expires_at: datetime | None


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
