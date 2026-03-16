from __future__ import annotations

from app.modules.identity_access.errors import AuthorizationDeniedError, UserNotFoundError
from app.modules.identity_access.events import AccessDeniedEvent
from app.modules.identity_access.models import SecurityAuditEventModel
from app.modules.identity_access.permissions import ROLE_ACTIONS, can_access_owned_resource, can_access_scoped_resource, resource_requires_scope
from app.modules.identity_access.schemas.access import AccessCheckRequest, AccessContextResponse, AccessDecisionResponse


class AuthorizationService:
    def __init__(self, user_repository, role_repository, resource_grant_repository, audit_repository, event_publisher):
        self.user_repository = user_repository
        self.role_repository = role_repository
        self.resource_grant_repository = resource_grant_repository
        self.audit_repository = audit_repository
        self.event_publisher = event_publisher

    def check_access(self, command: AccessCheckRequest, actor_id: str) -> AccessDecisionResponse:
        roles = self._get_roles(actor_id)
        allowed = self._evaluate(command, actor_id, roles)
        if not allowed:
            self._record_denial(actor_id, command)
        return AccessDecisionResponse(
            allowed=allowed,
            actor_id=actor_id,
            roles=roles,
            scoped=resource_requires_scope(command.resource_type),
        )

    def build_access_context(self, actor_id: str, access_session_id: str | None = None) -> AccessContextResponse:
        return AccessContextResponse(actor_id=actor_id, roles=self._get_roles(actor_id), access_session_id=access_session_id)

    def assert_access(self, actor_id: str, resource_type: str, resource_id: str | None, action: str, resource_owner_id: str | None = None) -> None:
        decision = self.check_access(
            AccessCheckRequest(
                resource_type=resource_type,
                resource_id=resource_id,
                action=action,
                resource_owner_id=resource_owner_id,
            ),
            actor_id=actor_id,
        )
        if not decision.allowed:
            raise AuthorizationDeniedError()

    def _get_roles(self, actor_id: str) -> list[str]:
        user = self.user_repository.get_by_id(actor_id)
        if user is None:
            raise UserNotFoundError()
        return [role.role_name for role in self.role_repository.list_roles_for_user(actor_id)]

    def _evaluate(self, command: AccessCheckRequest, actor_id: str, roles: list[str]) -> bool:
        static_allowed = any(command.action in ROLE_ACTIONS.get(role, {}).get(command.resource_type, set()) for role in roles)
        if static_allowed:
            return True
        if command.resource_owner_id and can_access_owned_resource(actor_id, command.resource_owner_id):
            return True
        if resource_requires_scope(command.resource_type):
            grants = self.resource_grant_repository.list_for_user(actor_id)
            return can_access_scoped_resource(roles, grants, command.action)
        return False

    def _record_denial(self, actor_id: str, command: AccessCheckRequest) -> None:
        self.event_publisher.stage(
            event_name="identity.access_denied",
            payload=AccessDeniedEvent(
                actor_id=actor_id,
                resource_type=command.resource_type,
                resource_id=command.resource_id,
                action=command.action,
            ).model_dump(),
            aggregate_id=actor_id,
            aggregate_type="user",
        )
        self.audit_repository.append(
            SecurityAuditEventModel(
                actor_id=actor_id,
                event_type="access_denied",
                entity_type=command.resource_type,
                entity_id=command.resource_id,
                payload_json="{}",
            )
        )
