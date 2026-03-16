from collections.abc import Iterator
from uuid import uuid4

from fastapi import Depends, Header, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import transactional_session
from app.core.events import DomainEventPublisher, InMemoryDomainEventPublisher


class RequestContext(BaseModel):
    request_id: str = Field(min_length=1)
    actor_id: str | None = None
    roles: list[str] = Field(default_factory=list)
    audit_source: str = "api"


def get_request_context(
    request: Request,
    x_request_id: str | None = Header(default=None),
    x_actor_id: str | None = Header(default=None),
    x_roles: str | None = Header(default=None),
) -> RequestContext:
    request_id = getattr(request.state, "request_id", None) or x_request_id or request.headers.get("x-request-id") or str(uuid4())
    raw_roles = x_roles or request.headers.get("x-roles") or ""
    roles = [role.strip() for role in raw_roles.split(",") if role.strip()]
    return RequestContext(
        request_id=request_id,
        actor_id=x_actor_id or request.headers.get("x-actor-id"),
        roles=roles,
        audit_source="api",
    )


def get_db_session() -> Iterator[Session]:
    with transactional_session() as session:
        yield session


def get_event_publisher(
    session: Session = Depends(get_db_session),
) -> DomainEventPublisher:
    return InMemoryDomainEventPublisher(session)
