import Link from 'next/link';
import { PageHeader } from '@/components/shell/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import type { ExerciseSummary, PracticeModuleSummary } from '@/types/practice';

export function ModuleLandingPage({
  module,
  exercises,
}: {
  module: PracticeModuleSummary;
  exercises: ExerciseSummary[];
}) {
  const recommended = exercises.find((exercise) => exercise.recommended) ?? exercises[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={module.title}
        description={module.description}
        actions={<Button size="sm">Browse later</Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel variant="elevated" className="p-7">
          <Badge variant="premium" className="mb-5 w-fit">What you will practice</Badge>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Interview skill</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{module.interviewSkill}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Task shape</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{module.taskShape}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Difficulty bands</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="neutral">Foundations</Badge>
                <Badge variant="neutral">Intermediate</Badge>
                <Badge variant="neutral">Advanced</Badge>
              </div>
            </div>
          </div>
        </Panel>
        <Panel variant="highlighted" className="p-7">
          <Badge variant="premium" className="mb-5 w-fit">Recommended starting point</Badge>
          <h2 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {recommended.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{recommended.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant="neutral">{recommended.difficulty}</Badge>
            <Badge variant="neutral">{recommended.estimatedTime}</Badge>
          </div>
          <Link href={`/app/practice/${module.id}/${recommended.id}`} className="mt-6 inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 text-sm font-semibold text-[#f8f6f1] shadow-[var(--shadow-soft)] transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:bg-[var(--accent-primary-strong)]">
            Start exercise
          </Link>
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Panel key={exercise.id} className="flex min-h-[260px] flex-col p-6">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={exercise.recommended ? 'premium' : 'neutral'}>{exercise.difficulty}</Badge>
                <Badge variant="neutral">{exercise.estimatedTime}</Badge>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {exercise.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{exercise.summary}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {exercise.tags.map((tag) => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
            <Link href={`/app/practice/${module.id}/${exercise.id}`} className="mt-6 inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-panel)] px-4 text-sm font-medium text-[var(--text-primary)] transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:bg-[var(--bg-elevated)]">
              Open workspace
            </Link>
          </Panel>
        ))}
      </div>
    </div>
  );
}
