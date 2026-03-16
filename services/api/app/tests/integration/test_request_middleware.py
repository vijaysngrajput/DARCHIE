from fastapi.testclient import TestClient

from app.main import app, create_app
from app.core.config import get_settings


def test_request_middleware_propagates_request_id_header() -> None:
    client = TestClient(app)

    response = client.get("/healthz", headers={"x-request-id": "req-mw-1"})

    assert response.status_code == 200
    assert response.headers["x-request-id"] == "req-mw-1"
    assert float(response.headers["x-process-time-ms"]) >= 0


def test_request_middleware_generates_request_id_when_missing() -> None:
    client = TestClient(app)

    response = client.get("/healthz")

    assert response.status_code == 200
    assert response.headers["x-request-id"]
    assert float(response.headers["x-process-time-ms"]) >= 0


def test_internal_routes_can_be_disabled(monkeypatch) -> None:
    monkeypatch.setenv("ENABLE_INTERNAL_ROUTES", "false")
    get_settings.cache_clear()
    disabled_app = create_app()
    response = TestClient(disabled_app).get("/internal/request-context")

    assert response.status_code == 404
    get_settings.cache_clear()


def test_internal_routes_can_be_enabled(monkeypatch) -> None:
    monkeypatch.setenv("ENABLE_INTERNAL_ROUTES", "true")
    get_settings.cache_clear()
    enabled_app = create_app()
    response = TestClient(enabled_app).get("/internal/request-context")

    assert response.status_code == 200
    get_settings.cache_clear()
