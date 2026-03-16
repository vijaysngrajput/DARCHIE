from fastapi import APIRouter

router = APIRouter(tags=["assessment-content-management"])


@router.get("/content/_health")
def content_health() -> dict[str, str]:
    return {"module": "assessment_content_management", "status": "ok"}
