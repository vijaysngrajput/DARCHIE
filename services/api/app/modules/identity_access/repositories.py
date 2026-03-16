from __future__ import annotations

from typing import Protocol

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.identity_access.models import (
    AccessSessionModel,
    ResourceGrantModel,
    RoleAssignmentModel,
    SecurityAuditEventModel,
    UserAccountModel,
)


class UserAccountRepository(Protocol):
    def get_by_email(self, email: str) -> UserAccountModel | None: ...
    def get_by_id(self, user_id: str) -> UserAccountModel | None: ...
    def create(self, model: UserAccountModel) -> UserAccountModel: ...


class SQLAlchemyUserAccountRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str) -> UserAccountModel | None:
        return self.session.scalar(select(UserAccountModel).where(UserAccountModel.email == email))

    def get_by_id(self, user_id: str) -> UserAccountModel | None:
        return self.session.scalar(select(UserAccountModel).where(UserAccountModel.user_id == user_id))

    def create(self, model: UserAccountModel) -> UserAccountModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemyRoleAssignmentRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_roles_for_user(self, user_id: str) -> list[RoleAssignmentModel]:
        return list(self.session.scalars(select(RoleAssignmentModel).where(RoleAssignmentModel.user_id == user_id)))

    def create(self, model: RoleAssignmentModel) -> RoleAssignmentModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get(self, user_id: str, role_name: str) -> RoleAssignmentModel | None:
        return self.session.scalar(
            select(RoleAssignmentModel).where(
                RoleAssignmentModel.user_id == user_id,
                RoleAssignmentModel.role_name == role_name,
            )
        )

    def delete(self, model: RoleAssignmentModel) -> None:
        self.session.delete(model)
        self.session.flush()


class SQLAlchemyAccessSessionRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, model: AccessSessionModel) -> AccessSessionModel:
        self.session.add(model)
        self.session.flush()
        return model

    def get_by_id(self, access_session_id: str) -> AccessSessionModel | None:
        return self.session.scalar(
            select(AccessSessionModel).where(AccessSessionModel.access_session_id == access_session_id)
        )

    def update(self, model: AccessSessionModel) -> AccessSessionModel:
        self.session.add(model)
        self.session.flush()
        return model


class SQLAlchemyResourceGrantRepository:
    def __init__(self, session: Session):
        self.session = session

    def list_for_user(self, user_id: str) -> list[ResourceGrantModel]:
        return list(self.session.scalars(select(ResourceGrantModel).where(ResourceGrantModel.user_id == user_id)))


class SQLAlchemySecurityAuditEventRepository:
    def __init__(self, session: Session):
        self.session = session

    def append(self, model: SecurityAuditEventModel) -> SecurityAuditEventModel:
        self.session.add(model)
        self.session.flush()
        return model
