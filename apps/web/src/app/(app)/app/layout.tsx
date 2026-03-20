import type { PropsWithChildren } from 'react';
import { AppShell } from '@/components/shell/app-shell';

export default function ProductAppLayout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}
