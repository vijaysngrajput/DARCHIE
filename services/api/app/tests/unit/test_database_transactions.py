import pytest
from sqlalchemy import text

from app.core.database import transactional_session


def test_transactional_session_rolls_back_on_exception() -> None:
    with pytest.raises(RuntimeError):
        with transactional_session() as session:
            session.execute(text("SELECT 1"))
            raise RuntimeError("boom")
