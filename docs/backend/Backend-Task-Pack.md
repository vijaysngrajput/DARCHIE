# D-ARCHIE Backend Code Engine Task Pack

Source spec:
- [`Backend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-CDS.md)

## 1. App Shell Tasks
1. Create `main.py`.
2. Create root API router composition in `api/router.py`.
3. Create shared dependencies in `api/dependencies.py`.
4. Create shared exception handlers in `api/exception_handlers.py`.

## 2. Core Infrastructure Tasks
1. Create `core/config.py`.
2. Create `core/database.py`.
3. Create `core/events.py`.
4. Create `core/errors.py`.
5. Create logging/security helpers needed by request context and auth wiring.

## 3. Integration Tasks
1. Register all module routers in the app shell.
2. Expose request context and database session to domain modules.
3. Implement outbox staging through `DomainEventPublisher`.

## 4. Test Tasks
1. Add unit tests from CDS section 9.
2. Add integration tests for router registration, request context, and submission outbox staging.

## 5. Completion Criteria
- FastAPI app boots with router composition.
- Shared request context is injectable.
- Errors map to stable `ErrorResponse`.
- Domain events are staged through outbox helpers rather than direct transport calls.
