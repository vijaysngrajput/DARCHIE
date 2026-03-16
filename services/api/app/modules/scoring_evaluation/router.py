from fastapi import APIRouter

router = APIRouter(tags=["scoring-evaluation"])


@router.get("/evaluations/_health")
def scoring_health() -> dict[str, str]:
    return {"module": "scoring_evaluation", "status": "ok"}
