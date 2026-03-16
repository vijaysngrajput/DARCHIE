from fastapi import Request

from app.api.dependencies import get_request_context


def test_request_context_parses_headers() -> None:
    scope = {
        "type": "http",
        "headers": [
            (b"x-request-id", b"req-123"),
            (b"x-actor-id", b"candidate-1"),
            (b"x-roles", b"candidate,recruiter"),
        ],
        "method": "GET",
        "path": "/",
    }
    request = Request(scope)

    context = get_request_context(request=request, x_request_id=None, x_actor_id=None, x_roles=None)

    assert context.request_id == "req-123"
    assert context.actor_id == "candidate-1"
    assert context.roles == ["candidate", "recruiter"]
