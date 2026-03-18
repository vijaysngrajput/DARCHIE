export function RolePlaceholder({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <main className="page-shell role-placeholder-shell">
      <section className="card surface-card role-placeholder-card">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="page-title">{title}</h1>
        <p className="subtitle">{description}</p>
      </section>
    </main>
  );
}
