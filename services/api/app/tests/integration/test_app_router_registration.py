from fastapi.testclient import TestClient

from app.main import app


EXPECTED_PATHS = {
    "/healthz",
    "/auth/_health",
    "/sessions/_health",
    "/responses/_health",
    "/reports/_health",
    "/content/_health",
    "/evaluations/_health",
    "/support/_health",
}


def test_module_routes_are_registered() -> None:
    client = TestClient(app)
    paths = {route.path for route in app.routes}

    assert EXPECTED_PATHS.issubset(paths)
    assert client.get("/healthz").status_code == 200
