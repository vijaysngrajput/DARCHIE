# D-ARCHIE Backend Component Design Spec (CDS)

## 1. Purpose
This document converts the backend LLD into code-generation-ready design for the Python FastAPI application shell.

Parent documents:
- [`Backend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-HLD.md)
- [`Backend-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-LLD.md)

## 2. Canonical Service Layout
```text
services/api/
  app/
    main.py
    api/
      router.py
      dependencies.py
      exception_handlers.py
    core/
      config.py
      logging.py
      security.py
      database.py
      events.py
      errors.py
    modules/
      identity_access/
      assessment_orchestration/
      assessment_content_management/
      response_capture/
      scoring_evaluation/
      reporting_analytics/
      support_services/
    tests/
      unit/
      integration/
```

## 3. Application Shell Responsibilities
### 3.1 `main.py`
- Create FastAPI app instance.
- Register middleware, exception handlers, and root router.

### 3.2 `api/router.py`
- Compose sub-routers from each domain module.
- Prefix route groups by candidate, recruiting, admin, reviewer, auth, and access concerns.

### 3.3 `api/dependencies.py`
- Expose request-scoped dependencies:
  - database session
  - current user/access context
  - event publisher
  - correlation/request id

### 3.4 `api/exception_handlers.py`
- Map domain exceptions from modules into stable API error responses.

### 3.5 `core/config.py`
- Define settings object for app config, database URL, event transport mode, and auth settings.

### 3.6 `core/database.py`
- Define SQLAlchemy engine, session factory, base model metadata, and transaction helper.

### 3.7 `core/events.py`
- Define `DomainEventPublisher`, outbox write helper, and event envelope model.

### 3.8 `core/errors.py`
- Define shared error response DTO and shared error categories.

## 4. Router Composition Contracts
```python
def include_module_routers(api_router: APIRouter) -> None: ...
```

Registered routers:
- identity/auth router
- orchestration router
- response capture router
- reporting router
- content management router
- scoring/review router
- support/admin router

## 5. Request Context Contracts
```python
class RequestContext(BaseModel):
    request_id: str
    actor_id: str | None
    roles: list[str]
    audit_source: str
```

```python
def get_request_context(...) -> RequestContext: ...
def get_db_session() -> Iterator[Session]: ...
def get_event_publisher() -> DomainEventPublisher: ...
```

## 6. Shared Error Contracts
```python
class ErrorResponse(BaseModel):
    error_code: str
    message: str
    request_id: str
```

Shared error codes:
- `AUTHENTICATION_FAILED`
- `AUTHORIZATION_DENIED`
- `VALIDATION_FAILED`
- `RESOURCE_NOT_FOUND`
- `INVALID_STATE`
- `DEPENDENCY_UNAVAILABLE`

## 7. Transaction and Event Boundaries
- Commands must run inside one request transaction.
- Post-commit async work must be staged through outbox records.
- Domain services must not publish transport-specific messages directly.
- Event publication contract:

```python
class DomainEventPublisher(Protocol):
    def stage(self, event_name: str, payload: dict, aggregate_id: str, aggregate_type: str) -> None: ...
```

## 8. Backend Module Integration Contracts
- Each module must expose:
  - `router`
  - `dependencies`
  - domain services
  - repositories
  - schemas
  - errors
- Shared modules must not import each other's routers.
- Cross-domain coordination must happen through service interfaces or event publisher contracts.

## 9. Tests to Generate
- Unit:
  - `test_exception_handlers.py`
  - `test_request_context.py`
  - `test_event_publisher.py`
- Integration:
  - `test_app_router_registration.py`
  - `test_candidate_request_context.py`
  - `test_submission_outbox_flow.py`

## 10. Code Engine Acceptance
A code engine implementing this CDS must generate a runnable FastAPI application shell, register domain routers, provide shared dependencies, stable exception mapping, transaction-aware database helpers, and outbox-based event staging that other domain modules can consume without changing the shell layout.
