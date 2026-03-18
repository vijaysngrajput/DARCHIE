import pytest

from app.modules.assessment_orchestration.errors import InvalidSessionStateError, InvalidTaskProgressionError
from app.modules.assessment_orchestration.state_machine import SessionStateMachine


def test_session_state_machine_allows_created_to_active() -> None:
    machine = SessionStateMachine()

    assert machine.transition_session("created", "active") == "active"


def test_session_state_machine_rejects_invalid_transition() -> None:
    machine = SessionStateMachine()

    with pytest.raises(InvalidSessionStateError):
        machine.transition_session("completed", "active")


def test_task_state_machine_rejects_invalid_transition() -> None:
    machine = SessionStateMachine()

    with pytest.raises(InvalidTaskProgressionError):
        machine.transition_task("pending", "completed")
