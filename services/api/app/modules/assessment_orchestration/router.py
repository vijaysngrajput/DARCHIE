from fastapi import APIRouter

router = APIRouter(tags=["assessment-orchestration"])


@router.get("/sessions/_health")
def orchestration_health() -> dict[str, str]:
    return {"module": "assessment_orchestration", "status": "ok"}
