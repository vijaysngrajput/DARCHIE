from __future__ import annotations

import json
from datetime import timedelta

from app.core.database import utc_now
from app.modules.assessment_orchestration.errors import SessionAccessDeniedError, SessionNotFoundError
from app.modules.assessment_orchestration.events import SessionCreatedEvent, to_payload
from app.modules.assessment_orchestration.models import (
    AssessmentSessionModel,
    AttemptPolicySnapshotModel,
    SessionComponentStateModel,
    SessionTaskStateModel,
    TimingPolicySnapshotModel,
    WorkflowTransitionLogModel,
)
from app.modules.assessment_orchestration.schemas.commands import CancelSessionCommand, CreateSessionCommand, ResumeSessionCommand, StartSessionCommand
from app.modules.assessment_orchestration.schemas.queries import CurrentUnitQuery, ProgressQuery, SessionAccessContext, SessionLookupQuery
from app.modules.assessment_orchestration.schemas.responses import CurrentUnitResponse, ProgressResponse, SessionSummaryResponse


class AssessmentSessionService:
    def __init__(
        self,
        session_repository,
        component_repository,
        task_repository,
        gating_repository,
        log_repository,
        state_machine,
        policy_service,
        progression_service,
        content_client,
        event_publisher,
        db_session,
    ):
        self.session_repository = session_repository
        self.component_repository = component_repository
        self.task_repository = task_repository
        self.gating_repository = gating_repository
        self.log_repository = log_repository
        self.state_machine = state_machine
        self.policy_service = policy_service
        self.progression_service = progression_service
        self.content_client = content_client
        self.event_publisher = event_publisher
        self.db_session = db_session

    def _assert_can_access(self, session: AssessmentSessionModel, actor: SessionAccessContext) -> None:
        if "admin" in actor.roles:
            return
        if "candidate" not in actor.roles or actor.actor_id != session.candidate_user_id:
            raise SessionAccessDeniedError()

    def _get_session_or_raise(self, session_id: str) -> AssessmentSessionModel:
        session = self.session_repository.get_by_id(session_id)
        if session is None:
            raise SessionNotFoundError()
        return session

    def _to_summary(self, session: AssessmentSessionModel) -> SessionSummaryResponse:
        return SessionSummaryResponse(
            session_id=session.session_id,
            assignment_id=session.assignment_id,
            assessment_version_id=session.assessment_version_id,
            session_state=session.session_state,
            current_component_id=session.current_component_id,
            current_task_id=session.current_task_id,
            started_at=session.started_at,
            expires_at=session.expires_at,
        )

    def build_candidate_landing_view(self, query: SessionLookupQuery, actor: SessionAccessContext) -> tuple[SessionSummaryResponse, CurrentUnitResponse, ProgressResponse]:
        session = self._get_session_or_raise(query.session_id)
        self._assert_can_access(session, actor)
        return self._to_summary(session), self.progression_service.resolve_current_unit(session), self.get_progress(ProgressQuery(session_id=query.session_id), actor)

    def create_session(self, command: CreateSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        if actor.actor_id is None or "candidate" not in actor.roles:
            raise SessionAccessDeniedError("Candidate role required to create a session")
        assessment_version = self.content_client.get_published_assessment_version(command.assessment_version_id)
        timing_policy, attempt_policy = self.policy_service.build_policy_snapshots(assessment_version)
        session = self.session_repository.create(
            AssessmentSessionModel(
                assignment_id=command.assignment_id,
                assessment_version_id=command.assessment_version_id,
                candidate_user_id=actor.actor_id,
            )
        )
        components = assessment_version.get("components", [])
        for component in components:
            self.component_repository.create(
                SessionComponentStateModel(
                    session_id=session.session_id,
                    component_id=component["component_id"],
                    sequence_no=component["sequence_no"],
                )
            )
            for task in component.get("tasks", []):
                self.task_repository.create(
                    SessionTaskStateModel(
                        session_id=session.session_id,
                        component_id=component["component_id"],
                        task_id=task["task_id"],
                        sequence_no=task["sequence_no"],
                        evaluation_mode=task.get("evaluation_mode", "rule_based"),
                    )
                )
        self.db_session.add(TimingPolicySnapshotModel(session_id=session.session_id, policy_json=json.dumps(timing_policy)))
        self.db_session.add(AttemptPolicySnapshotModel(session_id=session.session_id, policy_json=json.dumps(attempt_policy)))
        first_component = components[0] if components else None
        first_task = first_component.get("tasks", [None])[0] if first_component else None
        session.current_component_id = first_component["component_id"] if first_component else None
        session.current_task_id = first_task["task_id"] if first_task else None
        self.session_repository.update(session)
        self.log_repository.append(
            WorkflowTransitionLogModel(
                session_id=session.session_id,
                entity_type="session",
                entity_id=session.session_id,
                from_state=None,
                to_state=session.session_state,
                command_name="create_session",
                actor_id=actor.actor_id,
            )
        )
        self.event_publisher.stage(
            event_name="orchestration.session_created",
            payload=to_payload(
                SessionCreatedEvent(
                    session_id=session.session_id,
                    candidate_user_id=actor.actor_id,
                    assessment_version_id=session.assessment_version_id,
                )
            ),
            aggregate_id=session.session_id,
            aggregate_type="assessment_session",
        )
        return self._to_summary(session)

    def start_session(self, session_id: str, command: StartSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "start_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "active")
        now = utc_now()
        session.started_at = now
        session.expires_at = now + timedelta(minutes=60)
        self.policy_service.assert_session_window_valid(session, now)
        self.session_repository.update(session)
        if session.current_task_id:
            task_state = self.task_repository.get(session.session_id, session.current_task_id)
            if task_state and task_state.state == "pending":
                task_state.state = self.state_machine.transition_task(task_state.state, "in_progress")
                self.task_repository.update(task_state)
            if session.current_component_id:
                component_state = self.component_repository.get(session.session_id, session.current_component_id)
                if component_state and component_state.state == "pending":
                    component_state.state = "in_progress"
                    self.component_repository.update(component_state)
        self.log_repository.append(
            WorkflowTransitionLogModel(
                session_id=session.session_id,
                entity_type="session",
                entity_id=session.session_id,
                from_state="created",
                to_state=session.session_state,
                command_name="start_session",
                actor_id=actor.actor_id,
            )
        )
        return self._to_summary(session)

    def resume_session(self, session_id: str, command: ResumeSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "resume_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "active")
        self.session_repository.update(session)
        return self._to_summary(session)

    def cancel_session(self, session_id: str, command: CancelSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "cancel_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "cancelled")
        session.cancelled_at = utc_now()
        self.session_repository.update(session)
        return self._to_summary(session)

    def get_session_summary(self, query: SessionLookupQuery, actor: SessionAccessContext) -> SessionSummaryResponse:
        session = self._get_session_or_raise(query.session_id)
        self._assert_can_access(session, actor)
        return self._to_summary(session)

    def get_current_unit(self, query: CurrentUnitQuery, actor: SessionAccessContext) -> CurrentUnitResponse:
        session = self._get_session_or_raise(query.session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "get_current_unit")
        return self.progression_service.resolve_current_unit(session)

    def get_progress(self, query: ProgressQuery, actor: SessionAccessContext) -> ProgressResponse:
        session = self._get_session_or_raise(query.session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "get_progress")
        components = self.component_repository.list_for_session(session.session_id)
        tasks = self.task_repository.list_for_session(session.session_id)
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task.state == "completed")
        submitted_tasks = sum(1 for task in tasks if task.state in {"submitted", "gated", "completed"})
        completed_components = sum(1 for component in components if component.state == "completed")
        current_index = next((index for index, task in enumerate(tasks, start=1) if task.state != "completed"), total_tasks or 1)
        percent_complete = round((completed_tasks / total_tasks) * 100, 2) if total_tasks else 0.0
        return ProgressResponse(
            session_id=session.session_id,
            total_components=len(components),
            completed_components=completed_components,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            submitted_tasks=submitted_tasks,
            current_index=current_index,
            percent_complete=percent_complete,
        )
