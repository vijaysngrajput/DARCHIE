from datetime import datetime

from pydantic import BaseModel


class DraftSaveResponse(BaseModel):
    draft_id: str
    session_id: str
    task_id: str
    actor_id: str
    attempt_no: int
    payload: dict
    updated_at: datetime


class ResponseSummaryResponse(BaseModel):
    session_id: str
    task_id: str
    actor_id: str
    draft_exists: bool
    draft_attempt_no: int | None
    finalized: bool
    submission_id: str | None
    artifact_count: int
    checkpoint_milestone: str | None


class FinalizeResponseResponse(BaseModel):
    submission_id: str
    session_id: str
    task_id: str
    actor_id: str
    submission_key: str
    finalized_at: datetime
    checkpoint_milestone: str
    session_state: str | None = None


class ArtifactMetadataResponse(BaseModel):
    artifact_id: str
    session_id: str
    task_id: str
    actor_id: str
    artifact_kind: str
    storage_reference: str
    metadata: dict
