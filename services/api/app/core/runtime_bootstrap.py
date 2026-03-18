from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import Base, engine, transactional_session
from app.modules.assessment_orchestration import models as orchestration_models  # noqa: F401
from app.modules.identity_access.auth_service import AuthenticationService
from app.modules.identity_access.models import ResourceGrantModel, RoleAssignmentModel, UserAccountModel


@dataclass(frozen=True, slots=True)
class SeedUser:
    user_id: str
    email: str
    password: str
    display_name: str
    role_name: str


SEED_USERS = (
    SeedUser("candidate-1", "candidate@example.com", "secret123", "Candidate", "candidate"),
    SeedUser("admin-1", "admin@example.com", "admin123", "Admin", "admin"),
    SeedUser("recruiter-1", "recruiter@example.com", "recruiter123", "Recruiter", "recruiter"),
    SeedUser("reviewer-1", "reviewer@example.com", "review123", "Reviewer", "reviewer"),
)


def bootstrap_runtime(settings: Settings | None = None) -> None:
    settings = settings or get_settings()
    if not settings.runtime_bootstrap_enabled:
        return
    Base.metadata.create_all(bind=engine)
    if settings.dev_data_seeding_enabled:
        with transactional_session() as session:
            seed_local_runtime_data(session)


def seed_local_runtime_data(session: Session) -> None:
    for seed_user in SEED_USERS:
        user = session.scalar(select(UserAccountModel).where(UserAccountModel.user_id == seed_user.user_id))
        if user is None:
            user = session.scalar(select(UserAccountModel).where(UserAccountModel.email == seed_user.email))
        if user is None:
            user = UserAccountModel(
                user_id=seed_user.user_id,
                email=seed_user.email,
                password_hash=AuthenticationService._hash_password(seed_user.password),
                display_name=seed_user.display_name,
            )
            session.add(user)
            session.flush()
        role = session.scalar(
            select(RoleAssignmentModel).where(
                RoleAssignmentModel.user_id == user.user_id,
                RoleAssignmentModel.role_name == seed_user.role_name,
            )
        )
        if role is None:
            session.add(RoleAssignmentModel(user_id=user.user_id, role_name=seed_user.role_name))
            session.flush()

    recruiter_grant = session.scalar(
        select(ResourceGrantModel).where(
            ResourceGrantModel.user_id == "recruiter-1",
            ResourceGrantModel.resource_type == "report",
            ResourceGrantModel.resource_id == "candidate-1",
            ResourceGrantModel.action == "view",
        )
    )
    if recruiter_grant is None:
        session.add(
            ResourceGrantModel(
                user_id="recruiter-1",
                resource_type="report",
                resource_id="candidate-1",
                action="view",
            )
        )
        session.flush()
