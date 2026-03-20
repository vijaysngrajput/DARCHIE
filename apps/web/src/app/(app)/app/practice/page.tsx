import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';

export default function PracticePage() {
  return (
    <>
      <PageHeader title="Practice hub" description="Browse modules, pick a difficulty level, and move into realistic interview tasks." />
      <div className="grid gap-5 pt-6 md:grid-cols-2 xl:grid-cols-4">
        {['SQL', 'Python', 'Data modeling', 'Pipeline builder'].map((module) => (
          <Panel key={module}>
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">{module}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Module shell ready for content and interactions.</p>
          </Panel>
        ))}
      </div>
    </>
  );
}
