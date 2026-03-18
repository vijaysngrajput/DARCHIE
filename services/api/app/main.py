from contextlib import asynccontextmanager
from time import perf_counter
from uuid import uuid4

from fastapi import FastAPI, Request

from app.api.exception_handlers import register_exception_handlers
from app.api.router import create_api_router
from app.core.config import get_settings
from app.core.logging import get_logger, log_request_completion
from app.core.runtime_bootstrap import bootstrap_runtime


LOGGER = get_logger()


def create_app() -> FastAPI:
    settings = get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        bootstrap_runtime(settings)
        yield

    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    @app.middleware("http")
    async def request_lifecycle_middleware(request: Request, call_next):
        request_id = request.headers.get("x-request-id") or str(uuid4())
        request.state.request_id = request_id
        start_time = perf_counter()
        response = None
        try:
            response = await call_next(request)
            return response
        finally:
            duration_ms = (perf_counter() - start_time) * 1000
            if response is not None:
                response.headers["x-request-id"] = request_id
                response.headers["x-process-time-ms"] = f"{duration_ms:.2f}"
            log_request_completion(
                logger=LOGGER,
                method=request.method,
                path=request.url.path,
                status_code=response.status_code if response is not None else 500,
                request_id=request_id,
                duration_ms=duration_ms,
            )

    register_exception_handlers(app)
    app.include_router(create_api_router(settings))
    return app


app = create_app()
