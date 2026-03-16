from typing import Protocol

from pydantic import BaseModel
from sqlalchemy.orm import Session


class EventEnvelope(BaseModel):
    event_name: str
    payload: dict
    aggregate_id: str
    aggregate_type: str


class DomainEventPublisher(Protocol):
    events: list[EventEnvelope]

    def stage(self, event_name: str, payload: dict, aggregate_id: str, aggregate_type: str) -> None: ...


class InMemoryDomainEventPublisher:
    def __init__(self, session: Session):
        self._session = session
        self.events: list[EventEnvelope] = self._session.info.setdefault("staged_events", [])

    def stage(self, event_name: str, payload: dict, aggregate_id: str, aggregate_type: str) -> None:
        envelope = EventEnvelope(
            event_name=event_name,
            payload=payload,
            aggregate_id=aggregate_id,
            aggregate_type=aggregate_type,
        )
        self.events.append(envelope)
