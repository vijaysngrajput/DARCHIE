# D-ARCHIE Assessment Orchestration Implementation Plan

## 1. Objective
Implement session lifecycle, current-unit resolution, progression, and gating for runtime assessment flow.

Primary source docs:
- [`Assessment-Orchestration-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-CDS.md)
- [`Assessment-Orchestration-Task-Pack.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-Task-Pack.md)
- [`Implementation-Roadmap.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Implementation-Roadmap.md)

Milestone placement:
- Milestone 2

## 2. Prerequisites and Dependents
Prerequisites:
- backend shell
- identity and access context

Downstream consumers:
- response capture eligibility checks
- frontend candidate session and task screens
- later scoring/content integrations

## 3. Local Execution Order
### Phase 1: Router and Schemas
- implement orchestration `router.py`
- implement `schemas/commands.py`
- implement `schemas/queries.py`
- implement `schemas/responses.py`

### Phase 2: Session Service
- implement `service.py` with `AssessmentSessionService`
- support create/start/resume/cancel/get summary/current-unit/progress

### Phase 3: State and Policy
- implement `state_machine.py`
- implement `policy_service.py`

### Phase 4: Progression and Gating
- implement `progression_service.py`
- implement `gating_service.py`

### Phase 5: Persistence and Integrations
- implement `models.py`
- implement `repositories.py`
- implement content/response/scoring clients
- wire dependencies

### Phase 6: Tests
- add unit tests for state, policy, progression, and gating
- add integration tests for create-session, current-unit, and invalid transitions

## 4. First Files and Classes
Implement first:
- `router.py`
- `schemas/commands.py`
- `schemas/queries.py`
- `schemas/responses.py`
- `service.py`

Core classes/interfaces:
- `AssessmentSessionService`
- `ProgressionService`
- `GatingService`
- `SessionStateMachine`
- `TimingAttemptPolicyService`

## 5. Local Completion Criteria
- session and progression APIs are auth-aware
- current-unit and progress are retrievable
- invalid transitions are blocked
- gating logic is isolated from scoring implementation
- orchestration tests pass for session creation, current-unit, and progression

## 6. Handoff
This component hands off:
- session APIs to frontend
- session eligibility and checkpoint consumers to response capture
- readiness integration boundary to scoring
- runtime content-consumer boundary to content management
