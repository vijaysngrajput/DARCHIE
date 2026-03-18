export function SessionLandingSkeleton() {
  return (
    <main className="page-shell">
      <section className="card surface-card session-page-card">
        <div className="session-masthead">
          <span className="eyebrow">Candidate session</span>
          <div className="skeleton-block skeleton-title" />
          <div className="skeleton-block skeleton-copy" />
        </div>
        <div className="session-support-bar">
          <div className="skeleton-block skeleton-copy" />
          <div className="skeleton-pill" />
        </div>
        <div className="session-overview-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="meta-block" key={index}>
              <div className="skeleton-block skeleton-label" />
              <div className="skeleton-block skeleton-value" />
            </div>
          ))}
        </div>
        <div className="session-action-row">
          <div className="skeleton-block skeleton-inline" />
          <div className="skeleton-button" />
        </div>
      </section>
    </main>
  );
}

export function TaskWorkspaceSkeleton() {
  return (
    <main className="page-shell task-page-shell">
      <div className="task-workspace">
        <aside className="task-rail">
          <section className="card surface-card progress-panel">
            <div className="rail-panel-header">
              <span className="eyebrow">Progress</span>
              <div className="skeleton-block skeleton-subtitle" />
              <div className="skeleton-block skeleton-copy" />
            </div>
            <div className="progress-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="progress-tile" key={index}>
                  <div className="skeleton-block skeleton-label" />
                  <div className="skeleton-block skeleton-value" />
                </div>
              ))}
            </div>
          </section>
          <section className="card surface-card task-context-panel">
            <div className="rail-panel-header">
              <span className="eyebrow">Current task</span>
              <div className="skeleton-block skeleton-subtitle" />
              <div className="skeleton-block skeleton-copy" />
            </div>
            <div className="task-summary-list">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="task-summary-item" key={index}>
                  <div className="skeleton-block skeleton-label" />
                  <div className="skeleton-block skeleton-inline" />
                </div>
              ))}
            </div>
          </section>
        </aside>
        <section className="task-main">
          <section className="card surface-card editor-panel">
            <div className="editor-panel-header">
              <div className="editor-panel-copy">
                <span className="eyebrow">Response editor</span>
                <div className="skeleton-block skeleton-subtitle" />
                <div className="skeleton-block skeleton-copy" />
              </div>
              <div className="skeleton-pill" />
            </div>
            <div className="skeleton-editor" />
            <div className="editor-action-row">
              <div className="skeleton-button skeleton-button-secondary" />
              <div className="skeleton-button" />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
