'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="hidden lg:block">
      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-surface)_74%,var(--bg-base))] px-6 py-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">DARCHIE</p>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="font-[family-name:var(--font-heading)] text-[22px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Interview lab
              </h1>
              <span className="rounded-full border border-[color-mix(in_oklab,var(--accent-secondary)_32%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_12%,transparent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
                Focus mode
              </span>
            </div>
          </div>
          <nav className="flex flex-wrap items-center justify-end gap-2">
            {appNavItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                    active
                      ? 'border-[var(--border-strong)] bg-[var(--bg-panel)] text-[var(--text-primary)]'
                      : 'border-[var(--border-soft)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
