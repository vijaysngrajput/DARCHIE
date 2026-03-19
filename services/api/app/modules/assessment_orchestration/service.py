from __future__ import annotations

import json
from datetime import UTC, timedelta

from sqlalchemy import select

from app.core.database import utc_now
from app.modules.assessment_orchestration.errors import (
    AssignmentNotFoundError,
    InvalidSessionStateError,
    SessionAccessDeniedError,
    SessionNotFoundError,
)
from app.modules.assessment_orchestration.events import SessionCreatedEvent, to_payload
from app.modules.assessment_orchestration.models import (
    AssessmentSessionModel,
    AttemptPolicySnapshotModel,
    CandidateAssignmentModel,
    SessionComponentStateModel,
    SessionTaskStateModel,
    TimingPolicySnapshotModel,
    WorkflowTransitionLogModel,
)
from app.modules.assessment_orchestration.schemas.commands import CancelSessionCommand, CreateSessionCommand, ResumeSessionCommand, StartSessionCommand
from app.modules.assessment_orchestration.schemas.queries import CurrentUnitQuery, ProgressQuery, SessionAccessContext, SessionLookupQuery
from app.modules.assessment_orchestration.schemas.responses import (
    CandidateAssignmentSummaryResponse,
    CandidateHomeViewResponse,
    CandidateProfileResponse,
    CurrentUnitResponse,
    ProgressResponse,
    SessionSummaryResponse,
)
from app.modules.identity_access.models import UserAccountModel


ACTIVE_SESSION_STATES = {"created", "active", "paused"}
RESUMABLE_ASSIGNMENT_STATES = {"invited", "in_progress", "reopened"}


