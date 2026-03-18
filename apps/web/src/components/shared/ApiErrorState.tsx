export function ApiErrorState({ message }: { message: string }) {
  return (
    <div className="page-shell">
      <div className="hero-card error-banner">{message}</div>
    </div>
  );
}
