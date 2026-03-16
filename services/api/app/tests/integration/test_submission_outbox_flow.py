from fastapi.testclient import TestClient

from app.main import app


def test_internal_event_stage_endpoint_uses_outbox_publisher() -> None:
    client = TestClient(app)

    response = client.post("/internal/events/stage", headers={"x-request-id": "req-stage"})

    assert response.status_code == 200
    assert response.json() == {"staged_count": 1, "request_id": "req-stage"}