class AssessmentSessionService:
    def __init__(
        self,
        assignment_repository,
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
        self.assignment_repository = assignment_repository
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

    def _assert_candidate_actor(self, actor: SessionAccessContext, message: str) -> None:
        if actor.actor_id is None or "candidate" not in actor.roles:
            raise SessionAccessDeniedError(message)

    def _assert_can_access(self, session: AssessmentSessionModel, actor: SessionAccessContext) -> None:
        if "admin" in actor.roles:
            return
        if "candidate" not in actor.roles or actor.actor_id != session.candidate_user_id:
            raise SessionAccessDeniedError()

    def _assert_can_access_assignment(self, assignment: CandidateAssignmentModel, actor: SessionAccessContext) -> None:
        if "admin" in actor.roles:
            return
        if "candidate" not in actor.roles or actor.actor_id != assignment.candidate_user_id:
            raise SessionAccessDeniedError("Assignment access denied")

    def _coerce_utc(self, value):
        if value is None:
            return None
        if value.tzinfo is None:
            return value.replace(tzinfo=UTC)
        return value.astimezone(UTC)

    def _time_remaining_seconds(self, expires_at) -> int | None:
        normalized = self._coerce_utc(expires_at)
        if normalized is None:
            return None
        return max(int((normalized - utc_now()).total_seconds()), 0)

    def _assignment_route(self, assignment: CandidateAssignmentModel) -> tuple[str | None, str | None, str | None, str | None]:
        if assignment.assignment_state == "invited":
            return "Start assessment", f"/candidate?assignment={assignment.assignment_id}", None, None
        if assignment.assignment_state in {"in_progress", "reopened"} and assignment.current_session_id:
            return (
                "Resume assessment",
                self._next_route(self.session_repository.get_by_id(assignment.current_session_id)) if self.session_repository.get_by_id(assignment.current_session_id) else f"/candidate/sessions/{assignment.current_session_id}",
                "Review session",
                f"/candidate/sessions/{assignment.current_session_id}",
            )
        if assignment.assignment_state == "completed" and assignment.latest_completed_session_id:
            return (
                "View completion",
                f"/candidate/sessions/{assignment.latest_completed_session_id}/complete",
                None,
                None,
            )
        if assignment.assignment_state == "expired":
            target = assignment.current_session_id or assignment.latest_completed_session_id
            route = f"/candidate/sessions/{target}/expired" if target else "/candidate"
            return "View expired state", route, None, None
        return None, None, None, None

    def _sync_assignment_state(self, assignment: CandidateAssignmentModel) -> CandidateAssignmentModel:
        now = utc_now()
        invite_expires_at = self._coerce_utc(assignment.invite_expires_at)
        changed = False
        session = None
        if assignment.current_session_id:
            session = self.session_repository.get_by_id(assignment.current_session_id)
            if session is not None:
                session = self._sync_session_expiry(session)
                if session.session_state == "completed":
                    assignment.assignment_state = "completed"
                    assignment.latest_completed_session_id = session.session_id
                    assignment.current_session_id = None
                    assignment.completed_at = session.completed_at or now
                    changed = True
                elif session.session_state == "expired":
                    assignment.assignment_state = "expired"
                    assignment.expired_at = session.expires_at or now
                    assignment.current_session_id = None
                    changed = True
            else:
                assignment.current_session_id = None
                changed = True

        if assignment.assignment_state in {"invited", "reopened"} and invite_expires_at and invite_expires_at <= now:
            assignment.assignment_state = "expired"
            assignment.expired_at = invite_expires_at
            assignment.current_session_id = None
            changed = True

        if changed:
            self.assignment_repository.update(assignment)
        return assignment

    def _sync_session_expiry(self, session: AssessmentSessionModel) -> AssessmentSessionModel:
        expires_at = self._coerce_utc(session.expires_at)
        if expires_at is None:
            return session
        if session.session_state in ACTIVE_SESSION_STATES and expires_at <= utc_now():
            session.session_state = "expired"
            self.session_repository.update(session)
            assignment = self.assignment_repository.get_by_current_session_id(session.session_id)
            if assignment is not None:
                assignment.assignment_state = "expired"
                assignment.expired_at = expires_at
                assignment.current_session_id = None
                self.assignment_repository.update(assignment)
        return session

    def _get_session_or_raise(self, session_id: str) -> AssessmentSessionModel:
        session = self.session_repository.get_by_id(session_id)
        if session is None:
            raise SessionNotFoundError()
        return self._sync_session_expiry(session)

    def _get_assignment_or_raise(self, assignment_id: str) -> CandidateAssignmentModel:
        assignment = self.assignment_repository.get_by_id(assignment_id)
        if assignment is None:
            raise AssignmentNotFoundError()
        return self._sync_assignment_state(assignment)

    def _to_summary(self, session: AssessmentSessionModel) -> SessionSummaryResponse:
        session = self._sync_session_expiry(session)
        is_expired = session.session_state == "expired"
        is_completed = session.session_state == "completed"
        is_resumable = session.session_state in ACTIVE_SESSION_STATES and not is_expired and not is_completed
        return SessionSummaryResponse(
            session_id=session.session_id,
            assignment_id=session.assignment_id,
            assessment_version_id=session.assessment_version_id,
            session_state=session.session_state,
            current_component_id=session.current_component_id,
            current_task_id=session.current_task_id,
            started_at=session.started_at,
            expires_at=session.expires_at,
            is_resumable=is_resumable,
            is_expired=is_expired,
            is_completed=is_completed,
            next_route=self._next_route(session),
            time_remaining_seconds=self._time_remaining_seconds(session.expires_at),
        )

    def _build_progress(self, session: AssessmentSessionModel) -> ProgressResponse:
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

    def _to_assignment_summary(self, assignment: CandidateAssignmentModel) -> CandidateAssignmentSummaryResponse:
        assignment = self._sync_assignment_state(assignment)
        progress_summary = None
        current_task_id = None
        current_session_expires_at = None
        time_remaining_seconds = None
        if assignment.current_session_id:
            session = self.session_repository.get_by_id(assignment.current_session_id)
            if session is not None:
                session = self._sync_session_expiry(session)
                if session.session_state in ACTIVE_SESSION_STATES | {"completed"}:
                    progress_summary = self._build_progress(session)
                    current_task_id = session.current_task_id
                    current_session_expires_at = session.expires_at
                    time_remaining_seconds = self._time_remaining_seconds(session.expires_at)
        primary_action, primary_route, secondary_action, secondary_route = self._assignment_route(assignment)
        return CandidateAssignmentSummaryResponse(
            assignment_id=assignment.assignment_id,
            assessment_version_id=assignment.assessment_version_id,
            assignment_state=assignment.assignment_state,
            invite_expires_at=assignment.invite_expires_at,
            current_session_id=assignment.current_session_id,
            latest_completed_session_id=assignment.latest_completed_session_id,
            latest_progress_summary=progress_summary,
            primary_action=primary_action,
            primary_route=primary_route,
            secondary_action=secondary_action,
            secondary_route=secondary_route,
            current_task_id=current_task_id,
            current_session_expires_at=current_session_expires_at,
            time_remaining_seconds=time_remaining_seconds,
        )

    def _next_route(self, session: AssessmentSessionModel | None) -> str:
        if session is None:
            return "/candidate"
        if session.session_state == "completed":
            return f"/candidate/sessions/{session.session_id}/complete"
        if session.session_state == "expired":
            return f"/candidate/sessions/{session.session_id}/expired"
        if session.session_state == "active":
            return f"/candidate/sessions/{session.session_id}/task"
        if session.session_state in {"created", "paused"}:
            return f"/candidate/sessions/{session.session_id}"
        return "/candidate"

    def _create_session_from_assignment(self, assignment: CandidateAssignmentModel, actor: SessionAccessContext) -> AssessmentSessionModel:
        assessment_version = self.content_client.get_published_assessment_version(assignment.assessment_version_id)
        timing_policy, attempt_policy = self.policy_service.build_policy_snapshots(assessment_version)
        session = self.session_repository.create(
            AssessmentSessionModel(
                assignment_id=assignment.assignment_id,
                assessment_version_id=assignment.assessment_version_id,
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
        return session

    def build_candidate_home_view(self, actor: SessionAccessContext) -> CandidateHomeViewResponse:
        self._assert_candidate_actor(actor, "Candidate role required to view candidate home")
        candidate = self.db_session.scalar(select(UserAccountModel).where(UserAccountModel.user_id == actor.actor_id))
        assignments = [self._to_assignment_summary(assignment) for assignment in self.assignment_repository.list_for_candidate(actor.actor_id)]
        assignments.sort(key=lambda item: (item.assignment_state not in {"in_progress", "reopened", "invited"}, item.assignment_id))
        return CandidateHomeViewResponse(
            candidate_profile=CandidateProfileResponse(
                user_id=actor.actor_id,
                email=candidate.email if candidate else None,
                display_name=candidate.display_name if candidate else None,
            ),
            assignments=assignments,
        )

    def build_candidate_landing_view(self, query: SessionLookupQuery, actor: SessionAccessContext) -> tuple[SessionSummaryResponse, CurrentUnitResponse, ProgressResponse]:
        session = self._get_session_or_raise(query.session_id)
        self._assert_can_access(session, actor)
        return self._to_summary(session), self.progression_service.resolve_current_unit(session), self.get_progress(ProgressQuery(session_id=query.session_id), actor)

    def create_session(self, command: CreateSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        self._assert_candidate_actor(actor, "Candidate role required to create a session")
        assignment = self.assignment_repository.get_by_id(command.assignment_id)
        if assignment is not None:
            self._assert_can_access_assignment(assignment, actor)
            if assignment.assessment_version_id != command.assessment_version_id:
                raise InvalidSessionStateError("Assignment assessment version does not match the requested session")
            if assignment.assignment_state == "completed":
                raise InvalidSessionStateError("Completed assignments cannot be restarted by the candidate")
            if assignment.current_session_id:
                existing = self.session_repository.get_by_id(assignment.current_session_id)
                if existing is not None and self._sync_session_expiry(existing).session_state in ACTIVE_SESSION_STATES:
                    return self._to_summary(existing)
        session = self._create_session_from_assignment(
            assignment
            if assignment is not None
            else CandidateAssignmentModel(
                assignment_id=command.assignment_id,
                candidate_user_id=actor.actor_id,
                assessment_version_id=command.assessment_version_id,
                assignment_state="in_progress",
            ),
            actor,
        )
        if assignment is not None:
            assignment.assignment_state = "in_progress"
            assignment.current_session_id = session.session_id
            assignment.started_at = assignment.started_at or utc_now()
            self.assignment_repository.update(assignment)
        return self._to_summary(session)

    def start_assignment_session(self, assignment_id: str, actor: SessionAccessContext) -> SessionSummaryResponse:
        self._assert_candidate_actor(actor, "Candidate role required to start an assignment session")
        assignment = self._get_assignment_or_raise(assignment_id)
        self._assert_can_access_assignment(assignment, actor)
        if assignment.assignment_state == "completed":
            raise InvalidSessionStateError("Completed assignments cannot be restarted by the candidate")
        if assignment.assignment_state == "expired":
            raise InvalidSessionStateError("Expired assignments cannot be started")
        if assignment.current_session_id:
            existing = self.session_repository.get_by_id(assignment.current_session_id)
            if existing is not None:
                existing = self._sync_session_expiry(existing)
                if existing.session_state in ACTIVE_SESSION_STATES:
                    assignment.assignment_state = "in_progress"
                    self.assignment_repository.update(assignment)
                    return self._to_summary(existing)
        if assignment.assignment_state not in RESUMABLE_ASSIGNMENT_STATES:
            raise InvalidSessionStateError(f"Assignment cannot be started from state {assignment.assignment_state}")
        session = self._create_session_from_assignment(assignment, actor)
        assignment.assignment_state = "in_progress"
        assignment.current_session_id = session.session_id
        assignment.started_at = assignment.started_at or utc_now()
        self.assignment_repository.update(assignment)
        return self._to_summary(session)

    def start_session(self, session_id: str, command: StartSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        _ = command
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "start_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "active")
        now = utc_now()
        session.started_at = now
        session.expires_at = now + timedelta(minutes=60)
        self.policy_service.assert_session_window_valid(session, now)
        self.session_repository.update(session)
        assignment = self.assignment_repository.get_by_id(session.assignment_id)
        if assignment is not None:
            assignment.assignment_state = "in_progress"
            assignment.current_session_id = session.session_id
            assignment.started_at = assignment.started_at or now
            self.assignment_repository.update(assignment)
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
        _ = command
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        if session.session_state == "active":
            return self._to_summary(session)
        self.state_machine.assert_command_allowed(session.session_state, "resume_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "active")
        self.session_repository.update(session)
        assignment = self.assignment_repository.get_by_id(session.assignment_id)
        if assignment is not None:
            assignment.assignment_state = "in_progress"
            assignment.current_session_id = session.session_id
            self.assignment_repository.update(assignment)
        return self._to_summary(session)

    def cancel_session(self, session_id: str, command: CancelSessionCommand, actor: SessionAccessContext) -> SessionSummaryResponse:
        _ = command
        session = self._get_session_or_raise(session_id)
        self._assert_can_access(session, actor)
        self.state_machine.assert_command_allowed(session.session_state, "cancel_session")
        session.session_state = self.state_machine.transition_session(session.session_state, "cancelled")
        session.cancelled_at = utc_now()
        self.session_repository.update(session)
        assignment = self.assignment_repository.get_by_id(session.assignment_id)
        if assignment is not None:
            assignment.assignment_state = "cancelled"
            assignment.cancelled_at = session.cancelled_at
            assignment.current_session_id = None
            self.assignment_repository.update(assignment)
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
        return self._build_progress(session)
