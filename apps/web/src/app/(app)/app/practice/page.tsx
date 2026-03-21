import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/ui/panel';
import { Badge } from '@/components/ui/badge';
import { ModuleCard } from '@/components/practice/module-card';
import { practiceModules } from '@/lib/practice-data';

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        variant="workspace"
        title="Practice hub"
        description="Choose a module, move into a focused workspace, and practice the kind of reasoning real data engineering interviews actually test. This hub is available as an open preview while deeper features remain selectively restricted."
      />
      <Panel variant="highlighted" className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="premium" className="mb-4 w-fit">Preview access</Badge>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Start from the homepage, explore the modules, and expect some features to stay gated for now.
            </h2>
            <p className="mt-3 max-w-[72ch] text-sm leading-7 text-[var(--text-secondary)]">
              The shared practice shell and mocked module workspaces are open in this preview. Execution, persistence, scoring, and other deeper behaviors can be restricted or unlocked later without changing the overall entry flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">Open preview</Badge>
            <Badge variant="neutral">Mocked workspaces</Badge>
            <Badge variant="neutral">Restrictions later</Badge>
          </div>
        </div>
      </Panel>
      <div className="grid gap-6 xl:grid-cols-2">
        {practiceModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel variant="default" className="p-6 sm:p-7">
          <Badge variant="neutral" className="mb-5 w-fit">How practice works</Badge>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Pick a module', 'Choose the kind of interview reasoning you want to strengthen first.'],
              ['Work in one shell', 'Keep prompt, workspace, and review visible in one structured studio layout.'],
              ['Review what matters', 'Use the result panel to inspect what happened, why it matters, and what to try next.'],
            ].map(([title, body]) => (
              <div key={title} className="border-l border-[var(--border-strong)] pl-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel variant="highlighted" className="p-6 sm:p-7">
          <Badge variant="premium" className="mb-5 w-fit">Recommended next step</Badge>
          <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            Start with SQL or Pipeline Builder.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            SQL sharpens correctness and structure quickly. Pipeline Builder surfaces systems thinking, dependencies, and failure reasoning that interviewers care about.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="neutral">Foundations</Badge>
            <Badge variant="neutral">Intermediate</Badge>
            <Badge variant="neutral">Advanced</Badge>
          </div>
        </Panel>
      </div>
    </div>
  );
}
