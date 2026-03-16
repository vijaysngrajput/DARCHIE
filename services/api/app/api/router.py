from fastapi import APIRouter, Depends

from app.api.dependencies import RequestContext, get_event_publisher, get_request_context
from app.core.config import Settings, get_settings
from app.modules.assessment_content_management.router import router as content_router
from app.modules.assessment_orchestration.router import router as orchestration_router
from app.modules.identity_access.router import router as identity_router
from app.modules.reporting_analytics.router import router as reporting_router
from app.modules.response_capture.router import router as response_router
from app.modules.scoring_evaluation.router import router as scoring_router
from app.modules.support_services.router import router as support_router


def create_api_router(settings: Settings | None = None) -> APIRouter:
    settings = settings or get_settings()
    api_router = APIRouter()

    @api_router.get("/healthz", tags=["platform"])
    def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    if settings.enable_internal_routes:

        @api_router.get("/internal/request-context", tags=["platform"])
        def read_request_context(
            context: RequestContext = Depends(get_request_context),
        ) -> RequestContext:
            return context

        @api_router.post("/internal/events/stage", tags=["platform"])
        def stage_test_event(
            publisher=Depends(get_event_publisher),
            context: RequestContext = Depends(get_request_context),
        ) -> dict[str, object]:
            publisher.stage(
                event_name="shell.test_event",
                payload={"request_id": context.request_id},
                aggregate_id=context.request_id,
                aggregate_type="request",
            )
            return {"staged_count": len(publisher.events), "request_id": context.request_id}

    include_module_routers(api_router)
    return api_router



def include_module_routers(router: APIRouter) -> None:
    router.include_router(identity_router)
    router.include_router(orchestration_router)
    router.include_router(response_router)
    router.include_router(reporting_router)
    router.include_router(content_router)
    router.include_router(scoring_router)
    router.include_router(support_router)


api_router = create_api_router()
