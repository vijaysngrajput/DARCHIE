import pytest

from app.modules.identity_access.errors import AuthenticationFailedError
from app.modules.identity_access.schemas.auth import LoginRequest


def test_login_returns_session(authentication_service, seeded_users) -> None:
    response = authentication_service.login(LoginRequest(email="candidate@example.com", password="secret123"))

    assert response.user_id == seeded_users["candidate"].user_id
    assert "candidate" in response.roles


def test_login_rejects_bad_password(authentication_service, seeded_users) -> None:
    with pytest.raises(AuthenticationFailedError):
        authentication_service.login(LoginRequest(email="candidate@example.com", password="wrong"))
