import type { PageHeaderProps } from '@/types/ui';
import { cn } from '@/lib/utils';

export function PageHeader({ title, description, actions, variant = 'default' }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        variant === 'workspace' && 'gap-4',
        variant === 'dashboard' && 'gap-6'
      )}
    >
      <div className="max-w-2xl">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
        <h1 className="font-[family-name:var(--font-heading)] text-[34px] font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[42px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
