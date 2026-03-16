from pydantic import BaseModel


class AccessCheckRequest(BaseModel):
    resource_type: str
    resource_id: str | None = None
    action: str
    resource_owner_id: str | None = None


class AccessDecisionResponse(BaseModel):
    allowed: bool
    actor_id: str
    roles: list[str]
    scoped: bool


class AccessContextResponse(BaseModel):
    actor_id: str
    roles: list[str]
    access_session_id: str | None = None
