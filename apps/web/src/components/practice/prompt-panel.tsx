import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import type { PromptSection } from '@/types/practice';

export function PromptPanel({
  sections,
  starterHint,
  className,
}: {
  sections: PromptSection[];
  starterHint: string;
  className?: string;
}) {
  return (
    <Panel variant="default" className={cn('p-5 sm:p-6', className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Prompt
        </h2>
        <Badge variant="neutral">Visible context</Badge>
      </div>
      <div className="mt-5 space-y-5">
        {sections.map((section) => (
          <div key={section.label} className="border-b border-[var(--border-soft)] pb-5 last:border-b-0 last:pb-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{section.label}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{section.body}</p>
          </div>
        ))}
      </div>
      {starterHint.trim() ? (
        <div className="mt-6 rounded-[var(--radius-md)] border border-[color-mix(in_oklab,var(--accent-secondary)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,transparent)] px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">Starter hint</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{starterHint}</p>
        </div>
      ) : null}
    </Panel>
  );
}
