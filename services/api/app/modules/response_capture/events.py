from dataclasses import asdict, dataclass


@dataclass(slots=True)
class ResponseDraftSavedEvent:
    session_id: str
    task_id: str
    actor_id: str
    attempt_no: int


@dataclass(slots=True)
class ResponseSubmittedEvent:
    submission_id: str
    session_id: str
    task_id: str
    actor_id: str
    submission_key: str


@dataclass(slots=True)
class ResponseArtifactLinkedEvent:
    artifact_id: str
    session_id: str
    task_id: str
    actor_id: str


def to_payload(event) -> dict:
    return asdict(event)
