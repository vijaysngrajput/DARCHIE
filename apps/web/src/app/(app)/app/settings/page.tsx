import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage profile details, preferences, and the foundation for future billing settings." />
      <Panel className="mt-6 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">Display name</label>
            <Input defaultValue="DARCHIE user" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-primary)]">Primary focus</label>
            <Input defaultValue="Pipeline design" />
          </div>
        </div>
      </Panel>
    </>
  );
}
