from datetime import datetime

from pydantic import BaseModel, EmailStr, SecretStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr


class RefreshSessionRequest(BaseModel):
    access_session_id: str


class AuthSessionResponse(BaseModel):
    access_session_id: str
    user_id: str
    email: EmailStr
    display_name: str
    roles: list[str]
    expires_at: datetime


class CurrentUserResponse(BaseModel):
    user_id: str
    email: EmailStr
    display_name: str
    roles: list[str]
