from fastapi import FastAPI

from app.api.exception_handlers import register_exception_handlers
from app.api.router import api_router
from app.core.config import get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)
    register_exception_handlers(app)
    app.include_router(api_router)
    return app


app = create_app()
