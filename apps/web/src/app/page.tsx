import { MarketingShell } from '@/components/shell/marketing-shell';
import MarketingHomePage from './(marketing)/page';

export default function RootPage() {
  return (
    <MarketingShell>
      <MarketingHomePage />
    </MarketingShell>
  );
}
