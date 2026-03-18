from pydantic import BaseModel


class SessionLookupQuery(BaseModel):
    session_id: str


class CurrentUnitQuery(BaseModel):
    session_id: str


class ProgressQuery(BaseModel):
    session_id: str


class SessionAccessContext(BaseModel):
    actor_id: str
    roles: list[str]
    access_session_id: str | None = None
