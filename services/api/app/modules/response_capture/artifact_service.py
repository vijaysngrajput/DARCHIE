from __future__ import annotations

import json

from app.modules.response_capture.errors import ArtifactReferenceError, ResponseAccessDeniedError
from app.modules.response_capture.events import ResponseArtifactLinkedEvent, to_payload
from app.modules.response_capture.models import ResponseArtifactModel
from app.modules.response_capture.schemas.commands import CreateArtifactMetadataRequest
from app.modules.response_capture.schemas.responses import ArtifactMetadataResponse


class ResponseArtifactService:
    def __init__(self, artifact_repository, draft_repository, submission_repository, orchestration_client, event_publisher):
        self.artifact_repository = artifact_repository
        self.draft_repository = draft_repository
        self.submission_repository = submission_repository
        self.orchestration_client = orchestration_client
        self.event_publisher = event_publisher

    def create_artifact_metadata(self, command: CreateArtifactMetadataRequest, actor_id: str) -> ArtifactMetadataResponse:
        if not actor_id:
            raise ResponseAccessDeniedError()
        self.orchestration_client.assert_submission_allowed(command.session_id, command.task_id, actor_id, attempt_no=1)
        draft = self.draft_repository.get_current(command.session_id, command.task_id, actor_id)
        submission = self.submission_repository.get_by_task(command.session_id, command.task_id, actor_id)
        if draft is None and submission is None:
            raise ArtifactReferenceError("Artifact metadata requires an existing draft or submission")
        model = self.artifact_repository.create(
            ResponseArtifactModel(
                session_id=command.session_id,
                task_id=command.task_id,
                actor_id=actor_id,
                artifact_kind=command.artifact_kind,
                storage_reference=command.storage_reference,
                metadata_json=json.dumps(command.metadata),
            )
        )
        self.event_publisher.stage(
            event_name="response.artifact_linked",
            payload=to_payload(
                ResponseArtifactLinkedEvent(
                    artifact_id=model.artifact_id,
                    session_id=model.session_id,
                    task_id=model.task_id,
                    actor_id=model.actor_id,
                )
            ),
            aggregate_id=model.session_id,
            aggregate_type="response",
        )
        return ArtifactMetadataResponse(
            artifact_id=model.artifact_id,
            session_id=model.session_id,
            task_id=model.task_id,
            actor_id=model.actor_id,
            artifact_kind=model.artifact_kind,
            storage_reference=model.storage_reference,
            metadata=command.metadata,
        )
