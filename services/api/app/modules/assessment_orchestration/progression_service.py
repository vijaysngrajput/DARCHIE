from __future__ import annotations

from app.core.database import utc_now
from app.modules.assessment_orchestration.events import SessionCompletedEvent, TaskSubmittedForProgressionEvent, to_payload
from app.modules.assessment_orchestration.models import WorkflowTransitionLogModel
from app.modules.assessment_orchestration.schemas.commands import EvaluateNextCommand, MarkTaskSubmittedCommand
from app.modules.assessment_orchestration.schemas.queries import SessionAccessContext
from app.modules.assessment_orchestration.schemas.responses import CurrentUnitResponse, ProgressionDecisionResponse


class ProgressionService:
    def __init__(
        self,
        session_repository,
        component_repository,
        task_repository,
        gating_service,
        log_repository,
        state_machine,
        policy_service,
        response_client,
        event_publisher,
    ):
        self.session_repository = session_repository
        self.component_repository = component_repository
        self.task_repository = task_repository
        self.gating_service = gating_service
        self.log_repository = log_repository
        self.state_machine = state_machine
        self.policy_service = policy_service
        self.response_client = response_client
        self.event_publisher = event_publisher

    def mark_task_submitted(self, session_id: str, command: MarkTaskSubmittedCommand, actor: SessionAccessContext) -> ProgressionDecisionResponse:
        session = self.session_repository.lock_by_id(session_id)
        task_state = self.task_repository.get(session_id, command.task_id)
        self.state_machine.assert_command_allowed(session.session_state, "mark_task_submitted")
        self.policy_service.assert_attempt_allowed(task_state, command.attempt_no)
        previous_state = task_state.state
        task_state.state = self.state_machine.transition_task(task_state.state, "submitted")
        task_state.attempt_no = command.attempt_no
        task_state.submission_id = command.submission_id
        task_state.submission_marker = command.submission_marker
        self.task_repository.update(task_state)
        self.log_repository.append(
            WorkflowTransitionLogModel(
                session_id=session_id,
                entity_type="task",
                entity_id=task_state.task_id,
                from_state=previous_state,
                to_state=task_state.state,
                command_name="mark_task_submitted",
                actor_id=actor.actor_id,
            )
        )
        self.event_publisher.stage(
            event_name="orchestration.task_submitted",
            payload=to_payload(TaskSubmittedForProgressionEvent(session_id=session_id, task_id=task_state.task_id, submission_id=command.submission_id)),
            aggregate_id=session_id,
            aggregate_type="assessment_session",
        )
        gating = self.gating_service.create_or_update_gating(session_id, task_state.task_id, task_state.evaluation_mode)
        if gating.released:
            task_state.state = self.state_machine.transition_task(task_state.state, "completed")
            task_state.gated = False
            task_state.completed_at = utc_now()
            self.task_repository.update(task_state)
            return self.evaluate_next(session_id, EvaluateNextCommand(task_id=task_state.task_id), actor)
        task_state.state = self.state_machine.transition_task(task_state.state, "gated")
        task_state.gated = True
        self.task_repository.update(task_state)
        return ProgressionDecisionResponse(
            session_id=session_id,
            component_id=task_state.component_id,
            task_id=task_state.task_id,
            task_state=task_state.state,
            session_state=session.session_state,
            gating_status=gating.gating_status,
            next_component_id=task_state.component_id,
            next_task_id=task_state.task_id,
        )

    def evaluate_next(self, session_id: str, command: EvaluateNextCommand, actor: SessionAccessContext) -> ProgressionDecisionResponse:
        session = self.session_repository.lock_by_id(session_id)
        self.state_machine.assert_command_allowed(session.session_state, "evaluate_next")
        task_states = self.task_repository.list_for_session(session_id)
        component_states = self.component_repository.list_for_session(session_id)
        next_task = next((task for task in task_states if task.state not in {"completed"}), None)
        if next_task is None:
            session.session_state = self.state_machine.transition_session(session.session_state, "completed")
            session.current_component_id = None
            session.current_task_id = None
            session.completed_at = utc_now()
            self.session_repository.update(session)
            for component in component_states:
                if component.state != "completed":
                    component.state = "completed"
                    self.component_repository.update(component)
            self.event_publisher.stage(
                event_name="orchestration.session_completed",
                payload=to_payload(SessionCompletedEvent(session_id=session_id)),
                aggregate_id=session_id,
                aggregate_type="assessment_session",
            )
            return ProgressionDecisionResponse(
                session_id=session_id,
                component_id=None,
                task_id=None,
                task_state=None,
                session_state=session.session_state,
                gating_status=None,
                next_component_id=None,
                next_task_id=None,
            )
        if next_task.state == "pending":
            next_task.state = self.state_machine.transition_task(next_task.state, "in_progress")
            self.task_repository.update(next_task)
        session.current_component_id = next_task.component_id
        session.current_task_id = next_task.task_id
        self.session_repository.update(session)
        component = self.component_repository.get(session_id, next_task.component_id)
        if component and component.state == "pending":
            component.state = "in_progress"
            self.component_repository.update(component)
        return ProgressionDecisionResponse(
            session_id=session_id,
            component_id=next_task.component_id,
            task_id=next_task.task_id,
            task_state=next_task.state,
            session_state=session.session_state,
            gating_status=None,
            next_component_id=next_task.component_id,
            next_task_id=next_task.task_id,
        )

    def resolve_current_unit(self, session) -> CurrentUnitResponse:
        task_states = self.task_repository.list_for_session(session.session_id)
        current = None
        if session.current_task_id:
            current = next((task for task in task_states if task.task_id == session.current_task_id), None)
        if current is None:
            current = next((task for task in task_states if task.state != "completed"), None)
        if current is None:
            return CurrentUnitResponse(
                session_id=session.session_id,
                component_id=None,
                task_id=None,
                task_state="completed",
                gated=False,
                evaluation_mode=None,
            )
        return CurrentUnitResponse(
            session_id=session.session_id,
            component_id=current.component_id,
            task_id=current.task_id,
            task_state=current.state,
            gated=current.gated,
            evaluation_mode=current.evaluation_mode,
        )

    def release_after_gating(self, session_id: str, task_id: str) -> ProgressionDecisionResponse:
        task_state = self.task_repository.get(session_id, task_id)
        task_state.gated = False
        task_state.state = self.state_machine.transition_task(task_state.state, "completed")
        task_state.completed_at = utc_now()
        self.task_repository.update(task_state)
        return self.evaluate_next(session_id, EvaluateNextCommand(task_id=task_id), SessionAccessContext(actor_id="system", roles=["system"]))
