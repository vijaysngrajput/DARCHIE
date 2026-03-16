# D-ARCHIE Response Capture and Persistence Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for draft/final response storage and artifact linkage.

Derived from:
- [`Backend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-HLD.md)
- [`Assessment-Orchestration-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-orchestration/Assessment-Orchestration-HLD.md)

## 2. Owned Entities
- `ResponseDraft`
- `ResponseSubmission`
- `ResponseArtifact`
- `ResponseCheckpoint`

Referenced:
- `Session`
- `Task`
- `User`

## 3. API Groups
- `POST /responses/draft`
- `GET /responses/draft/{sessionId}/{taskId}`
- `POST /responses/finalize`
- `POST /responses/artifacts`
- `GET /responses/summary/{sessionId}/{taskId}`

## 4. Data Model Rules
- One current draft per `sessionId + taskId`.
- Final submission is immutable after accepted state, unless explicit operational override exists later.
- Artifacts are linked by response submission id or draft id.
- Checkpoints summarize last-known response milestone for orchestration.

## 5. States
### 5.1 Draft
- `active`
- `replaced`

### 5.2 Submission
- `submitted`
- `accepted`
- `rejected`

## 6. Sequence Flows
### 6.1 Draft Save
1. Validate candidate owns session/task.
2. Upsert current draft record.
3. Update checkpoint metadata.
4. Emit optional draft-updated event if needed.

### 6.2 Final Submission
1. Validate session/task eligibility with orchestration.
2. Persist immutable submission record.
3. Freeze or supersede draft state.
4. Update checkpoint to submitted.
5. Emit `response_submitted`.

### 6.3 Artifact Link
1. Persist artifact metadata.
2. Store object reference path.
3. Attach to draft or final submission.

## 7. Storage Ownership
- Relational store:
  - draft records
  - submission records
  - checkpoint rows
  - artifact metadata
- Object store:
  - uploaded files / large artifacts

## 8. Invariants
- Candidate may mutate only owned drafts before final submission.
- Final submission cannot be overwritten by normal candidate flow.
- Artifact metadata must reference valid draft/submission owner.

## 9. Failure and Retry
- Draft save is idempotent upsert.
- Final submission is idempotent by submission key.
- Artifact metadata write without object-store confirmation must remain incomplete and not appear finalized.

## 10. Implementation Readiness Checklist
- draft/submission boundary frozen
- immutability rule frozen
- checkpoint contract to orchestration frozen
