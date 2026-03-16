# D-ARCHIE Assessment Content Management Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for authored content, reusable assets, and published versions.

Parent document:
- [`Assessment-Content-Management-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/assessment-content-management/Assessment-Content-Management-HLD.md)

## 2. Owned Entities
- `AssessmentDefinition`
- `AssessmentVersion`
- `AssessmentComponentDefinition`
- `TaskDefinition`
- `RubricDefinition`
- `ReusableContentAsset`
- `FollowUpRule`
- `DependencyRule`
- `PublishReviewRecord`

## 3. Lifecycle States
### 3.1 Assessment Version
- `draft`
- `in_review`
- `published`
- `superseded`
- `archived`

Rules:
- Only `published` versions are runtime-readable by orchestration.
- Published versions are immutable.
- New edits produce or continue a draft lineage, not mutation of published version.

## 4. API Groups
- authoring CRUD for assessments/components/tasks
- reusable asset CRUD
- rubric CRUD
- publish/review actions
- runtime read APIs for published versions

Representative endpoints:
- `POST /content/assessments`
- `POST /content/assessments/{id}/versions`
- `POST /content/versions/{id}/submit-review`
- `POST /content/versions/{id}/publish`
- `GET /content/runtime/versions/{id}`

## 5. Validation Rules
- Every task must belong to one component.
- Follow-up references must target valid tasks/components.
- Dependency rules must not create disallowed cycles.
- Publish requires no validation errors.
- Rubric references must point to valid published or version-bound rubric definitions.

## 6. Runtime Delivery Contract
Published runtime payload must include:
- assessment version metadata
- ordered components
- tasks
- branch/follow-up metadata
- dependency/prerequisite metadata
- rubric-linked evaluation metadata

## 7. Storage Ownership
- Relational store:
  - authored definitions
  - versions
  - reusable assets metadata
  - review/publish records
- Optional object store:
  - content-linked binary assets if needed later
- Cache:
  - published runtime payloads

## 8. Sequence Flows
### 8.1 Draft Authoring
1. Load or create draft version.
2. Mutate assessment/component/task/rubric structures.
3. Run validation.
4. Persist draft.

### 8.2 Publish
1. Submit draft for review.
2. Validate content integrity.
3. Promote to published.
4. Emit publish event.
5. Mark prior published version as superseded if replaced.

## 9. Failure and Retry
- Publish must be transactional around version state transition and publish marker.
- Validation failure must leave version in prior non-published state.
- Duplicate publish requests must not create multiple published markers for same version.

## 10. Implementation Readiness Checklist
- lifecycle frozen
- validation rule categories frozen
- runtime payload contract frozen
