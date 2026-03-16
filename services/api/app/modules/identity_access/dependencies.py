from collections.abc import Iterator

from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.api.dependencies import RequestContext, get_db_session, get_event_publisher, get_request_context
from app.modules.identity_access.auth_service import AuthenticationService
from app.modules.identity_access.authorization_service import AuthorizationService
from app.modules.identity_access.errors import AuthorizationDeniedError
from app.modules.identity_access.repositories import (
    SQLAlchemyAccessSessionRepository,
    SQLAlchemyResourceGrantRepository,
    SQLAlchemyRoleAssignmentRepository,
    SQLAlchemySecurityAuditEventRepository,
    SQLAlchemyUserAccountRepository,
)
from app.modules.identity_access.schemas.access import AccessContextResponse
from app.modules.identity_access.session_service import AccessSessionService
from app.modules.identity_access.user_admin_service import UserAdministrationService


def get_user_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyUserAccountRepository:
    return SQLAlchemyUserAccountRepository(session)


def get_role_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyRoleAssignmentRepository:
    return SQLAlchemyRoleAssignmentRepository(session)


def get_access_session_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyAccessSessionRepository:
    return SQLAlchemyAccessSessionRepository(session)


def get_resource_grant_repository(session: Session = Depends(get_db_session)) -> SQLAlchemyResourceGrantRepository:
    return SQLAlchemyResourceGrantRepository(session)


def get_audit_repository(session: Session = Depends(get_db_session)) -> SQLAlchemySecurityAuditEventRepository:
    return SQLAlchemySecurityAuditEventRepository(session)


def get_access_session_service(
    access_session_repository: SQLAlchemyAccessSessionRepository = Depends(get_access_session_repository),
) -> AccessSessionService:
    return AccessSessionService(access_session_repository)


def get_authentication_service(
    user_repository: SQLAlchemyUserAccountRepository = Depends(get_user_repository),
    role_repository: SQLAlchemyRoleAssignmentRepository = Depends(get_role_repository),
    access_session_service: AccessSessionService = Depends(get_access_session_service),
    audit_repository: SQLAlchemySecurityAuditEventRepository = Depends(get_audit_repository),
    event_publisher=Depends(get_event_publisher),
) -> AuthenticationService:
    return AuthenticationService(user_repository, role_repository, access_session_service, audit_repository, event_publisher)


def get_authorization_service(
    user_repository: SQLAlchemyUserAccountRepository = Depends(get_user_repository),
    role_repository: SQLAlchemyRoleAssignmentRepository = Depends(get_role_repository),
    resource_grant_repository: SQLAlchemyResourceGrantRepository = Depends(get_resource_grant_repository),
    audit_repository: SQLAlchemySecurityAuditEventRepository = Depends(get_audit_repository),
    event_publisher=Depends(get_event_publisher),
) -> AuthorizationService:
    return AuthorizationService(user_repository, role_repository, resource_grant_repository, audit_repository, event_publisher)


def get_user_admin_service(
    user_repository: SQLAlchemyUserAccountRepository = Depends(get_user_repository),
    role_repository: SQLAlchemyRoleAssignmentRepository = Depends(get_role_repository),
    audit_repository: SQLAlchemySecurityAuditEventRepository = Depends(get_audit_repository),
    event_publisher=Depends(get_event_publisher),
) -> UserAdministrationService:
    return UserAdministrationService(user_repository, role_repository, audit_repository, event_publisher)


def get_access_context(
    request_context: RequestContext = Depends(get_request_context),
    access_session_id: str | None = Header(default=None, alias="x-access-session-id"),
    authorization_service: AuthorizationService = Depends(get_authorization_service),
) -> AccessContextResponse:
    if request_context.actor_id is None:
        raise AuthorizationDeniedError("Missing actor context")
    return authorization_service.build_access_context(request_context.actor_id, access_session_id)


def require_role(*allowed_roles: str):
    def checker(access_context: AccessContextResponse = Depends(get_access_context)) -> AccessContextResponse:
        if not any(role in access_context.roles for role in allowed_roles):
            raise AuthorizationDeniedError("Missing required role")
        return access_context

    return checker
