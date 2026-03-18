from __future__ import annotations

from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.response_capture.models import (
    ResponseArtifactModel,
    ResponseCheckpointModel,
    ResponseDraftModel,
    ResponseSubmissionModel,
)


class ResponseDraftRepository(Protocol):
    def upsert_current(self, session_id: str, task_id: str, actor_id: str, payload: dict, attempt_no: int) -> ResponseDraftModel: ...
    def get_current(self, session_id: str, task_id: str, actor_id: str) -> ResponseDraftModel | None: ...


class ResponseSubmissionRepository(Protocol):
    def create(self, model: ResponseSubmissionModel) -> ResponseSubmissionModel: ...
    def get_by_submission_key(self, submission_key: str) -> ResponseSubmissionModel | None: ...
    def get_by_task(self, session_id: str, task_id: str, actor_id: str) -> ResponseSubmissionModel | None: ...


class ResponseArtifactRepository(Protocol):
    def create(self, model: ResponseArtifactModel) -> ResponseArtifactModel: ...
    def list_for_task(self, session_id: str, task_id: str, actor_id: str) -> list[ResponseArtifactModel]: ...


class ResponseCheckpointRepository(Protocol):
    def upsert(self, session_id: str, task_id: str, actor_id: str, milestone: str, submission_id: str | None = None) -> ResponseCheckpointModel: ...
    def get(self, session_id: str, task_id: str) -> ResponseCheckpointModel | None: ...


class SQLAlchemyResponseDraftRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert_current(self, session_id: str, task_id: str, actor_id: str, payload: dict, attempt_no: int) -> ResponseDraftModel:
        draft = self.get_current(session_id, task_id, actor_id)
        if draft is None or draft.attempt_no != attempt_no:
            draft = ResponseDraftModel(
                session_id=session_id,
                task_id=task_id,
                actor_id=actor_id,
                attempt_no=attempt_no,
                payload=payload,
            )
            self.session.add(draft)
        else:
            draft.payload = payload
            self.session.add(draft)
        self.session.flush()
        return draft

    def get_current(self, session_id: str, task_id: str, actor_id: str) -> ResponseDraftModel | None:
        return self.session.scalar(
            select(ResponseDraftModel)
            .where(
                ResponseDraftModel.session_id == session_id,
                ResponseDraftModel.task_id == task_id,
                ResponseDraftModel.actor_id == actor_id,
            )
            .order_by(ResponseDraftModel.attempt_no.desc(), ResponseDraftModel.updated_at.desc())
            .limit(1)
        )


class SQLAlchemyResponseSubmissionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: ResponseSubmissionModel) -> ResponseSubmissionModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get_by_submission_key(self, submission_key: str) -> ResponseSubmissionModel | None:
        return self.session.scalar(select(ResponseSubmissionModel).where(ResponseSubmissionModel.submission_key == submission_key))

    def get_by_task(self, session_id: str, task_id: str, actor_id: str) -> ResponseSubmissionModel | None:
        return self.session.scalar(
            select(ResponseSubmissionModel).where(
                ResponseSubmissionModel.session_id == session_id,
                ResponseSubmissionModel.task_id == task_id,
                ResponseSubmissionModel.actor_id == actor_id,
            )
        )


class SQLAlchemyResponseArtifactRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: ResponseArtifactModel) -> ResponseArtifactModel:
        self.session.add(model)
        self.session.flush()
        return model

    def list_for_task(self, session_id: str, task_id: str, actor_id: str) -> list[ResponseArtifactModel]:
        return list(
            self.session.scalars(
                select(ResponseArtifactModel).where(
                    ResponseArtifactModel.session_id == session_id,
                    ResponseArtifactModel.task_id == task_id,
                    ResponseArtifactModel.actor_id == actor_id,
                )
            )
        )


class SQLAlchemyResponseCheckpointRepository:
    def __init__(self, session: Session):
        self.session = session

    def upsert(self, session_id: str, task_id: str, actor_id: str, milestone: str, submission_id: str | None = None) -> ResponseCheckpointModel:
        checkpoint = self.get(session_id, task_id)
        if checkpoint is None:
            checkpoint = ResponseCheckpointModel(
                session_id=session_id,
                task_id=task_id,
                actor_id=actor_id,
                milestone=milestone,
                submission_id=submission_id,
            )
            self.session.add(checkpoint)
        else:
            checkpoint.actor_id = actor_id
            checkpoint.milestone = milestone
            checkpoint.submission_id = submission_id
            self.session.add(checkpoint)
        self.session.flush()
        return checkpoint

    def get(self, session_id: str, task_id: str) -> ResponseCheckpointModel | None:
        return self.session.scalar(
            select(ResponseCheckpointModel).where(
                ResponseCheckpointModel.session_id == session_id,
                ResponseCheckpointModel.task_id == task_id,
            )
        )
