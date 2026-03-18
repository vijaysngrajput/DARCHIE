from __future__ import annotations

from datetime import datetime

from app.modules.assessment_orchestration.errors import AttemptPolicyViolationError, TimingPolicyViolationError
from app.modules.assessment_orchestration.models import AssessmentSessionModel, SessionTaskStateModel


class TimingAttemptPolicyService:
    def assert_session_window_valid(self, session: AssessmentSessionModel, now_utc: datetime) -> None:
        if session.expires_at is not None and session.expires_at < now_utc:
            raise TimingPolicyViolationError("Session has expired")

    def assert_attempt_allowed(self, task_state: SessionTaskStateModel, attempt_no: int) -> None:
        if attempt_no <= 0:
            raise AttemptPolicyViolationError("Attempt number must be positive")
        if task_state.attempt_no and attempt_no < task_state.attempt_no:
            raise AttemptPolicyViolationError("Attempt number cannot go backwards")
        if attempt_no > task_state.attempt_no + 1:
            raise AttemptPolicyViolationError("Attempt number cannot skip ahead")

    def build_policy_snapshots(self, assessment_version: dict) -> tuple[dict, dict]:
        timing = assessment_version.get("timing_policy", {"session_duration_minutes": 60})
        attempt = assessment_version.get("attempt_policy", {"max_attempts": 1})
        return timing, attempt
