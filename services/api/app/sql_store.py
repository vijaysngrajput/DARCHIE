from __future__ import annotations

from datetime import UTC, datetime

from app.models import DraftAttempt


_draft_store: dict[str, DraftAttempt] = {}


def get_draft(exercise_id: str) -> DraftAttempt | None:
    return _draft_store.get(exercise_id)


def save_draft(exercise_id: str, sql: str) -> DraftAttempt:
    draft = DraftAttempt(sql=sql, updatedAt=datetime.now(UTC).isoformat())
    _draft_store[exercise_id] = draft
    return draft
