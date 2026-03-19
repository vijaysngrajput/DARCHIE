from __future__ import annotations

from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.assessment_orchestration.models import (
    AssessmentSessionModel,
    CandidateAssignmentModel,
    GatingStateModel,
    SessionComponentStateModel,
    SessionTaskStateModel,
    WorkflowTransitionLogModel,
)


class CandidateAssignmentRepository(Protocol):
    def create(self, model: CandidateAssignmentModel) -> CandidateAssignmentModel: ...
    def get_by_id(self, assignment_id: str) -> CandidateAssignmentModel | None: ...
    def get_by_current_session_id(self, session_id: str) -> CandidateAssignmentModel | None: ...
    def list_for_candidate(self, candidate_user_id: str) -> list[CandidateAssignmentModel]: ...
    def update(self, model: CandidateAssignmentModel) -> CandidateAssignmentModel: ...


class AssessmentSessionRepository(Protocol):
    def create(self, model: AssessmentSessionModel) -> AssessmentSessionModel: ...
    def get_by_id(self, session_id: str) -> AssessmentSessionModel | None: ...
    def lock_by_id(self, session_id: str) -> AssessmentSessionModel | None: ...
    def update(self, model: AssessmentSessionModel) -> AssessmentSessionModel: ...
    def list_for_candidate(self, candidate_user_id: str) -> list[AssessmentSessionModel]: ...
    def list_recent_completed_for_candidate(self, candidate_user_id: str, limit: int = 5) -> list[AssessmentSessionModel]: ...


class SessionComponentStateRepository(Protocol):
    def create(self, model: SessionComponentStateModel) -> SessionComponentStateModel: ...
    def list_for_session(self, session_id: str) -> list[SessionComponentStateModel]: ...
    def get(self, session_id: str, component_id: str) -> SessionComponentStateModel | None: ...
    def update(self, model: SessionComponentStateModel) -> SessionComponentStateModel: ...


class SessionTaskStateRepository(Protocol):
    def create(self, model: SessionTaskStateModel) -> SessionTaskStateModel: ...
    def list_for_session(self, session_id: str) -> list[SessionTaskStateModel]: ...
    def get(self, session_id: str, task_id: str) -> SessionTaskStateModel | None: ...
    def update(self, model: SessionTaskStateModel) -> SessionTaskStateModel: ...


class GatingStateRepository(Protocol):
    def create(self, model: GatingStateModel) -> GatingStateModel: ...
    def get(self, session_id: str, task_id: str) -> GatingStateModel | None: ...
    def update(self, model: GatingStateModel) -> GatingStateModel: ...


class WorkflowTransitionLogRepository(Protocol):
    def append(self, model: WorkflowTransitionLogModel) -> WorkflowTransitionLogModel: ...
    def list_for_session(self, session_id: str) -> list[WorkflowTransitionLogModel]: ...


class SQLAlchemyCandidateAssignmentRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: CandidateAssignmentModel) -> CandidateAssignmentModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get_by_id(self, assignment_id: str) -> CandidateAssignmentModel | None:
        return self.session.scalar(select(CandidateAssignmentModel).where(CandidateAssignmentModel.assignment_id == assignment_id))

    def get_by_current_session_id(self, session_id: str) -> CandidateAssignmentModel | None:
        return self.session.scalar(select(CandidateAssignmentModel).where(CandidateAssignmentModel.current_session_id == session_id))

    def list_for_candidate(self, candidate_user_id: str) -> list[CandidateAssignmentModel]:
        return list(
            self.session.scalars(
                select(CandidateAssignmentModel)
                .where(CandidateAssignmentModel.candidate_user_id == candidate_user_id)
                .order_by(CandidateAssignmentModel.created_at.desc())
            )
        )

    def update(self, model: CandidateAssignmentModel) -> CandidateAssignmentModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemyAssessmentSessionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: AssessmentSessionModel) -> AssessmentSessionModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get_by_id(self, session_id: str) -> AssessmentSessionModel | None:
        return self.session.scalar(select(AssessmentSessionModel).where(AssessmentSessionModel.session_id == session_id))

    def lock_by_id(self, session_id: str) -> AssessmentSessionModel | None:
        return self.get_by_id(session_id)

    def update(self, model: AssessmentSessionModel) -> AssessmentSessionModel:
        self.session.add(model)
        self.session.flush()
        return model

    def list_for_candidate(self, candidate_user_id: str) -> list[AssessmentSessionModel]:
        return list(
            self.session.scalars(
                select(AssessmentSessionModel)
                .where(AssessmentSessionModel.candidate_user_id == candidate_user_id)
                .order_by(AssessmentSessionModel.created_at.desc())
            )
        )

    def list_recent_completed_for_candidate(self, candidate_user_id: str, limit: int = 5) -> list[AssessmentSessionModel]:
        return list(
            self.session.scalars(
                select(AssessmentSessionModel)
                .where(
                    AssessmentSessionModel.candidate_user_id == candidate_user_id,
                    AssessmentSessionModel.session_state == "completed",
                )
                .order_by(AssessmentSessionModel.completed_at.desc().nullslast(), AssessmentSessionModel.created_at.desc())
                .limit(limit)
            )
        )


class SQLAlchemySessionComponentStateRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: SessionComponentStateModel) -> SessionComponentStateModel:
        self.session.add(model)
        self.session.flush()
        return model

    def list_for_session(self, session_id: str) -> list[SessionComponentStateModel]:
        return list(self.session.scalars(select(SessionComponentStateModel).where(SessionComponentStateModel.session_id == session_id).order_by(SessionComponentStateModel.sequence_no)))

    def get(self, session_id: str, component_id: str) -> SessionComponentStateModel | None:
        return self.session.scalar(select(SessionComponentStateModel).where(SessionComponentStateModel.session_id == session_id, SessionComponentStateModel.component_id == component_id))

    def update(self, model: SessionComponentStateModel) -> SessionComponentStateModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemySessionTaskStateRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: SessionTaskStateModel) -> SessionTaskStateModel:
        self.session.add(model)
        self.session.flush()
        return model

    def list_for_session(self, session_id: str) -> list[SessionTaskStateModel]:
        return list(self.session.scalars(select(SessionTaskStateModel).where(SessionTaskStateModel.session_id == session_id).order_by(SessionTaskStateModel.sequence_no)))

    def get(self, session_id: str, task_id: str) -> SessionTaskStateModel | None:
        return self.session.scalar(select(SessionTaskStateModel).where(SessionTaskStateModel.session_id == session_id, SessionTaskStateModel.task_id == task_id))

    def update(self, model: SessionTaskStateModel) -> SessionTaskStateModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemyGatingStateRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: GatingStateModel) -> GatingStateModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get(self, session_id: str, task_id: str) -> GatingStateModel | None:
        return self.session.scalar(select(GatingStateModel).where(GatingStateModel.session_id == session_id, GatingStateModel.task_id == task_id))

    def update(self, model: GatingStateModel) -> GatingStateModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemyWorkflowTransitionLogRepository:
    def __init__(self, session: Session):
        self.session = session

    def append(self, model: WorkflowTransitionLogModel) -> WorkflowTransitionLogModel:
        self.session.add(model)
        self.session.flush()
        return model

    def list_for_session(self, session_id: str) -> list[WorkflowTransitionLogModel]:
        return list(self.session.scalars(select(WorkflowTransitionLogModel).where(WorkflowTransitionLogModel.session_id == session_id).order_by(WorkflowTransitionLogModel.created_at)))
