class ContentClient:
    def get_published_assessment_version(self, assessment_version_id: str) -> dict:
        component_id = f"component-{assessment_version_id}-1"
        task_id = f"task-{assessment_version_id}-1"
        return {
            "assessment_version_id": assessment_version_id,
            "timing_policy": {"session_duration_minutes": 60},
            "attempt_policy": {"max_attempts": 1},
            "components": [
                {
                    "component_id": component_id,
                    "sequence_no": 1,
                    "tasks": [
                        {
                            "task_id": task_id,
                            "sequence_no": 1,
                            "evaluation_mode": "rule_based",
                        }
                    ],
                }
            ],
        }
