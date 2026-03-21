'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden h-screen shrink-0 border-r border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-surface)_58%,var(--bg-base))] py-7 transition-[width,padding] duration-[180ms] ease-[var(--ease-standard)] lg:flex lg:flex-col',
        collapsed ? 'w-[104px] px-3' : 'w-[292px] px-6',
      )}
    >
      <div className={cn('mb-10 space-y-4', collapsed && 'mb-6')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="h-10 w-full px-0"
            >
              <PanelLeftOpen className="size-4" />
              Open
            </Button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-[26px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Interview lab
              </h2>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="mt-[-4px] px-2"
            >
              <PanelLeftClose className="size-4" />
            </Button>
          </div>
        )}
        {!collapsed ? (
          <p className="max-w-[220px] text-sm leading-6 text-[var(--text-secondary)]">
            Practice SQL, Python, modeling, and pipeline reasoning in one calm workspace.
          </p>
        ) : null}
      </div>
      <nav className="space-y-1.5">
        {appNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex items-center rounded-[var(--radius-md)] py-3 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                active
                  ? 'bg-[var(--bg-panel)] text-[var(--text-primary)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--border-soft)]'
                  : 'text-[var(--text-secondary)] hover:bg-[color-mix(in_oklab,var(--bg-panel)_72%,transparent)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon className="size-4" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>
      {!collapsed ? (
        <div className="mt-auto rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Next up</p>
          <p className="mt-3 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--text-primary)]">
            Pipeline dependency review
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            A focused practice block for orchestration order, retries, and execution tradeoffs.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
