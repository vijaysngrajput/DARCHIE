import { AutosaveStatusBadge } from "@/components/candidate/AutosaveStatusBadge";
import type { DraftSaveStatus } from "@/lib/types";

export function ResponseEditorShell({
  value,
  onChange,
  onSaveNow,
  onSubmit,
  savingStatus,
  savingError,
  lastSavedAt,
  submitting,
}: {
  value: string;
  onChange: (value: string) => void;
  onSaveNow: () => void;
  onSubmit: () => void;
  savingStatus: DraftSaveStatus;
  savingError?: string | null;
  lastSavedAt?: string | null;
  submitting?: boolean;
}) {
  return (
    <section className="card surface-card editor-panel">
      <div className="editor-panel-header">
        <div className="editor-panel-copy">
          <span className="eyebrow">Response editor</span>
          <h2 className="section-title">Write the response here and keep the assessment moving.</h2>
          <p className="form-note">
            Drafts save in the background, save failures never discard typed text, and final submission remains a deliberate action.
          </p>
        </div>
        <AutosaveStatusBadge status={savingStatus} lastSavedAt={lastSavedAt} />
      </div>
      {savingError ? <div className="error-banner">{savingError}</div> : null}
      <textarea
        className="textarea"
        placeholder="Start shaping your response here..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="editor-note">
        <p className="muted-inline">Use save when you want an immediate checkpoint, or finalize once the response is ready.</p>
      </div>
      <div className="editor-action-row">
        <button className="secondary-button" type="button" onClick={onSaveNow}>
          Save now
        </button>
        <button className="button" type="button" onClick={onSubmit} disabled={submitting || value.trim().length === 0}>
          Finalize response
        </button>
      </div>
    </section>
  );
}
