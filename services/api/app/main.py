from time import perf_counter
from uuid import uuid4

from fastapi import FastAPI, Request

from app.api.exception_handlers import register_exception_handlers
from app.api.router import create_api_router
from app.core.config import get_settings
from app.core.logging import get_logger, log_request_completion


LOGGER = get_logger()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)

    @app.middleware("http")
    async def request_lifecycle_middleware(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid4())
        request.state.request_id = request_id
        start_time = perf_counter()
        try:
            response = await call_next(request)
        finally:
            duration_ms = (perf_counter() - start_time) * 1000
        response.headers["x-request-id"] = request_id
        response.headers["x-process-time-ms"] = f"{duration_ms:.2f}"
        log_request_completion(
            logger=LOGGER,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            request_id=request_id,
            duration_ms=duration_ms,
        )
        return response

    register_exception_handlers(app)
    app.include_router(create_api_router(settings))
    return app


app = create_app()
