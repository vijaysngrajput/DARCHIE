import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  return (
    <>
      <PageHeader title="Progress" description="Review what you have completed and where your next improvement opportunity sits." />
      <div className="grid gap-5 pt-6 lg:grid-cols-2">
        <Panel>
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">Recent attempt activity</h2>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </Panel>
        <Panel variant="inset">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">No saved trends yet</h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Once you complete a few module attempts, DARCHIE will start surfacing progress trends here.</p>
        </Panel>
      </div>
    </>
  );
}
