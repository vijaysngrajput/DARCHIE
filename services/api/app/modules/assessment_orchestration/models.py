from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base, utc_now


class CandidateAssignmentModel(Base):
    __tablename__ = "candidate_assignments"

    assignment_id: Mapped[str] = mapped_column(String(64), primary_key=True)
    candidate_user_id: Mapped[str] = mapped_column(String(36), index=True)
    assessment_version_id: Mapped[str] = mapped_column(String(64), index=True)
    assignment_state: Mapped[str] = mapped_column(String(32), default="invited", index=True)
    invite_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    current_session_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    latest_completed_session_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)
    invited_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expired_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reopened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class AssessmentSessionModel(Base):
    __tablename__ = "assessment_sessions"

    session_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    assignment_id: Mapped[str] = mapped_column(String(64), index=True)
    assessment_version_id: Mapped[str] = mapped_column(String(64), index=True)
    candidate_user_id: Mapped[str] = mapped_column(String(36), index=True)
    session_state: Mapped[str] = mapped_column(String(32), default="created", index=True)
    current_component_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    current_task_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class SessionComponentStateModel(Base):
    __tablename__ = "session_component_states"

    component_state_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    component_id: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    sequence_no: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class SessionTaskStateModel(Base):
    __tablename__ = "session_task_states"

    task_state_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    component_id: Mapped[str] = mapped_column(String(64), index=True)
    task_id: Mapped[str] = mapped_column(String(64), index=True)
    state: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    sequence_no: Mapped[int] = mapped_column(Integer)
    attempt_no: Mapped[int] = mapped_column(Integer, default=0)
    submission_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    submission_marker: Mapped[str | None] = mapped_column(String(128), nullable=True)
    evaluation_mode: Mapped[str] = mapped_column(String(32), default="rule_based")
    gated: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class GatingStateModel(Base):
    __tablename__ = "gating_states"

    gating_state_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    task_id: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="released", index=True)
    evaluation_mode: Mapped[str] = mapped_column(String(32), default="rule_based")
    hold_reason: Mapped[str | None] = mapped_column(String(128), nullable=True)
    released_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class TimingPolicySnapshotModel(Base):
    __tablename__ = "timing_policy_snapshots"

    timing_policy_snapshot_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    policy_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class AttemptPolicySnapshotModel(Base):
    __tablename__ = "attempt_policy_snapshots"

    attempt_policy_snapshot_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    policy_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class WorkflowTransitionLogModel(Base):
    __tablename__ = "workflow_transition_logs"

    workflow_transition_log_id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessment_sessions.session_id", ondelete="CASCADE"), index=True)
    entity_type: Mapped[str] = mapped_column(String(32), index=True)
    entity_id: Mapped[str] = mapped_column(String(64), index=True)
    from_state: Mapped[str | None] = mapped_column(String(32), nullable=True)
    to_state: Mapped[str] = mapped_column(String(32))
    command_name: Mapped[str] = mapped_column(String(64))
    actor_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
