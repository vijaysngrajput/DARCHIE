'use client';

import { useEffect, useState, type PropsWithChildren, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from '@/components/shell/app-header';
import { AppSidebar } from '@/components/shell/app-sidebar';
import { MobileNav } from '@/components/shell/mobile-nav';
import { cn } from '@/lib/utils';

export function AppShell({ children, header }: PropsWithChildren<{ header?: ReactNode }>) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [preferenceLoaded, setPreferenceLoaded] = useState(false);
  const useHeaderChrome =
    pathname?.startsWith('/app/practice/sql/') ||
    pathname?.startsWith('/app/practice/python/') ||
    pathname?.startsWith('/app/practice/data-modeling/') ||
    false;

  useEffect(() => {
    if (useHeaderChrome) {
      setPreferenceLoaded(false);
      return;
    }

    const stored = window.localStorage.getItem('darchie-sidebar-collapsed');
    if (stored !== null) {
      setSidebarCollapsed(stored === 'true');
    } else {
      setSidebarCollapsed(false);
    }
    setPreferenceLoaded(true);
  }, [pathname, useHeaderChrome]);

  useEffect(() => {
    if (!preferenceLoaded || useHeaderChrome) return;
    window.localStorage.setItem('darchie-sidebar-collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed, preferenceLoaded, useHeaderChrome]);

  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <div
        className={cn(
          'mx-auto min-h-screen max-w-[1600px]',
          useHeaderChrome ? 'px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8' : 'flex',
        )}
      >
        {useHeaderChrome ? null : (
          <AppSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} />
        )}
        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            useHeaderChrome ? '' : 'px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10',
          )}
        >
          {useHeaderChrome ? <AppHeader /> : null}
          {header}
          <div className="mt-8 flex-1">{children}</div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
