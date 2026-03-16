from __future__ import annotations

from datetime import timedelta

from app.core.database import utc_now
from app.modules.identity_access.errors import AccessSessionExpiredError
from app.modules.identity_access.models import AccessSessionModel


class AccessSessionService:
    def __init__(self, access_session_repository):
        self.access_session_repository = access_session_repository

    def issue(self, user_id: str, expires_in_minutes: int = 60) -> AccessSessionModel:
        session = AccessSessionModel(
            user_id=user_id,
            state="active",
            expires_at=utc_now() + timedelta(minutes=expires_in_minutes),
        )
        return self.access_session_repository.create(session)

    def get_active_session(self, access_session_id: str) -> AccessSessionModel:
        session = self.access_session_repository.get_by_id(access_session_id)
        if session is None or session.state != "active" or session.expires_at <= utc_now():
            raise AccessSessionExpiredError()
        return session

    def refresh(self, access_session_id: str, expires_in_minutes: int = 60) -> AccessSessionModel:
        session = self.get_active_session(access_session_id)
        session.expires_at = utc_now() + timedelta(minutes=expires_in_minutes)
        return self.access_session_repository.update(session)

    def terminate(self, access_session_id: str) -> None:
        session = self.get_active_session(access_session_id)
        session.state = "terminated"
        session.terminated_at = utc_now()
        self.access_session_repository.update(session)
