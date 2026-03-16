from pydantic import BaseModel


class LoginSucceededEvent(BaseModel):
    user_id: str
    access_session_id: str


class LoginFailedEvent(BaseModel):
    email: str


class AccessDeniedEvent(BaseModel):
    actor_id: str
    resource_type: str
    resource_id: str | None
    action: str


class RoleAssignmentChangedEvent(BaseModel):
    user_id: str
    role_name: str
    change_type: str
