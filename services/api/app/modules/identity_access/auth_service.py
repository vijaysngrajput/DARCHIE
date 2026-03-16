from __future__ import annotations

import hashlib

from app.modules.identity_access.errors import AuthenticationFailedError, UserNotFoundError
from app.modules.identity_access.events import LoginFailedEvent, LoginSucceededEvent
from app.modules.identity_access.models import SecurityAuditEventModel
from app.modules.identity_access.schemas.auth import AuthSessionResponse, CurrentUserResponse, LoginRequest, RefreshSessionRequest


class AuthenticationService:
    def __init__(
        self,
        user_repository,
        role_repository,
        access_session_service,
        audit_repository,
        event_publisher,
    ):
        self.user_repository = user_repository
        self.role_repository = role_repository
        self.access_session_service = access_session_service
        self.audit_repository = audit_repository
        self.event_publisher = event_publisher

    def login(self, command: LoginRequest) -> AuthSessionResponse:
        user = self.user_repository.get_by_email(str(command.email))
        if user is None or user.password_hash != self._hash_password(command.password.get_secret_value()):
            self.event_publisher.stage(
                event_name="identity.login_failed",
                payload=LoginFailedEvent(email=str(command.email)).model_dump(),
                aggregate_id=str(command.email),
                aggregate_type="user_email",
            )
            self.audit_repository.append(
                SecurityAuditEventModel(
                    actor_id=None,
                    event_type="login_failed",
                    entity_type="user_email",
                    entity_id=str(command.email),
                    payload_json="{}",
                )
            )
            raise AuthenticationFailedError()

        session = self.access_session_service.issue(user.user_id)
        roles = [role.role_name for role in self.role_repository.list_roles_for_user(user.user_id)]
        self.event_publisher.stage(
            event_name="identity.login_succeeded",
            payload=LoginSucceededEvent(user_id=user.user_id, access_session_id=session.access_session_id).model_dump(),
            aggregate_id=user.user_id,
            aggregate_type="user",
        )
        self.audit_repository.append(
            SecurityAuditEventModel(
                actor_id=user.user_id,
                event_type="login_succeeded",
                entity_type="user",
                entity_id=user.user_id,
                payload_json="{}",
            )
        )
        return AuthSessionResponse(
            access_session_id=session.access_session_id,
            user_id=user.user_id,
            roles=roles,
            expires_at=session.expires_at,
        )

    def logout(self, access_session_id: str, actor_id: str) -> None:
        self.access_session_service.terminate(access_session_id)
        self.audit_repository.append(
            SecurityAuditEventModel(
                actor_id=actor_id,
                event_type="logout",
                entity_type="access_session",
                entity_id=access_session_id,
                payload_json="{}",
            )
        )

    def refresh(self, command: RefreshSessionRequest) -> AuthSessionResponse:
        session = self.access_session_service.refresh(command.access_session_id)
        roles = [role.role_name for role in self.role_repository.list_roles_for_user(session.user_id)]
        return AuthSessionResponse(
            access_session_id=session.access_session_id,
            user_id=session.user_id,
            roles=roles,
            expires_at=session.expires_at,
        )

    def get_current_user(self, actor_id: str) -> CurrentUserResponse:
        user = self.user_repository.get_by_id(actor_id)
        if user is None:
            raise UserNotFoundError()
        roles = [role.role_name for role in self.role_repository.list_roles_for_user(actor_id)]
        return CurrentUserResponse(
            user_id=user.user_id,
            email=user.email,
            display_name=user.display_name,
            roles=roles,
        )

    @staticmethod
    def _hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()
