import { PageHeader } from '@/components/shell/page-header';
import { SectionContainer } from '@/components/marketing/section-container';
import { Panel } from '@/components/ui/panel';

export default function ModulesPage() {
  const modules = [
    ['SQL', 'Window functions, debugging, and analytical reasoning.'],
    ['Python', 'ETL-style transformation, parsing, and validation tasks.'],
    ['Data modeling', 'Entity design, keys, normalization, and tradeoffs.'],
    ['Pipeline builder', 'Dependencies, orchestration, retries, and observability.'],
  ];

  return (
    <SectionContainer className="py-16 sm:py-20">
      <PageHeader title="Practice across the full data engineering workflow" description="Each module is designed to improve one real interview skill, while still fitting into a single coherent prep experience." />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {modules.map(([title, body]) => (
          <Panel key={title} variant="default" className="flex min-h-[220px] flex-col justify-between p-7">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{body}</p>
          </Panel>
        ))}
      </div>
    </SectionContainer>
  );
}
