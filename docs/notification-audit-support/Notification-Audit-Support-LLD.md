# D-ARCHIE Notification, Audit, and Support Low-Level Design (LLD)

## 1. Purpose
This document defines the implementation-ready design for cross-cutting notifications, audit trails, and support-oriented operational signals.

Derived from:
- [`Platform-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/platform/Platform-HLD.md)
- [`Backend-HLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-HLD.md)

## 2. Owned Entities
- `NotificationRequest`
- `NotificationDeliveryRecord`
- `AuditRecord`
- `OperationalSupportEvent`

## 3. Event Inputs
- session created/completed/expired
- content published
- evaluation completed
- review completed
- report refreshed
- access denied / privileged action

## 4. Notification Categories
- candidate informational
- recruiter/admin informational
- reviewer action-needed
- operational alerts

## 5. Audit Categories
- authentication and access events
- content publish/review actions
- session terminal-state changes
- review overrides
- support-admin interventions

## 6. API / Service Contracts
- `POST /support/notify`
- `POST /support/audit`
- `GET /support/audit/{entityType}/{entityId}`

Most writes are event-driven rather than direct client-initiated APIs.

## 7. Delivery Rules
- Notifications are async only.
- Audit writes must be durable for privileged and state-changing actions.
- Support events are append-only.

## 8. Storage Ownership
- Relational store:
  - audit records
  - notification requests/delivery records
  - support events
- Queue:
  - notification delivery jobs

## 9. Failure and Retry
- Notification delivery retries are safe by notification id.
- Audit writes for privileged actions must fail closed or surface operational alarms.
- Support event duplication must be tolerated via idempotency key.

## 10. Invariants
- Audit is append-only.
- Notification request is separate from delivery success.
- Support events never alter source-of-truth business entities directly.

## 11. Implementation Readiness Checklist
- audit event classes frozen
- notification categories frozen
- append-only audit rule frozen
