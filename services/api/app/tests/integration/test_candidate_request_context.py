from fastapi.testclient import TestClient

from app.main import app


def test_request_context_endpoint_returns_header_data() -> None:
    client = TestClient(app)

    response = client.get(
        "/internal/request-context",
        headers={
            "x-request-id": "req-abc",
            "x-actor-id": "candidate-99",
            "x-roles": "candidate",
        },
    )

    assert response.status_code == 200
    assert response.json()["request_id"] == "req-abc"
    assert response.json()["actor_id"] == "candidate-99"
    assert response.json()["roles"] == ["candidate"]
