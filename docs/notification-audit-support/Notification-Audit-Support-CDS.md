# D-ARCHIE Notification, Audit, and Support Component Design Spec (CDS)

## 1. Purpose
This document converts the notification/audit/support LLD into code-generation-ready design for the Python FastAPI backend.

Parent documents:
- [`Notification-Audit-Support-LLD.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/notification-audit-support/Notification-Audit-Support-LLD.md)
- [`Backend-CDS.md`](/Users/varshasingh/Desktop/code_practise/PORTFOLIO/DARCHIE/docs/backend/Backend-CDS.md)

## 2. Target Package Layout
```text
services/api/app/
  modules/
    support_services/
      router.py
      dependencies.py
      notification_service.py
      audit_service.py
      support_event_service.py
      delivery_worker.py
      repositories.py
      models.py
      schemas/
        notifications.py
        audit.py
      events.py
      errors.py
```

## 3. Module Responsibilities
### 3.1 `notification_service.py`
- Define `NotificationRequestService`.
- Own notification request creation and durable handoff to async delivery.

### 3.2 `audit_service.py`
- Define `AuditWriterService`.
- Own append-only audit record creation for privileged and state-changing actions.

### 3.3 `support_event_service.py`
- Define `OperationalSupportEventService`.
- Own append-only support event recording for operational flows.

### 3.4 `delivery_worker.py`
- Define `NotificationDeliveryWorker`.
- Own async delivery attempts and update of delivery records.

### 3.5 `repositories.py`
- Define repositories for:
  - `NotificationRequestRepository`
  - `NotificationDeliveryRecordRepository`
  - `AuditRecordRepository`
  - `OperationalSupportEventRepository`

### 3.6 `models.py`
- Define ORM models:
  - `NotificationRequestModel`
  - `NotificationDeliveryRecordModel`
  - `AuditRecordModel`
  - `OperationalSupportEventModel`

### 3.7 `schemas/notifications.py`
- `CreateNotificationRequest`
- `NotificationRequestResponse`

### 3.8 `schemas/audit.py`
- `WriteAuditRecordRequest`
- `AuditRecordResponse`
- `SupportEventResponse`

### 3.9 `events.py`
- `NotificationRequestedEvent`
- `NotificationDeliveryAttemptedEvent`
- `AuditRecordedEvent`
- `OperationalSupportEventRecordedEvent`

### 3.10 `errors.py`
- `NotificationDeliveryError`
- `AuditWriteFailureError`
- `SupportEventWriteFailureError`

## 4. Class and Method Contracts
```python
class NotificationRequestService:
    def create_notification(self, command: CreateNotificationRequest, actor_id: str | None) -> NotificationRequestResponse: ...

class AuditWriterService:
    def write_audit_record(self, command: WriteAuditRecordRequest, actor_id: str | None) -> AuditRecordResponse: ...

class OperationalSupportEventService:
    def record_event(self, event_name: str, payload: dict, actor_id: str | None) -> SupportEventResponse: ...

class NotificationDeliveryWorker:
    def deliver(self, notification_id: str) -> None: ...
```

## 5. API-to-Code Mapping
| Endpoint | Router Function | Service Method |
| --- | --- | --- |
| `POST /support/notify` | `create_notification` | `NotificationRequestService.create_notification` |
| `POST /support/audit` | `write_audit_record` | `AuditWriterService.write_audit_record` |
| `GET /support/audit/{entity_type}/{entity_id}` | `get_audit_history` | audit query adapter on repository |

## 6. Canonical Event Envelope Contract
```python
class SupportEventEnvelope(BaseModel):
    event_name: str
    entity_type: str
    entity_id: str
    payload: dict
    occurred_at: datetime
    actor_id: str | None
    idempotency_key: str | None
```

This is the canonical event shape consumed by support, audit, and notification handlers.

## 7. Repository Contracts
```python
class AuditRecordRepository(Protocol):
    def append(self, model: AuditRecordModel) -> AuditRecordModel: ...
    def list_for_entity(self, entity_type: str, entity_id: str) -> list[AuditRecordModel]: ...
```

All audit repositories must preserve append-only semantics.

## 8. Dependency Injection
- `dependencies.py` must expose:
  - `get_notification_request_service`
  - `get_audit_writer_service`
  - `get_operational_support_event_service`

## 9. Error Mapping
| Domain Error | HTTP Status |
| --- | --- |
| `NotificationDeliveryError` | 500 |
| `AuditWriteFailureError` | 500 |
| `SupportEventWriteFailureError` | 500 |

## 10. Tests to Generate
- Unit:
  - `test_audit_writer_service.py`
  - `test_notification_request_service.py`
  - `test_delivery_worker.py`
- Integration:
  - `test_support_routes.py`
  - `test_append_only_audit.py`
  - `test_notification_retry_idempotency.py`
- Fixtures:
  - support event envelope fixture
  - notification request fixture
  - privileged actor fixture

## 11. Code Engine Acceptance
A code engine implementing this CDS must generate append-only audit handling, async notification request and delivery separation, support event recording, and tests for audit durability, notification retry idempotency, and support-route behavior.
