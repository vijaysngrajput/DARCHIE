import type { ProgressState } from "@/lib/types";

export function ProgressHeader({ progress }: { progress: ProgressState }) {
  return (
    <section className="card surface-card progress-panel">
      <div className="rail-panel-header">
        <span className="eyebrow">Progress</span>
        <h2 className="rail-title">Session progress</h2>
        <p className="muted-inline">A compact view of where the candidate stands right now.</p>
      </div>
      <div className="progress-grid">
        <div className="progress-tile">
          <span className="progress-label">Current step</span>
          <span className="progress-value">{progress.current_index}</span>
        </div>
        <div className="progress-tile">
          <span className="progress-label">Completed</span>
          <span className="progress-value">{progress.completed_tasks}/{progress.total_tasks}</span>
        </div>
        <div className="progress-tile">
          <span className="progress-label">Submitted</span>
          <span className="progress-value">{progress.submitted_tasks}</span>
        </div>
        <div className="progress-tile">
          <span className="progress-label">Completion</span>
          <span className="progress-value">{progress.percent_complete}%</span>
        </div>
      </div>
    </section>
  );
}
