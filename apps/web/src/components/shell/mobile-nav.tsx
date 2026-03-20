'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appNavItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_92%,transparent)] p-2 shadow-[var(--shadow-panel)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {appNavItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 rounded-[12px] px-2 py-2 text-[11px] font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                active
                  ? 'bg-[color-mix(in_oklab,var(--accent-primary)_12%,var(--bg-panel))] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
