# D-ARCHIE Notification, Audit, and Support Code Engine Task Pack

Source spec:
- [`Notification-Audit-Support-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/notification-audit-support/Notification-Audit-Support-CDS.md)

## 1. Notification Tasks
1. Create notification routes and DTOs from CDS section 5.
2. Create `NotificationRequestService`.
3. Create `NotificationDeliveryWorker`.
4. Separate notification request creation from delivery execution.

## 2. Audit and Support Tasks
1. Create `AuditWriterService`.
2. Create `OperationalSupportEventService`.
3. Implement append-only audit persistence and support-event recording.

## 3. Persistence and Event Tasks
1. Create ORM models and repositories from CDS sections 3.5 and 3.6.
2. Freeze canonical support event envelope from CDS section 6.
3. Create support and notification events.

## 4. Error and Test Tasks
1. Create `errors.py` with HTTP mapping from CDS section 9.
2. Add unit and integration tests from CDS section 10.

## 5. Completion Criteria
- Audit is append-only.
- Notification request and delivery records are separate.
- Retry behavior is idempotent.
- Support-route and audit durability tests pass.
