import type { CurrentUnit, ProgressState, SessionSummary } from "@/lib/types";

export function SessionLandingCard({
  session,
  currentUnit,
  progress,
  onContinue,
  busy,
  refreshing,
}: {
  session: SessionSummary;
  currentUnit: CurrentUnit | null;
  progress: ProgressState | null;
  onContinue: () => void;
  busy?: boolean;
  refreshing?: boolean;
}) {
  return (
    <section className="card surface-card session-page-card">
      <div className="session-masthead">
        <span className="eyebrow">Candidate session</span>
        <h1 className="page-title">Your assessment is ready. Move into the active task when you are ready.</h1>
        <p className="subtitle">
          This page keeps the essential runtime context visible and makes the next action unmistakable: start or resume the current task.
        </p>
      </div>

      <div className="session-support-bar">
        <p className="session-support-copy">
          {session.session_state === "created"
            ? "Starting the session will take you directly into the current task workspace with autosave already wired in."
            : "Your session already exists, so continuing will return you to the active task and preserve the flow."}
        </p>
        {refreshing ? <div className="status-inline">Refreshing session state...</div> : null}
      </div>

      <div className="session-overview-grid">
        <div className="meta-block">
          <div className="progress-label">Session state</div>
          <div className="progress-value">{session.session_state}</div>
        </div>
        <div className="meta-block">
          <div className="progress-label">Current task</div>
          <div className="progress-value">{currentUnit?.task_id ?? "Pending"}</div>
        </div>
        <div className="meta-block">
          <div className="progress-label">Assessment version</div>
          <div className="progress-value">{session.assessment_version_id}</div>
        </div>
        <div className="meta-block">
          <div className="progress-label">Completion</div>
          <div className="progress-value">{progress?.percent_complete ?? 0}%</div>
        </div>
      </div>

      <div className="session-action-row">
        <div className="muted-inline">
          {session.session_state === "created"
            ? "Begin once and the workflow will carry you into the first task."
            : "Continue from where the current task state already stands."}
        </div>
        <button className="button" type="button" onClick={onContinue} disabled={busy}>
          {session.session_state === "created" ? "Start session" : "Continue task"}
        </button>
      </div>
    </section>
  );
}
