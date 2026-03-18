from __future__ import annotations

from app.core.database import utc_now
from app.modules.assessment_orchestration.errors import GatingNotSatisfiedError, SessionNotFoundError
from app.modules.assessment_orchestration.models import GatingStateModel
from app.modules.assessment_orchestration.schemas.commands import RefreshGatingCommand
from app.modules.assessment_orchestration.schemas.responses import GatingStatusResponse


class GatingService:
    def __init__(self, gating_repository, scoring_client, event_publisher):
        self.gating_repository = gating_repository
        self.scoring_client = scoring_client
        self.event_publisher = event_publisher

    def create_or_update_gating(self, session_id: str, task_id: str, evaluation_mode: str) -> GatingStatusResponse:
        gating = self.gating_repository.get(session_id, task_id)
        if evaluation_mode == "rule_based":
            if gating is None:
                gating = self.gating_repository.create(
                    GatingStateModel(
                        session_id=session_id,
                        task_id=task_id,
                        status="released",
                        evaluation_mode=evaluation_mode,
                        released_at=utc_now(),
                    )
                )
            else:
                gating.status = "released"
                gating.released_at = utc_now()
                gating.evaluation_mode = evaluation_mode
                gating = self.gating_repository.update(gating)
        else:
            self.scoring_client.publish_progression_hold(session_id, task_id, evaluation_mode)
            if gating is None:
                gating = self.gating_repository.create(
                    GatingStateModel(
                        session_id=session_id,
                        task_id=task_id,
                        status="awaiting_review",
                        evaluation_mode=evaluation_mode,
                        hold_reason="evaluation_pending",
                    )
                )
            else:
                gating.status = "awaiting_review"
                gating.evaluation_mode = evaluation_mode
                gating.hold_reason = "evaluation_pending"
                gating = self.gating_repository.update(gating)
        return GatingStatusResponse(
            session_id=session_id,
            task_id=task_id,
            gating_status=gating.status,
            evaluation_mode=gating.evaluation_mode,
            released=gating.status == "released",
        )

    def refresh_gating(self, session_id: str, command: RefreshGatingCommand) -> GatingStatusResponse:
        gating = self.gating_repository.get(session_id, command.task_id)
        if gating is None:
            raise SessionNotFoundError("Gating state not found")
        readiness = self.scoring_client.get_task_readiness(session_id, command.task_id)
        if readiness.get("ready"):
            gating.status = "released"
            gating.released_at = utc_now()
            gating.hold_reason = None
            gating = self.gating_repository.update(gating)
        return GatingStatusResponse(
            session_id=session_id,
            task_id=command.task_id,
            gating_status=gating.status,
            evaluation_mode=gating.evaluation_mode,
            released=gating.status == "released",
        )

    def release_if_satisfied(self, session_id: str, task_id: str) -> bool:
        gating = self.gating_repository.get(session_id, task_id)
        if gating is None:
            return True
        if gating.status != "released":
            raise GatingNotSatisfiedError()
        return True
