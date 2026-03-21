import Link from 'next/link';
import type { PracticeModuleSummary } from '@/types/practice';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import { buttonVariants } from '@/components/ui/button';

export function ModuleCard({ module }: { module: PracticeModuleSummary }) {
  return (
    <Panel variant="default" className="flex min-h-[320px] flex-col p-7">
      <div>
        <Badge variant="premium" className="mb-4 w-fit">{module.difficultyRange}</Badge>
        <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
          {module.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{module.description}</p>
      </div>
      <div className="mt-6 grid gap-3 text-sm text-[var(--text-secondary)]">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Interview skill</p>
          <p className="mt-2 leading-6">{module.interviewSkill}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Typical task</p>
          <p className="mt-2 leading-6">{module.taskShape}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {module.tags.map((tag) => (
          <Badge key={tag} variant="neutral">{tag}</Badge>
        ))}
      </div>
      <Link href={module.href} className={`${buttonVariants({ variant: 'secondary' })} mt-7 w-fit`}>
        {module.ctaLabel}
      </Link>
    </Panel>
  );
}
