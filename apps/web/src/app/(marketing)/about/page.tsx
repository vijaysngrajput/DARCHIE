import { PageHeader } from '@/components/shell/page-header';
import { SectionContainer } from '@/components/marketing/section-container';
import { Panel } from '@/components/ui/panel';

export default function AboutPage() {
  return (
    <SectionContainer className="py-16 sm:py-20">
      <PageHeader title="Built because data engineering prep is fragmented" description="DARCHIE exists to give candidates one place to practice coding, modeling, and pipeline thinking in the way interviews actually evaluate them." />
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Why it exists</h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Most tools isolate SQL, coding, or ETL visuals. DARCHIE brings those layers back together in one coherent practice environment.</p>
        </Panel>
        <Panel variant="highlighted">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">What it aims to feel like</h2>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Calm, technical, and trustworthy. It should help candidates think more clearly, not just answer faster.</p>
        </Panel>
      </div>
    </SectionContainer>
  );
}
