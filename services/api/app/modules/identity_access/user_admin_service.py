from __future__ import annotations

import hashlib

from app.modules.identity_access.errors import InvalidRoleAssignmentError, UserNotFoundError
from app.modules.identity_access.events import RoleAssignmentChangedEvent
from app.modules.identity_access.models import RoleAssignmentModel, SecurityAuditEventModel, UserAccountModel
from app.modules.identity_access.schemas.admin import AssignRoleRequest, CreateUserRequest, UserAdminResponse

ALLOWED_ROLES = {"candidate", "recruiter", "hiring_manager", "admin", "reviewer", "support_admin"}


class UserAdministrationService:
    def __init__(self, user_repository, role_repository, audit_repository, event_publisher):
        self.user_repository = user_repository
        self.role_repository = role_repository
        self.audit_repository = audit_repository
        self.event_publisher = event_publisher

    def create_user(self, command: CreateUserRequest, actor_id: str) -> UserAdminResponse:
        self._validate_role(command.initial_role)
        user = self.user_repository.create(
            UserAccountModel(
                email=str(command.email),
                password_hash=self._hash_password(command.password),
                display_name=command.display_name,
            )
        )
        self.role_repository.create(RoleAssignmentModel(user_id=user.user_id, role_name=command.initial_role))
        self.audit_repository.append(
            SecurityAuditEventModel(
                actor_id=actor_id,
                event_type="user_created",
                entity_type="user",
                entity_id=user.user_id,
                payload_json="{}",
            )
        )
        return self._build_response(user.user_id)

    def assign_role(self, user_id: str, command: AssignRoleRequest, actor_id: str) -> UserAdminResponse:
        self._validate_role(command.role_name)
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError()
        if self.role_repository.get(user_id, command.role_name) is None:
            self.role_repository.create(RoleAssignmentModel(user_id=user_id, role_name=command.role_name))
        self._record_role_change(user_id, command.role_name, "assigned", actor_id)
        return self._build_response(user_id)

    def remove_role(self, user_id: str, role_name: str, actor_id: str) -> UserAdminResponse:
        self._validate_role(role_name)
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError()
        existing = self.role_repository.get(user_id, role_name)
        if existing is None:
            raise InvalidRoleAssignmentError("Role assignment does not exist")
        roles = self.role_repository.list_roles_for_user(user_id)
        if len(roles) <= 1:
            raise InvalidRoleAssignmentError("Every user must have at least one valid role")
        self.role_repository.delete(existing)
        self._record_role_change(user_id, role_name, "removed", actor_id)
        return self._build_response(user_id)

    def _build_response(self, user_id: str) -> UserAdminResponse:
        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError()
        roles = [role.role_name for role in self.role_repository.list_roles_for_user(user_id)]
        return UserAdminResponse(user_id=user.user_id, email=user.email, display_name=user.display_name, roles=roles)

    def _record_role_change(self, user_id: str, role_name: str, change_type: str, actor_id: str) -> None:
        self.event_publisher.stage(
            event_name="identity.role_assignment_changed",
            payload=RoleAssignmentChangedEvent(user_id=user_id, role_name=role_name, change_type=change_type).model_dump(),
            aggregate_id=user_id,
            aggregate_type="user",
        )
        self.audit_repository.append(
            SecurityAuditEventModel(
                actor_id=actor_id,
                event_type=f"role_{change_type}",
                entity_type="user",
                entity_id=user_id,
                payload_json="{}",
            )
        )

    @staticmethod
    def _hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    @staticmethod
    def _validate_role(role_name: str) -> None:
        if role_name not in ALLOWED_ROLES:
            raise InvalidRoleAssignmentError(f"Unsupported role: {role_name}")
