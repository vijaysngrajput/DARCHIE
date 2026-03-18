from app.modules.assessment_orchestration.errors import InvalidSessionStateError, InvalidTaskProgressionError


class SessionStateMachine:
    SESSION_TRANSITIONS = {
        "created": {"active", "cancelled"},
        "active": {"completed", "cancelled", "paused"},
        "paused": {"active", "cancelled"},
        "cancelled": set(),
        "completed": set(),
    }
    TASK_TRANSITIONS = {
        "pending": {"in_progress", "submitted"},
        "in_progress": {"submitted", "completed"},
        "submitted": {"gated", "completed"},
        "gated": {"completed"},
        "completed": set(),
    }
    COMMAND_STATES = {
        "start_session": {"created"},
        "resume_session": {"paused"},
        "cancel_session": {"created", "active", "paused"},
        "mark_task_submitted": {"active"},
        "evaluate_next": {"active"},
        "get_current_unit": {"created", "active", "paused", "completed"},
        "get_progress": {"created", "active", "paused", "completed", "cancelled"},
    }

    def transition_session(self, current_state: str, target_state: str) -> str:
        if target_state not in self.SESSION_TRANSITIONS.get(current_state, set()):
            raise InvalidSessionStateError(f"Cannot transition session from {current_state} to {target_state}")
        return target_state

    def transition_task(self, current_state: str, target_state: str) -> str:
        if target_state not in self.TASK_TRANSITIONS.get(current_state, set()):
            raise InvalidTaskProgressionError(f"Cannot transition task from {current_state} to {target_state}")
        return target_state

    def assert_command_allowed(self, session_state: str, command_name: str) -> None:
        allowed_states = self.COMMAND_STATES.get(command_name, set())
        if session_state not in allowed_states:
            raise InvalidSessionStateError(f"Command {command_name} not allowed when session is {session_state}")
