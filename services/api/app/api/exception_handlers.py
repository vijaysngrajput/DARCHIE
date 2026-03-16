from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.errors import AppError, ErrorResponse


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        payload = ErrorResponse(
            error_code=exc.error_code,
            message=exc.message,
            request_id=request.headers.get("x-request-id", "unknown"),
        )
        return JSONResponse(status_code=exc.status_code, content=payload.model_dump())
