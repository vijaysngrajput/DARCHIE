import type { CurrentUnit, ProgressState, SessionSummary } from "@/lib/types";

export function SessionLandingCard({
  session,
  currentUnit,
  progress,
  onContinue,
  busy,
  refreshing,
  timerLabel,
  timerWarning = false,
}: {
  session: SessionSummary;
  currentUnit: CurrentUnit | null;
  progress: ProgressState | null;
  onContinue: () => void;
  busy?: boolean;
  refreshing?: boolean;
  timerLabel?: string | null;
  timerWarning?: boolean;
}) {
  const actionLabel = session.session_state === "created" ? "Start session" : "Resume session";

  return (
    <section className="card surface-card session-page-card">
      <div className="session-masthead">
        <span className="eyebrow">Candidate session</span>
        <h1 className="page-title">Your assessment session is staged and ready to continue without losing context.</h1>
        <p className="subtitle">
          This page keeps the runtime state, timing, and current task visible before you step into the active workspace.
        </p>
      </div>

      <div className="session-support-bar">
        <p className="session-support-copy">
          {session.session_state === "created"
            ? "Starting the session enters the live workspace, activates timing, and keeps autosave ready in the background."
            : "This session is resumable, so continuing will return you to the current task with its latest saved state."}
        </p>
        <div className="session-status-stack">
          <div className="status-inline">Next route: {session.next_route}</div>
          {timerLabel ? (
            <div className={timerWarning ? "status-inline status-inline-warning" : "status-inline"}>{timerLabel}</div>
          ) : null}
          {refreshing ? <div className="status-inline">Refreshing session state...</div> : null}
        </div>
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
        <div className="meta-block">
          <div className="progress-label">Expires at</div>
          <div className="progress-value">{session.expires_at ? new Date(session.expires_at).toLocaleString() : "Starts when you enter"}</div>
        </div>
        <div className="meta-block">
          <div className="progress-label">Resumable</div>
          <div className="progress-value">{session.is_resumable ? "Yes" : "No"}</div>
        </div>
      </div>

      <div className="session-action-row">
        <div className="muted-inline">
          {session.session_state === "created"
            ? "Begin once and the product will keep you inside the guided assessment flow from there."
            : "Resume the live task directly while keeping the dashboard, timing, and recovery states available."}
        </div>
        <button className="button" type="button" onClick={onContinue} disabled={busy}>
          {actionLabel}
        </button>
      </div>
    </section>
  );
}
