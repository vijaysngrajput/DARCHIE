from __future__ import annotations

import os
from collections.abc import Generator
from datetime import timedelta

os.environ.setdefault("ENABLE_RUNTIME_BOOTSTRAP", "false")
os.environ.setdefault("SEED_DEV_DATA", "false")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.api import dependencies as api_dependencies
from app.core.database import Base, utc_now
from app.main import app
from app.modules.assessment_orchestration.dependencies import (
    get_assessment_session_repository,
    get_candidate_assignment_repository,
    get_content_client,
    get_gating_state_repository,
    get_response_checkpoint_client,
    get_scoring_status_client,
    get_session_component_state_repository,
    get_session_task_state_repository,
    get_workflow_transition_log_repository,
)
from app.modules.assessment_orchestration.repositories import (
    SQLAlchemyAssessmentSessionRepository,
    SQLAlchemyCandidateAssignmentRepository,
    SQLAlchemyGatingStateRepository,
    SQLAlchemySessionComponentStateRepository,
    SQLAlchemySessionTaskStateRepository,
    SQLAlchemyWorkflowTransitionLogRepository,
)
from app.modules.assessment_orchestration.models import CandidateAssignmentModel
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
from app.modules.response_capture.dependencies import (
    get_orchestration_eligibility_client,
    get_response_artifact_repository,
    get_response_capture_service,
    get_response_checkpoint_repository,
    get_response_draft_repository,
    get_response_submission_repository,
)
from app.modules.response_capture.repositories import (
    SQLAlchemyResponseArtifactRepository,
    SQLAlchemyResponseCheckpointRepository,
    SQLAlchemyResponseDraftRepository,
    SQLAlchemyResponseSubmissionRepository,
)


class StubContentClient:
    def get_published_assessment_version(self, assessment_version_id: str) -> dict:
        return {
            "assessment_version_id": assessment_version_id,
            "timing_policy": {"session_duration_minutes": 60},
            "attempt_policy": {"max_attempts": 1},
            "components": [
                {
                    "component_id": f"component-{assessment_version_id}-1",
                    "sequence_no": 1,
                    "tasks": [
                        {
                            "task_id": f"task-{assessment_version_id}-1",
                            "sequence_no": 1,
                            "evaluation_mode": "rule_based",
                        }
                    ],
                }
            ],
        }


class StubResponseCheckpointClient:
    def get_task_checkpoint(self, session_id: str, task_id: str) -> dict | None:
        return None


class StubScoringStatusClient:
    def get_task_readiness(self, session_id: str, task_id: str) -> dict:
        return {"ready": True}

    def publish_progression_hold(self, session_id: str, task_id: str, evaluation_mode: str) -> None:
        return None


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
        "assessment_sessions": SQLAlchemyAssessmentSessionRepository(db_session),
        "candidate_assignments": SQLAlchemyCandidateAssignmentRepository(db_session),
        "component_states": SQLAlchemySessionComponentStateRepository(db_session),
        "task_states": SQLAlchemySessionTaskStateRepository(db_session),
        "gating_states": SQLAlchemyGatingStateRepository(db_session),
        "transition_logs": SQLAlchemyWorkflowTransitionLogRepository(db_session),
        "response_drafts": SQLAlchemyResponseDraftRepository(db_session),
        "response_submissions": SQLAlchemyResponseSubmissionRepository(db_session),
        "response_artifacts": SQLAlchemyResponseArtifactRepository(db_session),
        "response_checkpoints": SQLAlchemyResponseCheckpointRepository(db_session),
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
def seeded_assignments(repositories, seeded_users):
    assignment = repositories["candidate_assignments"].create(
        CandidateAssignmentModel(
            assignment_id="assignment-ui-1",
            candidate_user_id=seeded_users["candidate"].user_id,
            assessment_version_id="assessment-ui-v1",
            assignment_state="invited",
            invite_expires_at=utc_now() + timedelta(days=7),
        )
    )
    return {"default": assignment}


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
    app.dependency_overrides[get_assessment_session_repository] = lambda: repositories["assessment_sessions"]
    app.dependency_overrides[get_candidate_assignment_repository] = lambda: repositories["candidate_assignments"]
    app.dependency_overrides[get_session_component_state_repository] = lambda: repositories["component_states"]
    app.dependency_overrides[get_session_task_state_repository] = lambda: repositories["task_states"]
    app.dependency_overrides[get_gating_state_repository] = lambda: repositories["gating_states"]
    app.dependency_overrides[get_workflow_transition_log_repository] = lambda: repositories["transition_logs"]
    app.dependency_overrides[get_content_client] = lambda: StubContentClient()
    app.dependency_overrides[get_response_checkpoint_client] = lambda: StubResponseCheckpointClient()
    app.dependency_overrides[get_scoring_status_client] = lambda: StubScoringStatusClient()
    app.dependency_overrides[get_response_draft_repository] = lambda: repositories["response_drafts"]
    app.dependency_overrides[get_response_submission_repository] = lambda: repositories["response_submissions"]
    app.dependency_overrides[get_response_artifact_repository] = lambda: repositories["response_artifacts"]
    app.dependency_overrides[get_response_checkpoint_repository] = lambda: repositories["response_checkpoints"]
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
