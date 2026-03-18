from pydantic import BaseModel


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
    attempt_no: int = 1


class CreateArtifactMetadataRequest(BaseModel):
    session_id: str
    task_id: str
    artifact_kind: str
    storage_reference: str
    metadata: dict = {}
