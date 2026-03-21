from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import (
    ExerciseDetailResponse,
    RunRequest,
    RunResponse,
    SaveDraftRequest,
    SaveDraftResponse,
    SubmitRequest,
    SubmitResponse,
)
from app.sql_fixtures import SQL_EXERCISE_DETAIL, SQL_EXERCISE_ID
from app.sql_sandbox import run_sql, submit_sql
from app.sql_store import get_draft, save_draft


router = APIRouter(prefix="/api", tags=["sql-practice"])


def _assert_supported_exercise(exercise_id: str) -> None:
    if exercise_id != SQL_EXERCISE_ID:
        raise HTTPException(status_code=404, detail="Exercise not found")


@router.get("/exercises/{exercise_id}", response_model=ExerciseDetailResponse)
def get_exercise(exercise_id: str) -> ExerciseDetailResponse:
    _assert_supported_exercise(exercise_id)
    return ExerciseDetailResponse(
        exerciseDetail=SQL_EXERCISE_DETAIL,
        draftAttempt=get_draft(exercise_id),
        entitlement={"canAttempt": True, "plan": "preview"},
    )


@router.put("/attempts/{exercise_id}/draft", response_model=SaveDraftResponse)
def put_draft(exercise_id: str, payload: SaveDraftRequest) -> SaveDraftResponse:
    _assert_supported_exercise(exercise_id)
    draft = save_draft(exercise_id, payload.sql)
    return SaveDraftResponse(
        draftAttempt=draft,
        saveState=f"Draft saved at {draft.updated_at[11:19]} UTC",
    )


@router.post("/attempts/{exercise_id}/run", response_model=RunResponse)
def post_run(exercise_id: str, payload: RunRequest) -> RunResponse:
    _assert_supported_exercise(exercise_id)
    return run_sql(payload.sql)


@router.post("/attempts/{exercise_id}/submit", response_model=SubmitResponse)
def post_submit(exercise_id: str, payload: SubmitRequest) -> SubmitResponse:
    _assert_supported_exercise(exercise_id)
    return submit_sql(payload.sql)
