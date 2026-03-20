'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-[292px] shrink-0 border-r border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-surface)_58%,var(--bg-base))] px-6 py-7 lg:flex lg:flex-col">
      <div className="mb-10 space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-[26px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            Interview lab
          </h2>
        </div>
        <p className="max-w-[220px] text-sm leading-6 text-[var(--text-secondary)]">
          Practice SQL, Python, modeling, and pipeline reasoning in one calm workspace.
        </p>
      </div>
      <nav className="space-y-1.5">
        {appNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                active
                  ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--border-soft)]'
                  : 'text-[var(--text-secondary)] hover:bg-[color-mix(in_oklab,var(--bg-panel)_72%,transparent)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Next up</p>
        <p className="mt-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]">
          Pipeline dependency review
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          A focused practice block for orchestration order, retries, and execution tradeoffs.
        </p>
      </div>
    </aside>
  );
}
