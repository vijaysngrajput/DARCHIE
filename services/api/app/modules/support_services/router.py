from fastapi import APIRouter

router = APIRouter(tags=["support-services"])


@router.get("/support/_health")
def support_health() -> dict[str, str]:
    return {"module": "support_services", "status": "ok"}
