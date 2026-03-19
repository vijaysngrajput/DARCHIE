import Link from "next/link";

interface CandidateRecoveryCardProps {
  eyebrow: string;
  title: string;
  message: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CandidateRecoveryCard({
  eyebrow,
  title,
  message,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: CandidateRecoveryCardProps) {
  return (
    <main className="page-shell completion-shell">
      <section className="card surface-card recovery-card">
        <div className="section-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="page-title">{title}</h1>
          <p className="subtitle">{message}</p>
        </div>
        <div className="button-row">
          <Link className="button" href={primaryHref}>{primaryLabel}</Link>
          {secondaryLabel && secondaryHref ? <Link className="secondary-button" href={secondaryHref}>{secondaryLabel}</Link> : null}
        </div>
      </section>
    </main>
  );
}
