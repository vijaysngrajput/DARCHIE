import type { CurrentUnit, ProgressState, SessionSummary } from "@/lib/types";

import { ProgressHeader } from "@/components/candidate/ProgressHeader";
import { ResponseEditorShell } from "@/components/candidate/ResponseEditorShell";

export function TaskShell({
  session,
  currentUnit,
  progress,
  value,
  onChange,
  onSaveNow,
  onSubmit,
  autosaveStatus,
  autosaveError,
  lastSavedAt,
  submitting,
  refreshing,
  timerLabel,
  timerWarning = false,
}: {
  session: SessionSummary;
  currentUnit: CurrentUnit;
  progress: ProgressState;
  value: string;
  onChange: (value: string) => void;
  onSaveNow: () => void;
  onSubmit: () => void;
  autosaveStatus: "idle" | "saving" | "saved" | "error";
  autosaveError: string | null;
  lastSavedAt: string | null;
  submitting: boolean;
  refreshing?: boolean;
  timerLabel?: string | null;
  timerWarning?: boolean;
}) {
  return (
    <div className="page-shell task-page-shell">
      <div className="task-workspace">
        <aside className="task-rail">
          <ProgressHeader
            progress={progress}
            sessionState={session.session_state}
            timerLabel={timerLabel}
            timerWarning={timerWarning}
          />
          <section className="card surface-card task-context-panel">
            <div className="rail-panel-header">
              <span className="eyebrow">Current task</span>
              <h2 className="rail-title">Task context</h2>
              <p className="muted-inline">The left rail stays compact and stable so timing, task metadata, and workflow context remain visible while the editor leads the page.</p>
            </div>
            {refreshing ? <div className="status-inline">Refreshing task state...</div> : null}
            <div className="task-summary-list">
              <div className="task-summary-item">
                <span className="task-summary-key">Component</span>
                <span className="task-summary-value">{currentUnit.component_id ?? "N/A"}</span>
              </div>
              <div className="task-summary-item">
                <span className="task-summary-key">Task</span>
                <span className="task-summary-value">{currentUnit.task_id ?? "N/A"}</span>
              </div>
              <div className="task-summary-item">
                <span className="task-summary-key">Task state</span>
                <span className="task-summary-value">{currentUnit.task_state}</span>
              </div>
              <div className="task-summary-item">
                <span className="task-summary-key">Evaluation mode</span>
                <span className="task-summary-value">{currentUnit.evaluation_mode ?? "pending"}</span>
              </div>
              <div className="task-summary-item">
                <span className="task-summary-key">Expires at</span>
                <span className="task-summary-value">{session.expires_at ? new Date(session.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "No timer"}</span>
              </div>
            </div>
          </section>
        </aside>
        <section className="task-main">
          <ResponseEditorShell
            value={value}
            onChange={onChange}
            onSaveNow={onSaveNow}
            onSubmit={onSubmit}
            savingStatus={autosaveStatus}
            savingError={autosaveError}
            lastSavedAt={lastSavedAt}
            submitting={submitting}
          />
        </section>
      </div>
    </div>
  );
}
