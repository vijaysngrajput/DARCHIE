# D-ARCHIE Identity and Access Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for authentication, authorization, and role/resource access.

Parent document:
- [`Identity-and-Access-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/identity-and-access/Identity-and-Access-HLD.md)

## 2. Owned Entities
- `UserAccount`
- `RoleAssignment`
- `AccessSession`
- `PermissionRule`
- `ResourceGrant`
- `SecurityAuditEvent`

Referenced:
- `Assessment`
- `AssessmentVersion`
- `Session`
- `Response`
- `Review`
- `ResultSummary`

## 3. Role Model
- `candidate`
- `recruiter`
- `hiring_manager`
- `admin`
- `reviewer`
- `support_admin`

## 4. Permission Matrix
### 4.1 Candidate
- view own assigned assessments
- start/resume own sessions
- submit own responses
- view own in-flow status only

### 4.2 Recruiter
- assign assessments
- view candidate reports for allowed scope
- view candidate progress status where permitted

### 4.3 Hiring Manager
- view reports and component insights for permitted candidates
- no content authoring
- no session mutation

### 4.4 Admin
- manage content drafts/review/publish flows
- inspect platform configuration and privileged views

### 4.5 Reviewer
- access assigned review queues/items
- submit review outcomes
- view rubric-linked review context

### 4.6 Support Admin
- inspect sessions
- cancel or intervene in exceptional operational cases

## 5. API Groups
### 5.1 Auth
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/session/refresh`

### 5.2 Authorization / Access
- `POST /access/check`
- `GET /access/context`

### 5.3 Admin Identity
- `POST /users`
- `POST /users/{userId}/roles`
- `DELETE /users/{userId}/roles/{role}`

## 6. Access Evaluation Model
Inputs:
- authenticated user
- role set
- resource type
- resource id
- action

Decision steps:
1. Validate active access session.
2. Resolve roles.
3. Evaluate static permission rule for action.
4. Evaluate resource grant or ownership rule where needed.
5. Return allow/deny plus scoped context.

## 7. Resource Rules
- Candidate-owned resources use `userId` equality.
- Report access uses recruiter/hiring-manager scope grant.
- Review access uses assigned reviewer or privileged admin grant.
- Content publish/review access uses admin/reviewer permission rule plus content operation scope.

## 8. Session Model
States:
- `active`
- `expired`
- `terminated`

Rules:
- one active session per device/browser context is acceptable for MVP
- refresh extends validity within allowed policy window
- terminated or expired sessions must fail closed

## 9. Storage Ownership
- Relational store:
  - users
  - roles
  - role assignments
  - resource grants
  - access sessions
  - security audit events
- Cache:
  - access context
  - permission lookup summaries

## 10. Validations and Invariants
- Every user must have at least one valid role.
- Candidate actions require ownership of target session/response.
- Report access requires explicit role and scope.
- Review actions require reviewer or higher-privilege grant.
- Deny is default when rule resolution is incomplete.

## 11. Failure and Retry Rules
- Duplicate login attempts create at most one active session record per request id.
- Failed access checks still emit audit markers for protected resources.
- Stale role cache must fall back to persistent lookup.

## 12. Security and Audit Hooks
- log login success/failure
- log access denied
- log privileged role changes
- log support-admin session interventions

## 13. Implementation Readiness Checklist
- role matrix frozen
- resource rule categories frozen
- session lifecycle frozen
- deny-by-default rule explicit
