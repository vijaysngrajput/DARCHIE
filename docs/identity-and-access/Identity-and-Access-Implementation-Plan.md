# D-ARCHIE Identity and Access Implementation Plan

## 1. Objective
Implement authentication, access sessions, and centralized authorization for all protected platform flows.

Primary source docs:
- [`Identity-and-Access-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-CDS.md)
- [`Identity-and-Access-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-Task-Pack.md)
- [`Unified-Execution-Backlog.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Unified-Execution-Backlog.md)

Milestone placement:
- Milestone 1

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell

Downstream consumers:
- frontend auth gate
- orchestration protected APIs
- response capture protected APIs
- reporting scope enforcement
- admin/reviewer/protected internal areas

## 3. Local Execution Order
### Phase 1: Auth Endpoints and DTOs
- implement `router.py`
- implement `schemas/auth.py`
- expose login/logout/me/refresh routes

### Phase 2: Auth and Session Services
- implement `auth_service.py`
- implement `session_service.py`
- support login, logout, refresh, and current-user resolution

### Phase 3: Access and Permission Layer
- implement `authorization_service.py`
- implement `permissions.py`
- implement `schemas/access.py`

### Phase 4: Persistence and Admin Identity
- implement ORM models and repositories
- implement `user_admin_service.py`
- implement `schemas/admin.py`

### Phase 5: Tests
- add unit tests for permission matrix and auth service
- add integration tests for login, access check, and role mutation

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/auth.py`
- `auth_service.py`
- `session_service.py`
- `authorization_service.py`

Core classes/interfaces:
- `AuthenticationService`
- `AccessSessionService`
- `AuthorizationService`
- `UserAdministrationService`

## 5. Local Completion Criteria
- login/logout/me/refresh APIs work
- deny-by-default is centralized
- access context can be injected into other domains
- role/resource checks are test-covered
- role mutation audit markers are emitted

## 6. Handoff
This component hands off:
- authenticated actor context to frontend and backend modules
- authorization checks to orchestration, response capture, reporting, and admin flows
- role- and scope-based access enforcement to later domains
