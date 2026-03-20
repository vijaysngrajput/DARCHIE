import type { PropsWithChildren, ReactNode } from 'react';
import { AppSidebar } from '@/components/shell/app-sidebar';
import { MobileNav } from '@/components/shell/mobile-nav';

export function AppShell({ children, header }: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <div className="min-h-screen text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-10">
          {header}
          <div className="mt-8 flex-1">{children}</div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
