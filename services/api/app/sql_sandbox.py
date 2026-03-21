from __future__ import annotations

import re
import sqlite3
import time
from dataclasses import dataclass

from app.models import RubricBreakdown, RunResponse, SqlExecutionError, SubmitResponse
from app.sql_fixtures import CANONICAL_SQL, USER_EVENTS_ROWS


FORBIDDEN_SQL_PATTERN = re.compile(
    r"\b(insert|update|delete|drop|alter|create|truncate|replace|attach|pragma)\b",
    re.IGNORECASE,
)
ALLOWED_PREFIX_PATTERN = re.compile(r"^\s*(with|select)\b", re.IGNORECASE)
MAX_ROWS = 200
MAX_SQL_LENGTH = 4000
SQLITE_TIMEOUT_STEPS = 200000


class SandboxValidationError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


@dataclass
class QueryResult:
    columns: list[str]
    rows: list[list[int | str | None]]


def _normalize_sql(sql: str) -> str:
    normalized = sql.strip()
    if not normalized:
        raise SandboxValidationError("Add a SQL query before running this exercise.")
    if len(normalized) > MAX_SQL_LENGTH:
        raise SandboxValidationError("SQL query is too large for the preview sandbox.")
    if not ALLOWED_PREFIX_PATTERN.match(normalized):
        raise SandboxValidationError("Only SELECT-style queries are supported in this first SQL module slice.")
    if FORBIDDEN_SQL_PATTERN.search(normalized):
        raise SandboxValidationError("Destructive statements are disabled in the SQL preview sandbox.")
    statements = [statement.strip() for statement in normalized.split(";") if statement.strip()]
    if len(statements) > 1:
        raise SandboxValidationError("Submit a single SQL statement at a time in this workspace.")
    return normalized.rstrip(";")


def _build_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:")
    connection.execute(
        """
        CREATE TABLE user_events (
            user_id INTEGER NOT NULL,
            signup_week INTEGER NOT NULL,
            active_week INTEGER NOT NULL
        )
        """
    )
    connection.executemany(
        "INSERT INTO user_events (user_id, signup_week, active_week) VALUES (:user_id, :signup_week, :active_week)",
        USER_EVENTS_ROWS,
    )
    connection.commit()
    return connection


def _execute(connection: sqlite3.Connection, sql: str) -> QueryResult:
    started = time.monotonic()

    def progress_handler() -> int:
        if time.monotonic() - started > 1.5:
            return 1
        return 0

    connection.set_progress_handler(progress_handler, 5000)
    cursor = connection.execute(sql)
    columns = [description[0] for description in cursor.description or []]
    rows = [list(row) for row in cursor.fetchmany(MAX_ROWS + 1)]
    if len(rows) > MAX_ROWS:
        raise SandboxValidationError("Preview results exceeded the row limit for this sandbox.")
    return QueryResult(columns=columns, rows=rows)


def run_sql(sql: str) -> RunResponse:
    try:
        normalized_sql = _normalize_sql(sql)
    except SandboxValidationError as error:
        return RunResponse(
            status="validationError",
            summary=error.message,
            columns=[],
            rows=[],
            rowCount=0,
            explanation="The SQL preview sandbox currently accepts one read-only SELECT-style query at a time.",
            error=SqlExecutionError(code="VALIDATION_ERROR", message=error.message),
        )

    connection = _build_connection()
    try:
        result = _execute(connection, normalized_sql)
    except SandboxValidationError as error:
        return RunResponse(
            status="validationError",
            summary=error.message,
            columns=[],
            rows=[],
            rowCount=0,
            explanation="The SQL preview sandbox currently accepts one read-only SELECT-style query at a time.",
            error=SqlExecutionError(code="VALIDATION_ERROR", message=error.message),
        )
    except sqlite3.OperationalError as error:
        message = str(error).splitlines()[0]
        return RunResponse(
            status="executionError",
            summary="The query could not run against the sandboxed dataset.",
            columns=[],
            rows=[],
            rowCount=0,
            explanation="Check table names, selected columns, and query shape, then run again.",
            error=SqlExecutionError(code="EXECUTION_ERROR", message=message),
        )
    except sqlite3.DatabaseError:
        return RunResponse(
            status="executionError",
            summary="The query hit a sandbox execution error.",
            columns=[],
            rows=[],
            rowCount=0,
            explanation="Keep the query read-only and focused on the provided dataset.",
            error=SqlExecutionError(code="EXECUTION_ERROR", message="The sandbox could not complete this query."),
        )
    finally:
        connection.close()

    return RunResponse(
        status="success",
        summary=f"Returned {len(result.rows)} row{'s' if len(result.rows) != 1 else ''} from the sandboxed SQL dataset.",
        columns=result.columns,
        rows=result.rows,
        rowCount=len(result.rows),
        explanation="Use run previews to inspect cohort logic and deduplication before you submit for evaluation.",
        error=None,
    )


def submit_sql(sql: str) -> SubmitResponse:
    preview = run_sql(sql)
    if preview.status != "success":
        return SubmitResponse(
            status=preview.status,
            summary=preview.summary,
            rubric=RubricBreakdown(correctness=0, structure=0, efficiencyOrDesign=0, overall=0),
            strengths=[],
            issues=[preview.error.message if preview.error else preview.summary],
            nextBestImprovement="Get the query to run successfully before submitting it for review.",
            explanation="The submission flow can only score queries that execute successfully against the sandbox dataset.",
            outputPreview=preview,
        )

    expected = run_sql(CANONICAL_SQL)
    is_exact_match = preview.columns == expected.columns and sorted(preview.rows) == sorted(expected.rows)

    normalized = sql.lower()
    structure_score = 85 if "with " in normalized else 65
    if "distinct" in normalized:
        structure_score += 10
    structure_score = min(structure_score, 100)
    efficiency_score = 80 if "group by" in normalized else 60

    if is_exact_match:
        correctness = 100
        summary = "Submission matched the expected retention output for the sandbox dataset."
        strengths = [
            "Result rows match the expected cohort retention breakdown.",
            "Query structure is legible enough to discuss in an interview setting.",
        ]
        issues = []
        next_step = "If you iterate further, focus on naming and explanation quality rather than changing the logic."
        explanation = "This first-pass evaluator scores output fidelity first, then rewards readable structure and obvious deduplication choices."
        status = "success"
    else:
        correctness = 35
        summary = "Submission ran, but the output does not match the expected retention breakdown yet."
        strengths = [
            "The query executed successfully against the provided schema.",
        ]
        issues = [
            "Returned rows differ from the expected cohort retention output.",
            "Check whether duplicate activity rows are inflating counts or whether cohort weeks are being derived correctly.",
        ]
        next_step = "Compare your output against the expected retention shape and verify that activity weeks are deduplicated before counting."
        explanation = "This reviewer compares final output first. When the row set is off, the most likely issue in this exercise is deduplication or cohort assignment."
        status = "validationError"

    overall = round((correctness * 0.7) + (structure_score * 0.2) + (efficiency_score * 0.1))
    rubric = RubricBreakdown(
        correctness=correctness,
        structure=structure_score,
        efficiencyOrDesign=efficiency_score,
        overall=overall,
    )

    return SubmitResponse(
        status=status,
        summary=summary,
        rubric=rubric,
        strengths=strengths,
        issues=issues,
        nextBestImprovement=next_step,
        explanation=explanation,
        outputPreview=preview,
    )
