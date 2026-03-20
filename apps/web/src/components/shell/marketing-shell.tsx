import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { DatabaseZap } from 'lucide-react';
import { marketingNavItems } from '@/lib/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MarketingShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-base)_90%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-8 lg:gap-10">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-[14px] border border-[color-mix(in_oklab,var(--accent-secondary)_28%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_12%,transparent)] text-[var(--accent-secondary)] shadow-[var(--shadow-soft)] transition-colors duration-[130ms] ease-[var(--ease-standard)] group-hover:bg-[color-mix(in_oklab,var(--accent-secondary)_16%,transparent)]">
                <DatabaseZap className="size-4" />
              </span>
              <span className="flex flex-col">
                <span className="font-[family-name:var(--font-heading)] text-[14px] font-semibold uppercase tracking-[0.22em] text-[var(--text-primary)]">
                  DARCHIE
                </span>
                <span className="text-[11px] tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Interview lab
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-2 md:flex">
              {marketingNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center rounded-full border border-transparent px-4 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:border-[var(--border-soft)] hover:bg-[color-mix(in_oklab,var(--bg-panel)_72%,transparent)] hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link href="/signin" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}>
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent-secondary)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,transparent)] px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)] transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:bg-[color-mix(in_oklab,var(--accent-secondary)_16%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            >
              Start practicing
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[var(--border-soft)]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
          <div className="max-w-md">
            <p className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-primary)]">
              DARCHIE
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              A premium interview lab for data engineers who need to practice systems thinking, not only syntax.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-[var(--text-muted)]">
            <Link href="/modules" className="hover:text-[var(--text-primary)]">Modules</Link>
            <Link href="/pricing" className="hover:text-[var(--text-primary)]">Pricing</Link>
            <Link href="/about" className="hover:text-[var(--text-primary)]">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
