# D-ARCHIE Identity and Access Component Design Spec (CDS)

## 1. Purpose
This document converts the identity and access LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Identity-and-Access-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-HLD.md)
- [`Identity-and-Access-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-LLD.md)
- [`Backend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-LLD.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    identity_access/
      router.py
      dependencies.py
      auth_service.py
      authorization_service.py
      session_service.py
      user_admin_service.py
      permissions.py
      repositories.py
      models.py
      schemas/
        auth.py
        access.py
        admin.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `router.py`
- Expose auth, access, and admin identity endpoints.
- Attach access context dependency and translate domain errors into stable HTTP responses.

### 3.2 `auth_service.py`
- Define `AuthenticationService`.
- Own login, logout, refresh, and `me` lookup behavior.

### 3.3 `authorization_service.py`
- Define `AuthorizationService`.
- Own access checks, resource-scope evaluation, deny-by-default behavior, and access context generation.

### 3.4 `session_service.py`
- Define `AccessSessionService`.
- Own access-session lifecycle, issuance, refresh, expiry, and termination.

### 3.5 `user_admin_service.py`
- Define `UserAdministrationService`.
- Own user creation and role assignment mutations.

### 3.6 `permissions.py`
- Define `PermissionMatrix`, `ResourceScopeEvaluator`, and helper constants for role/action/resource mapping.

### 3.7 `repositories.py`
- Define repositories for:
  - `UserAccountRepository`
  - `RoleAssignmentRepository`
  - `AccessSessionRepository`
  - `ResourceGrantRepository`
  - `SecurityAuditEventRepository`

### 3.8 `models.py`
- Define ORM models:
  - `UserAccountModel`
  - `RoleAssignmentModel`
  - `AccessSessionModel`
  - `ResourceGrantModel`
  - `SecurityAuditEventModel`

### 3.9 `schemas/auth.py`
- `LoginRequest`
- `RefreshSessionRequest`
- `AuthSessionResponse`
- `CurrentUserResponse`

### 3.10 `schemas/access.py`
- `AccessCheckRequest`
- `AccessDecisionResponse`
- `AccessContextResponse`

### 3.11 `schemas/admin.py`
- `CreateUserRequest`
- `AssignRoleRequest`
- `UserAdminResponse`

### 3.12 `events.py`
- `LoginSucceededEvent`
- `LoginFailedEvent`
- `AccessDeniedEvent`
- `RoleAssignmentChangedEvent`

### 3.13 `errors.py`
- `AuthenticationFailedError`
- `AccessSessionExpiredError`
- `AuthorizationDeniedError`
- `InvalidRoleAssignmentError`
- `UserNotFoundError`

## 4. Class and Method Contracts
```python
class AuthenticationService:
    def login(self, command: LoginRequest) -> AuthSessionResponse: ...
    def logout(self, access_session_id: str, actor_id: str) -> None: ...
    def refresh(self, command: RefreshSessionRequest) -> AuthSessionResponse: ...
    def get_current_user(self, actor_id: str) -> CurrentUserResponse: ...

class AuthorizationService:
    def check_access(self, command: AccessCheckRequest, actor_id: str) -> AccessDecisionResponse: ...
    def build_access_context(self, actor_id: str) -> AccessContextResponse: ...
    def assert_access(self, actor_id: str, resource_type: str, resource_id: str | None, action: str) -> None: ...

class UserAdministrationService:
    def create_user(self, command: CreateUserRequest, actor_id: str) -> UserAdminResponse: ...
    def assign_role(self, user_id: str, command: AssignRoleRequest, actor_id: str) -> UserAdminResponse: ...
    def remove_role(self, user_id: str, role_name: str, actor_id: str) -> UserAdminResponse: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `POST /auth/login` | `login` | `AuthenticationService.login` |
| `POST /auth/logout` | `logout` | `AuthenticationService.logout` |
| `GET /auth/me` | `get_me` | `AuthenticationService.get_current_user` |
| `POST /auth/session/refresh` | `refresh_session` | `AuthenticationService.refresh` |
| `POST /access/check` | `check_access` | `AuthorizationService.check_access` |
| `GET /access/context` | `get_access_context` | `AuthorizationService.build_access_context` |
| `POST /users` | `create_user` | `UserAdministrationService.create_user` |
| `POST /users/{user_id}/roles` | `assign_role` | `UserAdministrationService.assign_role` |
| `DELETE /users/{user_id}/roles/{role_name}` | `remove_role` | `UserAdministrationService.remove_role` |

## 6. DTO Shapes
```python
class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr

class AccessCheckRequest(BaseModel):
    resource_type: str
    resource_id: str | None = None
    action: str

class AuthSessionResponse(BaseModel):
    access_session_id: str
    user_id: str
    roles: list[str]
    expires_at: datetime
```

## 7. Repository Contracts
```python
class UserAccountRepository(Protocol):
    def get_by_email(self, email: str) -> UserAccountModel | None: ...
    def get_by_id(self, user_id: str) -> UserAccountModel | None: ...
    def create(self, model: UserAccountModel) -> UserAccountModel: ...
```

All auth-related repositories must support audit-write hooks during the same transaction when login, logout, deny, or role mutation occurs.

## 8. Permission Code Structure
- `permissions.py` must define:
  - `ROLE_ACTIONS: dict[str, dict[str, set[str]]]`
  - `resource_requires_scope(resource_type: str) -> bool`
  - `can_access_owned_resource(actor_id: str, resource_owner_id: str) -> bool`
  - `can_access_scoped_resource(role_names: list[str], grant_records: list[ResourceGrantModel], action: str) -> bool`

## 9. Dependency Injection
- `dependencies.py` must expose:
  - `get_authentication_service`
  - `get_authorization_service`
  - `get_user_admin_service`
  - `get_access_context`
  - `require_role`

## 10. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `AuthenticationFailedError` | 401 |
| `AccessSessionExpiredError` | 401 |
| `AuthorizationDeniedError` | 403 |
| `UserNotFoundError` | 404 |
| `InvalidRoleAssignmentError` | 422 |

## 11. Tests to Generate
- Unit:
  - `test_permission_matrix.py`
  - `test_authorization_service.py`
  - `test_authentication_service.py`
- Integration:
  - `test_login_and_me.py`
  - `test_access_check.py`
  - `test_role_assignment_admin_routes.py`
- Fixtures:
  - user account factory
  - access session factory
  - role grant fixtures
  - candidate/recruiter/admin access contexts

## 12. Code Engine Acceptance
A code engine implementing this CDS must produce auth, access, and user-admin modules with explicit permission evaluation code, constructor-injected services, stable auth/access DTOs, and tests for deny-by-default, owned-resource checks, scoped-report access, and role mutation audit behavior.
