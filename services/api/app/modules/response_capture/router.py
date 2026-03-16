from fastapi import APIRouter

router = APIRouter(tags=["response-capture"])


@router.get("/responses/_health")
def response_health() -> dict[str, str]:
    return {"module": "response_capture", "status": "ok"}
