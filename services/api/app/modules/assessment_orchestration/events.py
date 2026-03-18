from dataclasses import asdict, dataclass


@dataclass(slots=True)
class SessionCreatedEvent:
    session_id: str
    candidate_user_id: str
    assessment_version_id: str


@dataclass(slots=True)
class TaskSubmittedForProgressionEvent:
    session_id: str
    task_id: str
    submission_id: str


@dataclass(slots=True)
class SessionGatingReleasedEvent:
    session_id: str
    task_id: str


@dataclass(slots=True)
class SessionCompletedEvent:
    session_id: str


@dataclass(slots=True)
class SessionExpiredEvent:
    session_id: str


def to_payload(event) -> dict:
    return asdict(event)
