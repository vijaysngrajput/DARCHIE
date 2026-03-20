import type { PropsWithChildren } from 'react';

export function AuthShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
          <h1 className="mt-6 max-w-xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--text-primary)]">
            A calmer way to practice how data engineering interviews actually feel.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-[var(--text-secondary)]">
            One workspace for SQL, Python, modeling, and pipeline reasoning, with clear structure and realistic feedback.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[500px] rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-panel)] sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
