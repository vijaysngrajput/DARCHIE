import Link from 'next/link';
import { ArrowRight, ChartColumnIncreasing, DatabaseZap, GitBranchPlus, Workflow } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import { SectionContainer } from '@/components/marketing/section-container';

export function SectionHero() {
  return (
    <SectionContainer className="py-20 sm:py-24 lg:py-28">
      <div className="grid items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div className="max-w-[620px]">
          <Badge variant="premium" className="mb-6 w-fit">Interview-first practice for data engineers</Badge>
          <h1 className="max-w-[11ch] font-[family-name:var(--font-heading)] text-[48px] font-semibold leading-[0.98] tracking-[-0.055em] text-[var(--text-primary)] sm:text-[60px] lg:text-[72px]">
            Build stronger data engineering judgment.
          </h1>
          <p className="mt-7 max-w-[54ch] text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
            Practice SQL, Python, data modeling, and pipeline logic in a product that mirrors how modern interviews evaluate tradeoffs, structure, and execution thinking.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent-secondary)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,transparent)] px-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)] transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:bg-[color-mix(in_oklab,var(--accent-secondary)_16%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              Start practicing <ArrowRight className="size-4" />
            </Link>
            <Link href="/modules" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
              Explore modules
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ['Real workflow practice', 'Move beyond question banks into realistic interview structure.'],
              ['Visual systems thinking', 'Explain orchestration and modeling logic without whiteboard guesswork.'],
              ['Clear progress signals', 'See where your readiness is improving and what to train next.'],
            ].map(([title, body]) => (
              <div key={title} className="border-l border-[var(--border-strong)] pl-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <Panel variant="elevated" className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-soft)] px-6 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Product preview</p>
                  <h2 className="mt-2 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-[-0.04em]">
                    Readiness overview
                  </h2>
                </div>
                <Badge variant="info">Live workspace</Badge>
              </div>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:px-7">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['SQL reasoning', '78%'],
                  ['Pipeline design', '64%'],
                  ['Data modeling', '71%'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
                    <p className="text-[12px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
                    <p className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5">
                  <div className="flex items-center gap-3 text-[var(--text-primary)]">
                    <Workflow className="size-4" />
                    <span className="text-sm font-semibold">Pipeline builder</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                      <DatabaseZap className="size-4" /> Source ingestion
                    </div>
                    <div className="ml-6 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                      <GitBranchPlus className="size-4" /> Validation + transform
                    </div>
                    <div className="ml-12 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                      <ChartColumnIncreasing className="size-4" /> Analytics sink
                    </div>
                  </div>
                </div>
                <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,var(--bg-panel))] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Next recommendation</p>
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    Orchestration sequencing drill
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    Strengthen retry logic, dependency order, and failure handling with one guided simulation.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </SectionContainer>
  );
}
