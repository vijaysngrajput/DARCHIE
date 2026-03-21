from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


FeedbackStatus = Literal["idle", "running", "success", "validationError", "executionError"]


class PromptSection(BaseModel):
    label: str
    body: str
    collapsible: bool = False


class ExerciseMeta(BaseModel):
    id: str
    module: str
    title: str
    difficulty: str
    estimated_time: str = Field(alias="estimatedTime")
    tags: list[str]
    summary: str


class SchemaColumn(BaseModel):
    name: str
    type: str
    description: str


class SchemaTable(BaseModel):
    name: str
    description: str
    columns: list[SchemaColumn]
    sample_rows: list[dict[str, int]] = Field(alias="sampleRows")


class SqlExerciseDetail(BaseModel):
    exercise: ExerciseMeta
    prompt_sections: list[PromptSection] = Field(alias="promptSections")
    starter_hint: str = Field(alias="starterHint")
    starter_sql: str = Field(alias="starterSql")
    schema_tables: list[SchemaTable] = Field(alias="schema")
    work_surface_title: str = Field(alias="workSurfaceTitle")
    work_surface_description: str = Field(alias="workSurfaceDescription")
    save_state: str = Field(alias="saveState")
    result_summary: str = Field(alias="resultSummary")


class DraftAttempt(BaseModel):
    sql: str
    updated_at: str = Field(alias="updatedAt")


class ExerciseDetailResponse(BaseModel):
    exercise_detail: SqlExerciseDetail = Field(alias="exerciseDetail")
    draft_attempt: DraftAttempt | None = Field(default=None, alias="draftAttempt")
    entitlement: dict[str, str | bool]


class SaveDraftRequest(BaseModel):
    sql: str


class SaveDraftResponse(BaseModel):
    draft_attempt: DraftAttempt = Field(alias="draftAttempt")
    save_state: str = Field(alias="saveState")


class RunRequest(BaseModel):
    sql: str


class SqlExecutionError(BaseModel):
    code: str
    message: str


class RunResponse(BaseModel):
    status: FeedbackStatus
    summary: str
    columns: list[str]
    rows: list[list[int | str | None]]
    row_count: int = Field(alias="rowCount")
    explanation: str
    error: SqlExecutionError | None = None


class SubmitRequest(BaseModel):
    sql: str


class RubricBreakdown(BaseModel):
    correctness: int
    structure: int
    efficiency_or_design: int = Field(alias="efficiencyOrDesign")
    overall: int


class SubmitResponse(BaseModel):
    status: FeedbackStatus
    summary: str
    rubric: RubricBreakdown
    strengths: list[str]
    issues: list[str]
    next_best_improvement: str = Field(alias="nextBestImprovement")
    explanation: str
    output_preview: RunResponse | None = Field(alias="outputPreview", default=None)
