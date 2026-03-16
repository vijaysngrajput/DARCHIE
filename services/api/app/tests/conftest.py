from __future__ import annotations

from collections.abc import Generator
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.api import dependencies as api_dependencies
from app.core.database import Base, utc_now
from app.main import app
from app.modules.identity_access.auth_service import AuthenticationService
from app.modules.identity_access.dependencies import (
    get_access_session_repository,
    get_access_session_service,
    get_audit_repository,
    get_authentication_service,
    get_authorization_service,
    get_resource_grant_repository,
    get_role_repository,
    get_user_admin_service,
    get_user_repository,
)
from app.modules.identity_access.models import AccessSessionModel, ResourceGrantModel, RoleAssignmentModel, UserAccountModel
from app.modules.identity_access.repositories import (
    SQLAlchemyAccessSessionRepository,
    SQLAlchemyResourceGrantRepository,
    SQLAlchemyRoleAssignmentRepository,
    SQLAlchemySecurityAuditEventRepository,
    SQLAlchemyUserAccountRepository,
)
from app.modules.identity_access.session_service import AccessSessionService
from app.modules.identity_access.user_admin_service import UserAdministrationService
from app.modules.identity_access.authorization_service import AuthorizationService


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    Base.metadata.create_all(engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture()
def event_publisher(db_session: Session):
    from app.core.events import InMemoryDomainEventPublisher

    return InMemoryDomainEventPublisher(db_session)


@pytest.fixture()
def repositories(db_session: Session):
    return {
        "users": SQLAlchemyUserAccountRepository(db_session),
        "roles": SQLAlchemyRoleAssignmentRepository(db_session),
        "sessions": SQLAlchemyAccessSessionRepository(db_session),
        "grants": SQLAlchemyResourceGrantRepository(db_session),
        "audit": SQLAlchemySecurityAuditEventRepository(db_session),
    }


@pytest.fixture()
def authentication_service(repositories, event_publisher):
    return AuthenticationService(
        repositories["users"],
        repositories["roles"],
        AccessSessionService(repositories["sessions"]),
        repositories["audit"],
        event_publisher,
    )


@pytest.fixture()
def authorization_service(repositories, event_publisher):
    return AuthorizationService(
        repositories["users"],
        repositories["roles"],
        repositories["grants"],
        repositories["audit"],
        event_publisher,
    )


@pytest.fixture()
def user_admin_service(repositories, event_publisher):
    return UserAdministrationService(repositories["users"], repositories["roles"], repositories["audit"], event_publisher)


@pytest.fixture()
def seeded_users(repositories):
    hasher = AuthenticationService._hash_password
    candidate = repositories["users"].create(
        UserAccountModel(email="candidate@example.com", password_hash=hasher("secret123"), display_name="Candidate")
    )
    admin = repositories["users"].create(
        UserAccountModel(email="admin@example.com", password_hash=hasher("admin123"), display_name="Admin")
    )
    recruiter = repositories["users"].create(
        UserAccountModel(email="recruiter@example.com", password_hash=hasher("recruiter123"), display_name="Recruiter")
    )
    reviewer = repositories["users"].create(
        UserAccountModel(email="reviewer@example.com", password_hash=hasher("review123"), display_name="Reviewer")
    )
    repositories["roles"].create(RoleAssignmentModel(user_id=candidate.user_id, role_name="candidate"))
    repositories["roles"].create(RoleAssignmentModel(user_id=admin.user_id, role_name="admin"))
    repositories["roles"].create(RoleAssignmentModel(user_id=recruiter.user_id, role_name="recruiter"))
    repositories["roles"].create(RoleAssignmentModel(user_id=reviewer.user_id, role_name="reviewer"))
    repositories["grants"].session.add(ResourceGrantModel(user_id=recruiter.user_id, resource_type="report", resource_id="candidate-1", action="view"))
    repositories["grants"].session.flush()
    return {"candidate": candidate, "admin": admin, "recruiter": recruiter, "reviewer": reviewer}


@pytest.fixture()
def access_session_factory(repositories):
    def factory(user_id: str, state: str = "active") -> AccessSessionModel:
        session = repositories["sessions"].create(
            AccessSessionModel(
                user_id=user_id,
                state=state,
                expires_at=utc_now() + timedelta(minutes=60),
            )
        )
        return session

    return factory


@pytest.fixture()
def client(db_session: Session, repositories, event_publisher) -> Generator[TestClient, None, None]:
    def override_get_db_session():
        yield db_session

    app.dependency_overrides[api_dependencies.get_db_session] = override_get_db_session
    app.dependency_overrides[get_user_repository] = lambda: repositories["users"]
    app.dependency_overrides[get_role_repository] = lambda: repositories["roles"]
    app.dependency_overrides[get_access_session_repository] = lambda: repositories["sessions"]
    app.dependency_overrides[get_resource_grant_repository] = lambda: repositories["grants"]
    app.dependency_overrides[get_audit_repository] = lambda: repositories["audit"]
    app.dependency_overrides[api_dependencies.get_event_publisher] = lambda: event_publisher
    app.dependency_overrides[get_access_session_service] = lambda: AccessSessionService(repositories["sessions"])
    app.dependency_overrides[get_authentication_service] = lambda: AuthenticationService(
        repositories["users"],
        repositories["roles"],
        AccessSessionService(repositories["sessions"]),
        repositories["audit"],
        event_publisher,
    )
    app.dependency_overrides[get_authorization_service] = lambda: AuthorizationService(
        repositories["users"],
        repositories["roles"],
        repositories["grants"],
        repositories["audit"],
        event_publisher,
    )
    app.dependency_overrides[get_user_admin_service] = lambda: UserAdministrationService(
        repositories["users"], repositories["roles"], repositories["audit"], event_publisher
    )
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
