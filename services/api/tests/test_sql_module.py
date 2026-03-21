from fastapi.testclient import TestClient

from app.main import app
from app.sql_fixtures import SQL_EXERCISE_ID


client = TestClient(app)


def test_get_exercise_detail_returns_schema_and_starter_sql() -> None:
    response = client.get(f"/api/exercises/{SQL_EXERCISE_ID}")

    assert response.status_code == 200
    body = response.json()
    assert body["exerciseDetail"]["exercise"]["id"] == SQL_EXERCISE_ID
    assert body["exerciseDetail"]["starterSql"]
    assert body["exerciseDetail"]["schema"][0]["name"] == "user_events"


def test_draft_save_roundtrip_returns_timestamped_state() -> None:
    response = client.put(
        f"/api/attempts/{SQL_EXERCISE_ID}/draft",
        json={"sql": "select * from user_events"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["draftAttempt"]["sql"] == "select * from user_events"
    assert "Draft saved at" in body["saveState"]


def test_run_endpoint_executes_allowed_sql() -> None:
    response = client.post(
        f"/api/attempts/{SQL_EXERCISE_ID}/run",
        json={"sql": "select user_id, signup_week from user_events order by user_id limit 3"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["columns"] == ["user_id", "signup_week"]
    assert body["rowCount"] == 3


def test_run_endpoint_rejects_destructive_sql() -> None:
    response = client.post(
        f"/api/attempts/{SQL_EXERCISE_ID}/run",
        json={"sql": "drop table user_events"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "validationError"
    assert body["error"]["code"] == "VALIDATION_ERROR"


def test_submit_endpoint_scores_matching_query() -> None:
    response = client.post(
        f"/api/attempts/{SQL_EXERCISE_ID}/submit",
        json={
            "sql": """
            WITH user_signup AS (
              SELECT user_id, MIN(signup_week) AS cohort_week
              FROM user_events
              GROUP BY user_id
            ),
            weekly_activity AS (
              SELECT DISTINCT user_id, active_week
              FROM user_events
            )
            SELECT
              user_signup.cohort_week,
              weekly_activity.active_week,
              COUNT(*) AS retained_users
            FROM user_signup
            JOIN weekly_activity
              ON weekly_activity.user_id = user_signup.user_id
            WHERE weekly_activity.active_week BETWEEN user_signup.cohort_week AND user_signup.cohort_week + 7
            GROUP BY user_signup.cohort_week, weekly_activity.active_week
            ORDER BY user_signup.cohort_week, weekly_activity.active_week
            """
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "success"
    assert body["rubric"]["overall"] >= 90
