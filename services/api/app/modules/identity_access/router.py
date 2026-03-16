from fastapi import APIRouter, Depends, Header, Response, status

from app.api.dependencies import RequestContext, get_request_context
from app.modules.identity_access.auth_service import AuthenticationService
from app.modules.identity_access.authorization_service import AuthorizationService
from app.modules.identity_access.dependencies import (
    get_access_context,
    get_authentication_service,
    get_authorization_service,
    get_user_admin_service,
    require_role,
)
from app.modules.identity_access.errors import AuthenticationFailedError
from app.modules.identity_access.schemas.access import AccessCheckRequest, AccessContextResponse, AccessDecisionResponse
from app.modules.identity_access.schemas.admin import AssignRoleRequest, CreateUserRequest, UserAdminResponse
from app.modules.identity_access.schemas.auth import AuthSessionResponse, CurrentUserResponse, LoginRequest, RefreshSessionRequest
from app.modules.identity_access.user_admin_service import UserAdministrationService

router = APIRouter(tags=["identity-access"])


@router.get("/auth/_health")
def auth_health() -> dict[str, str]:
    return {"module": "identity_access", "status": "ok"}


@router.post("/auth/login", response_model=AuthSessionResponse)
def login(command: LoginRequest, auth_service: AuthenticationService = Depends(get_authentication_service)) -> AuthSessionResponse:
    return auth_service.login(command)


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    request_context: RequestContext = Depends(get_request_context),
    access_session_id: str | None = Header(default=None, alias="x-access-session-id"),
    auth_service: AuthenticationService = Depends(get_authentication_service),
) -> Response:
    if not access_session_id:
        raise AuthenticationFailedError("Missing access session id")
    auth_service.logout(access_session_id, request_context.actor_id or "unknown")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/auth/me", response_model=CurrentUserResponse)
def get_me(
    request_context: RequestContext = Depends(get_request_context),
    auth_service: AuthenticationService = Depends(get_authentication_service),
) -> CurrentUserResponse:
    return auth_service.get_current_user(request_context.actor_id or "")


@router.post("/auth/session/refresh", response_model=AuthSessionResponse)
def refresh_session(
    command: RefreshSessionRequest,
    auth_service: AuthenticationService = Depends(get_authentication_service),
) -> AuthSessionResponse:
    return auth_service.refresh(command)


@router.post("/access/check", response_model=AccessDecisionResponse)
def check_access(
    command: AccessCheckRequest,
    request_context: RequestContext = Depends(get_request_context),
    authorization_service: AuthorizationService = Depends(get_authorization_service),
) -> AccessDecisionResponse:
    return authorization_service.check_access(command, request_context.actor_id or "")


@router.get("/access/context", response_model=AccessContextResponse)
def access_context(context: AccessContextResponse = Depends(get_access_context)) -> AccessContextResponse:
    return context


@router.post("/users", response_model=UserAdminResponse)
def create_user(
    command: CreateUserRequest,
    access_context: AccessContextResponse = Depends(require_role("admin")),
    user_admin_service: UserAdministrationService = Depends(get_user_admin_service),
) -> UserAdminResponse:
    return user_admin_service.create_user(command, access_context.actor_id)


@router.post("/users/{user_id}/roles", response_model=UserAdminResponse)
def assign_role(
    user_id: str,
    command: AssignRoleRequest,
    access_context: AccessContextResponse = Depends(require_role("admin")),
    user_admin_service: UserAdministrationService = Depends(get_user_admin_service),
) -> UserAdminResponse:
    return user_admin_service.assign_role(user_id, command, access_context.actor_id)


@router.delete("/users/{user_id}/roles/{role_name}", response_model=UserAdminResponse)
def remove_role(
    user_id: str,
    role_name: str,
    access_context: AccessContextResponse = Depends(require_role("admin")),
    user_admin_service: UserAdministrationService = Depends(get_user_admin_service),
) -> UserAdminResponse:
    return user_admin_service.remove_role(user_id, role_name, access_context.actor_id)
