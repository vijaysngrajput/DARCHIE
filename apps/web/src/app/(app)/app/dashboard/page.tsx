import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import { PageHeader } from '@/components/shell/page-header';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        variant="dashboard"
        title="Your readiness dashboard"
        description="Track momentum across practice modules and keep one clear next move in view."
        actions={<Button size="sm">Continue</Button>}
      />
      <div className="grid gap-6 pt-10 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['SQL reasoning', '78%'],
              ['Pipeline design', '64%'],
              ['Data modeling', '71%'],
            ].map(([title, value], index) => (
              <Panel key={title} variant={index === 1 ? 'highlighted' : 'default'} className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{title}</p>
                <p className="mt-5 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em]">{value}</p>
              </Panel>
            ))}
          </div>
          <Panel className="p-7">
            <Badge variant="neutral" className="mb-5 w-fit">Momentum</Badge>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">
              Your strongest progress is coming from structured pipeline work.
            </h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-7 text-[var(--text-secondary)]">
              Keep that momentum by adding one SQL-heavy exercise next, then return to orchestration sequencing so your technical depth and systems clarity rise together.
            </p>
          </Panel>
        </div>
        <Panel variant="elevated" className="flex flex-col p-7">
          <Badge variant="premium" className="mb-5 w-fit">Start here</Badge>
          <h2 className="font-[family-name:var(--font-heading)] text-[30px] font-semibold tracking-[-0.04em]">
            Pipeline dependency exercise
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            A strong next step if you want to improve orchestration reasoning, retries, and execution-order thinking without losing sight of real interview constraints.
          </p>
          <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Estimated impact</p>
            <p className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">High signal for systems rounds</p>
          </div>
          <Button className="mt-8">Continue</Button>
        </Panel>
      </div>
    </>
  );
}
