# D-ARCHIE Assessment Orchestration Low-Level Design (LLD)

## 1. Purpose
This document converts the orchestration HLD into an implementation-ready design.

Parent documents:
- [`Assessment-Orchestration-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-HLD.md)
- [`Platform-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Platform-HLD.md)

## 2. Owned Entities
- `AssessmentSession`
- `SessionComponentState`
- `SessionTaskState`
- `ProgressionCheckpoint`
- `GatingState`
- `TimingPolicySnapshot`
- `AttemptPolicySnapshot`
- `WorkflowTransitionLog`

Referenced but not owned:
- `AssessmentVersion`
- `Component`
- `Task`
- `Response`
- `Score`
- `Review`
- `User`

## 3. State Model
### 3.1 Session States
- `created`
- `active`
- `awaiting_review`
- `awaiting_score`
- `paused`
- `completed`
- `expired`
- `cancelled`

### 3.2 Task States
- `locked`
- `available`
- `in_progress`
- `submitted`
- `awaiting_gate`
- `done`
- `skipped`

### 3.3 Transition Rules
- `created -> active` when session is first entered successfully.
- `active -> awaiting_review` when a submitted task requires manual review.
- `active -> awaiting_score` when a submitted task requires asynchronous evaluation completion.
- `awaiting_review|awaiting_score -> active` when gating is satisfied and next task exists.
- `active -> completed` when all required tasks/components are done and no gating remains.
- `active|awaiting_* -> expired` when timing window is exceeded.
- `created|active|awaiting_* -> cancelled` by privileged operational action only.
- `active -> paused` only for supported operational or resume scenarios; candidate-side pause semantics remain minimal in MVP.

## 4. API Groups
### 4.1 Session Commands
- `POST /sessions`
  - create session from assignment and published assessment version
- `POST /sessions/{sessionId}/start`
  - activate session
- `POST /sessions/{sessionId}/resume`
  - resume active session
- `POST /sessions/{sessionId}/cancel`
  - cancel session with privileged access

### 4.2 Session Queries
- `GET /sessions/{sessionId}`
  - fetch current session summary and state
- `GET /sessions/{sessionId}/current-unit`
  - fetch current active component/task
- `GET /sessions/{sessionId}/progress`
  - fetch progress and gating status

### 4.3 Progression Commands
- `POST /sessions/{sessionId}/tasks/{taskId}/mark-submitted`
- `POST /sessions/{sessionId}/progress/evaluate-next`
- `POST /sessions/{sessionId}/gating/refresh`

## 5. Integration Contracts
### 5.1 Content Management
Inputs:
- published assessment version
- ordered component/task structure
- branch/follow-up rules
- prerequisites and dependency metadata

### 5.2 Response Capture
Inputs:
- submission existence
- draft/final milestone state
- response ownership validation

### 5.3 Scoring
Inputs:
- evaluation readiness state
- review readiness state
- task/component score status

### 5.4 Support/Audit
Outputs:
- session lifecycle events
- progression updates
- expiry/cancellation events

## 6. Core Sequence Flows
### 6.1 Create Session
1. Validate assignment and actor access.
2. Load published assessment version.
3. Snapshot timing and attempt policies into session records.
4. Create `AssessmentSession`.
5. Create initial `SessionComponentState` and `SessionTaskState` rows.
6. Write transition log `created`.

### 6.2 Resolve Current Task
1. Load session and current progression pointer.
2. Validate session state and timing window.
3. If current task is gated, return gated status.
4. If current task is done, run next-step resolver.
5. Return current task reference and task state payload.

### 6.3 Submission Progression
1. Verify submitted task matches active task.
2. Verify attempt/timing rules.
3. Mark task `submitted`.
4. Check task evaluation mode metadata.
5. If immediate pass-through allowed, advance directly.
6. Otherwise create/update `GatingState`.
7. Emit progression update.

### 6.4 Gating Release
1. Receive `evaluation_completed` or `review_completed`.
2. Match event to active session task.
3. Update gating state.
4. If fully satisfied, mark task `done` and compute next available unit.
5. Transition session back to `active` or `completed`.

## 7. Storage Ownership
- Relational store:
  - sessions
  - session component states
  - session task states
  - gating states
  - timing/attempt snapshots
  - transition logs
- Cache:
  - current session pointer
  - current task lookup
- Event bus:
  - progression events
  - expiry events
  - completion events

## 8. Validations and Invariants
- Session must bind to one immutable published `AssessmentVersion`.
- Only one active task per session at a time in MVP.
- A task cannot move to `done` without valid submission or explicit skip rule.
- A gated task cannot release without scoring/review readiness.
- Session completion requires all required tasks resolved and no open gating states.
- Expired or cancelled sessions reject progression commands.

## 9. Failure and Retry Rules
- Duplicate submission events must be idempotent by `sessionId + taskId + submission marker`.
- Late score/review events for already-finalized tasks must be ignored or logged for manual handling.
- Expiry processing retries must not create duplicate terminal transitions.
- If content metadata retrieval fails during progression, session remains unchanged and request fails safely.

## 10. Access Implications
- Candidate may access only owned session operations.
- Recruiter/hiring manager cannot mutate session progression.
- Admin/support roles may cancel or inspect sessions based on permission matrix.

## 11. Observability
- Trace IDs on create/start/submit/evaluate-next/gating-refresh.
- Metrics:
  - session creation rate
  - gating backlog
  - expiry count
  - progression latency
- Audit:
  - terminal transitions
  - admin/manual interventions

## 12. Implementation Readiness Checklist
- session and task state enums frozen
- API groups frozen
- integration inputs/outputs frozen
- idempotency keys defined
- terminal-state behavior defined
