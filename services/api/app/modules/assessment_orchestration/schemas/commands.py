from pydantic import BaseModel


class CreateSessionCommand(BaseModel):
    assignment_id: str
    assessment_version_id: str


class StartSessionCommand(BaseModel):
    pass


class ResumeSessionCommand(BaseModel):
    pass


class CancelSessionCommand(BaseModel):
    reason: str | None = None


class MarkTaskSubmittedCommand(BaseModel):
    task_id: str
    submission_id: str
    submission_marker: str
    attempt_no: int


class EvaluateNextCommand(BaseModel):
    task_id: str | None = None


class RefreshGatingCommand(BaseModel):
    task_id: str
