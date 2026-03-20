import type { PropsWithChildren } from 'react';
import { MarketingShell } from '@/components/shell/marketing-shell';

export default function MarketingLayout({ children }: PropsWithChildren) {
  return <MarketingShell>{children}</MarketingShell>;
}
