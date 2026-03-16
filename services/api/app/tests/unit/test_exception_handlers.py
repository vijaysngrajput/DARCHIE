from fastapi import APIRouter
from fastapi.testclient import TestClient

from app.core.errors import AppError
from app.main import create_app


def test_app_error_handler_returns_stable_payload() -> None:
    app = create_app()
    router = APIRouter()

    @router.get("/boom")
    def boom() -> None:
        raise AppError("INVALID_STATE", "broken", 409)

    app.include_router(router)
    client = TestClient(app)

    response = client.get("/boom", headers={"x-request-id": "req-42"})

    assert response.status_code == 409
    assert response.json() == {
        "error_code": "INVALID_STATE",
        "message": "broken",
        "request_id": "req-42",
    }
