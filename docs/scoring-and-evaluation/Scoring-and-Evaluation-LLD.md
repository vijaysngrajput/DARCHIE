# D-ARCHIE Scoring and Evaluation Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for evaluation execution, review handling, and score aggregation.

Parent document:
- [`Scoring-and-Evaluation-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/scoring-and-evaluation/Scoring-and-Evaluation-HLD.md)

## 2. Owned Entities
- `EvaluationRecord`
- `TaskScore`
- `ComponentScore`
- `AssessmentScore`
- `ReviewRecord`
- `ReadinessState`

Referenced:
- `Response`
- `Rubric`
- `Task`
- `AssessmentVersion`

## 3. Evaluation States
- `pending`
- `in_evaluation`
- `awaiting_review`
- `evaluated`
- `finalized`

## 4. Review States
- `not_required`
- `requested`
- `in_review`
- `completed`
- `overridden`

## 5. Path Resolution Rules
- Objective tasks with deterministic rules -> rule-based evaluator.
- Rubric-linked subjective tasks -> rubric coordinator.
- Tasks flagged for human scoring -> manual review path.
- Hybrid path may produce preliminary output before final review completion.

## 6. API Groups
- `POST /evaluations/start`
- `GET /evaluations/{id}`
- `GET /scores/task/{taskId}`
- `GET /scores/session/{sessionId}`
- `POST /reviews/{evaluationId}`

## 7. Aggregation Rules
- Task score is the atomic evaluation output.
- Component score aggregates required task scores only.
- Assessment score aggregates required component scores only.
- Review override triggers recomputation of affected component and assessment scores.

## 8. Integration Contracts
- Content:
  - rubric definitions
  - evaluation-linked metadata
- Orchestration:
  - readiness queries
  - evaluation/review completion events
- Reporting:
  - finalized score outputs

## 9. Sequence Flows
### 9.1 Rule-Based
1. Receive `response_submitted`.
2. Resolve path.
3. Evaluate deterministically.
4. Persist task score and readiness.
5. Emit `evaluation_completed` and possibly `score_finalized`.

### 9.2 Manual Review
1. Receive `response_submitted`.
2. Resolve review-required path.
3. Create evaluation and review records.
4. Set readiness awaiting review.
5. On review completion, update task score and aggregates.

## 10. Invariants
- Finalized score must derive from one active latest evaluation state.
- Aggregate outputs cannot exist without underlying task score lineage.
- Readiness cannot be final if review is still open.

## 11. Failure and Retry
- Duplicate `response_submitted` events are idempotent by evaluation key.
- Review completion replay must not duplicate finalization.
- Aggregation recomputation must be retry-safe.

## 12. Storage Ownership
- Relational store:
  - evaluations
  - reviews
  - task/component/assessment scores
  - readiness state
- Cache:
  - latest finalized score summaries
- Event bus:
  - evaluation/review completion

## 13. Implementation Readiness Checklist
- evaluation and review states frozen
- path resolution categories frozen
- aggregation levels frozen
