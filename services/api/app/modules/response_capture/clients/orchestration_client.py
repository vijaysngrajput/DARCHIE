from app.modules.assessment_orchestration.errors import SessionAccessDeniedError, SessionNotFoundError
from app.modules.assessment_orchestration.schemas.commands import MarkTaskSubmittedCommand
from app.modules.assessment_orchestration.schemas.queries import SessionAccessContext
from app.modules.response_capture.errors import InvalidSubmissionStateError, ResponseAccessDeniedError


class OrchestrationEligibilityClient:
    def __init__(self, session_repository, task_repository, checkpoint_repository, progression_service):
        self.session_repository = session_repository
        self.task_repository = task_repository
        self.checkpoint_repository = checkpoint_repository
        self.progression_service = progression_service

    def assert_submission_allowed(self, session_id: str, task_id: str, actor_id: str, attempt_no: int) -> None:
        session = self.session_repository.get_by_id(session_id)
        if session is None:
            raise SessionNotFoundError()
        if session.candidate_user_id != actor_id:
            raise ResponseAccessDeniedError()
        if session.session_state != "active":
            raise InvalidSubmissionStateError("Session is not active")
        task_state = self.task_repository.get(session_id, task_id)
        if task_state is None:
            raise InvalidSubmissionStateError("Task is not available for submission")
        if task_state.state not in {"in_progress", "pending"}:
            raise InvalidSubmissionStateError(f"Task cannot be submitted from state {task_state.state}")
        if attempt_no <= 0:
            raise InvalidSubmissionStateError("Attempt number must be positive")

    def update_checkpoint(self, session_id: str, task_id: str, actor_id: str, milestone: str, submission_id: str | None = None) -> None:
        self.checkpoint_repository.upsert(session_id, task_id, actor_id, milestone, submission_id=submission_id)

    def finalize_submission(self, session_id: str, task_id: str, actor_id: str, submission_id: str, submission_marker: str, attempt_no: int) -> dict:
        actor = SessionAccessContext(actor_id=actor_id, roles=["candidate"])
        decision = self.progression_service.mark_task_submitted(
            session_id,
            MarkTaskSubmittedCommand(
                task_id=task_id,
                submission_id=submission_id,
                submission_marker=submission_marker,
                attempt_no=attempt_no,
            ),
            actor,
        )
        return decision.model_dump()
