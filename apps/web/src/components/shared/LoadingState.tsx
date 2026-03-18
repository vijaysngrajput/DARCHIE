export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="page-shell">
      <div className="card hero-card loading-card">{label}</div>
    </div>
  );
}
