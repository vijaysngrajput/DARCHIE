class ScoringStatusClient:
    def get_task_readiness(self, session_id: str, task_id: str) -> dict:
        return {"ready": True}

    def publish_progression_hold(self, session_id: str, task_id: str, evaluation_mode: str) -> None:
        return None
