from __future__ import annotations

from app.models import ExerciseMeta, PromptSection, SchemaColumn, SchemaTable, SqlExerciseDetail


SQL_EXERCISE_ID = "session-retention-breakdown"

USER_EVENTS_ROWS: list[dict[str, int]] = [
    {"user_id": 1, "signup_week": 1, "active_week": 1},
    {"user_id": 1, "signup_week": 1, "active_week": 2},
    {"user_id": 1, "signup_week": 1, "active_week": 3},
    {"user_id": 2, "signup_week": 1, "active_week": 1},
    {"user_id": 2, "signup_week": 1, "active_week": 1},
    {"user_id": 2, "signup_week": 1, "active_week": 3},
    {"user_id": 3, "signup_week": 2, "active_week": 2},
    {"user_id": 3, "signup_week": 2, "active_week": 3},
    {"user_id": 4, "signup_week": 2, "active_week": 2},
    {"user_id": 5, "signup_week": 3, "active_week": 3},
    {"user_id": 5, "signup_week": 3, "active_week": 4},
    {"user_id": 5, "signup_week": 3, "active_week": 5},
]

STARTER_SQL = """WITH user_signup AS (
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
ORDER BY user_signup.cohort_week, weekly_activity.active_week;
"""

CANONICAL_SQL = STARTER_SQL

SQL_EXERCISE_DETAIL = SqlExerciseDetail(
    exercise=ExerciseMeta(
        id=SQL_EXERCISE_ID,
        module="sql",
        title="Session retention breakdown",
        difficulty="Foundations",
        estimatedTime="25 min",
        tags=["Window functions", "Retention", "Joins"],
        summary="Write a query that traces returning-user retention by signup cohort and active week.",
    ),
    promptSections=[
        PromptSection(
            label="Prompt",
            body="Write a query that returns weekly retention by signup cohort for active users in the first eight weeks after signup.",
        ),
        PromptSection(
            label="Constraints",
            body="Assume duplicate events exist, users can reactivate, and the final answer must stay legible enough for an interviewer to follow.",
            collapsible=True,
        ),
        PromptSection(
            label="Expected skills",
            body="Cohort logic, deduplication, grouping, and communicating why your intermediate steps exist.",
            collapsible=True,
        ),
    ],
    starterHint="Start by isolating the first signup week per user, then deduplicate active weeks before counting retained users.",
    starterSql=STARTER_SQL,
    schema=[
        SchemaTable(
            name="user_events",
            description="Weekly user activity history. Duplicate activity rows can appear and should not inflate retained-user counts.",
            columns=[
                SchemaColumn(name="user_id", type="INTEGER", description="Stable user identifier."),
                SchemaColumn(name="signup_week", type="INTEGER", description="First observed signup cohort week."),
                SchemaColumn(name="active_week", type="INTEGER", description="Week in which the user was active."),
            ],
            sampleRows=USER_EVENTS_ROWS[:5],
        )
    ],
    workSurfaceTitle="SQL editor",
    workSurfaceDescription="Use a schema-aware SQL workspace with draft saving, run preview, and structured submission feedback.",
    saveState="Draft not saved yet",
    resultSummary="Run the query to inspect shaped output before submitting.",
)
