# D-ARCHIE Backend Implementation Plan

## 1. Objective
Implement the FastAPI application shell that all runtime domains will plug into.

Primary source docs:
- [`Backend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-CDS.md)
- [`Backend-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 0
- prerequisite for all backend runtime domains

## 2. Prerequisites and Dependents
Prerequisites:
- none

Downstream consumers:
- identity and access
- orchestration
- response capture
- content management
- scoring
- reporting
- support services

## 3. Local Execution Order
### Phase 1: App Shell
- implement `services/api/app/main.py`
- implement `services/api/app/api/router.py`
- implement `services/api/app/api/exception_handlers.py`

### Phase 2: Shared Runtime Infrastructure
- implement `services/api/app/core/config.py`
- implement `services/api/app/core/database.py`
- implement `services/api/app/core/events.py`
- implement `services/api/app/api/dependencies.py`

### Phase 3: Integration Readiness
- register module router placeholders
- expose request context, DB session, and event publisher to modules
- freeze outbox event staging contract

### Phase 4: Validation
- add backend shell unit tests
- add integration tests for router registration and request context

## 4. First Files and Classes
Implement first:
- `main.py`
- `api/router.py`
- `api/exception_handlers.py`
- `core/config.py`
- `core/database.py`

Core classes/interfaces:
- `RequestContext`
- `ErrorResponse`
- `DomainEventPublisher`

## 5. Local Completion Criteria
- FastAPI app boots
- root router composes module routers cleanly
- request context is injectable
- DB session is injectable
- outbox event staging exists
- shared error mapping is stable
- backend shell tests pass

## 6. Handoff
This component hands off:
- request context and auth-ready dependency wiring to identity
- shared transaction and repository session model to all backend modules
- event publisher contract to state-changing modules
