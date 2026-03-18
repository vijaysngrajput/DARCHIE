export function TransitionOverlay({ label }: { label: string }) {
  return (
    <div className="transition-overlay" role="status" aria-live="polite" aria-label={label}>
      <div className="transition-card">
        <span className="transition-spinner" aria-hidden="true" />
        <span className="transition-label">{label}</span>
      </div>
    </div>
  );
}
