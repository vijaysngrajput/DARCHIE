from fastapi import APIRouter

router = APIRouter(tags=["identity-access"])


@router.get("/auth/_health")
def auth_health() -> dict[str, str]:
    return {"module": "identity_access", "status": "ok"}
