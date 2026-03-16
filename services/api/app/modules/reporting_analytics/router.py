from fastapi import APIRouter

router = APIRouter(tags=["reporting-analytics"])


@router.get("/reports/_health")
def reporting_health() -> dict[str, str]:
    return {"module": "reporting_analytics", "status": "ok"}
