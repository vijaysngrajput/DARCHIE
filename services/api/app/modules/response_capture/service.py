from __future__ import annotations

from app.modules.response_capture.errors import DraftNotFoundError, InvalidSubmissionStateError, ResponseAccessDeniedError
from app.modules.response_capture.events import ResponseDraftSavedEvent, ResponseSubmittedEvent, to_payload
from app.modules.response_capture.models import ResponseSubmissionModel
from app.modules.response_capture.schemas.commands import FinalizeResponseRequest, SaveDraftRequest
from app.modules.response_capture.schemas.responses import DraftSaveResponse, FinalizeResponseResponse, ResponseSummaryResponse


class ResponseCaptureService:
    def __init__(
        self,
        draft_repository,
        submission_repository,
        artifact_repository,
        checkpoint_repository,
        orchestration_client,
        event_publisher,
    ):
        self.draft_repository = draft_repository
        self.submission_repository = submission_repository
        self.artifact_repository = artifact_repository
        self.checkpoint_repository = checkpoint_repository
        self.orchestration_client = orchestration_client
        self.event_publisher = event_publisher

    def save_draft(self, command: SaveDraftRequest, actor_id: str) -> DraftSaveResponse:
        if not actor_id:
            raise ResponseAccessDeniedError()
        self.orchestration_client.assert_submission_allowed(command.session_id, command.task_id, actor_id, command.attempt_no)
        draft = self.draft_repository.upsert_current(
            command.session_id,
            command.task_id,
            actor_id,
            command.payload,
            command.attempt_no,
        )
        self.orchestration_client.update_checkpoint(command.session_id, command.task_id, actor_id, "draft_saved")
        self.event_publisher.stage(
            event_name="response.draft_saved",
            payload=to_payload(
                ResponseDraftSavedEvent(
                    session_id=draft.session_id,
                    task_id=draft.task_id,
                    actor_id=draft.actor_id,
                    attempt_no=draft.attempt_no,
                )
            ),
            aggregate_id=draft.session_id,
            aggregate_type="response_draft",
        )
        return DraftSaveResponse(
            draft_id=draft.draft_id,
            session_id=draft.session_id,
            task_id=draft.task_id,
            actor_id=draft.actor_id,
            attempt_no=draft.attempt_no,
            payload=draft.payload,
            updated_at=draft.updated_at,
        )

    def get_draft(self, session_id: str, task_id: str, actor_id: str) -> DraftSaveResponse:
        if not actor_id:
            raise ResponseAccessDeniedError()
        draft = self.draft_repository.get_current(session_id, task_id, actor_id)
        if draft is None:
            raise DraftNotFoundError()
        return DraftSaveResponse(
            draft_id=draft.draft_id,
            session_id=draft.session_id,
            task_id=draft.task_id,
            actor_id=draft.actor_id,
            attempt_no=draft.attempt_no,
            payload=draft.payload,
            updated_at=draft.updated_at,
        )

    def finalize_response(self, command: FinalizeResponseRequest, actor_id: str) -> FinalizeResponseResponse:
        if not actor_id:
            raise ResponseAccessDeniedError()
        existing = self.submission_repository.get_by_submission_key(command.submission_key)
        if existing is not None:
            if existing.actor_id != actor_id or existing.session_id != command.session_id or existing.task_id != command.task_id:
                raise InvalidSubmissionStateError("Submission key already used for a different response")
            checkpoint = self.checkpoint_repository.get(command.session_id, command.task_id)
            return FinalizeResponseResponse(
                submission_id=existing.submission_id,
                session_id=existing.session_id,
                task_id=existing.task_id,
                actor_id=existing.actor_id,
                submission_key=existing.submission_key,
                finalized_at=existing.finalized_at,
                checkpoint_milestone=checkpoint.milestone if checkpoint else "submitted",
                session_state=None,
            )
        self.orchestration_client.assert_submission_allowed(command.session_id, command.task_id, actor_id, command.attempt_no)
        submission = self.submission_repository.create(
            ResponseSubmissionModel(
                session_id=command.session_id,
                task_id=command.task_id,
                actor_id=actor_id,
                attempt_no=command.attempt_no,
                submission_key=command.submission_key,
                payload=command.payload,
            )
        )
        self.orchestration_client.update_checkpoint(command.session_id, command.task_id, actor_id, "submitted", submission.submission_id)
        progression_result = self.orchestration_client.finalize_submission(
            command.session_id,
            command.task_id,
            actor_id,
            submission.submission_id,
            command.submission_key,
            command.attempt_no,
        )
        self.event_publisher.stage(
            event_name="response.submitted",
            payload=to_payload(
                ResponseSubmittedEvent(
                    submission_id=submission.submission_id,
                    session_id=submission.session_id,
                    task_id=submission.task_id,
                    actor_id=submission.actor_id,
                    submission_key=submission.submission_key,
                )
            ),
            aggregate_id=submission.session_id,
            aggregate_type="response_submission",
        )
        checkpoint = self.checkpoint_repository.get(command.session_id, command.task_id)
        return FinalizeResponseResponse(
            submission_id=submission.submission_id,
            session_id=submission.session_id,
            task_id=submission.task_id,
            actor_id=submission.actor_id,
            submission_key=submission.submission_key,
            finalized_at=submission.finalized_at,
            checkpoint_milestone=checkpoint.milestone if checkpoint else "submitted",
            session_state=progression_result.get("session_state"),
        )

    def get_response_summary(self, session_id: str, task_id: str, actor_id: str) -> ResponseSummaryResponse:
        if not actor_id:
            raise ResponseAccessDeniedError()
        draft = self.draft_repository.get_current(session_id, task_id, actor_id)
        submission = self.submission_repository.get_by_task(session_id, task_id, actor_id)
        artifacts = self.artifact_repository.list_for_task(session_id, task_id, actor_id)
        checkpoint = self.checkpoint_repository.get(session_id, task_id)
        return ResponseSummaryResponse(
            session_id=session_id,
            task_id=task_id,
            actor_id=actor_id,
            draft_exists=draft is not None,
            draft_attempt_no=draft.attempt_no if draft else None,
            finalized=submission is not None,
            submission_id=submission.submission_id if submission else None,
            artifact_count=len(artifacts),
            checkpoint_milestone=checkpoint.milestone if checkpoint else None,
        )
