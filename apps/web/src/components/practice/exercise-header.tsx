import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ExerciseSummary } from '@/types/practice';

export function ExerciseHeader({
  exercise,
  saveState,
}: {
  exercise: ExerciseSummary;
  saveState: string;
}) {
  return (
    <div className="sticky top-6 z-10 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_92%,transparent)] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="premium">{exercise.difficulty}</Badge>
            <Badge variant="neutral">{exercise.estimatedTime}</Badge>
            {exercise.tags.map((tag) => (
              <Badge key={tag} variant="neutral">{tag}</Badge>
            ))}
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[30px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {exercise.title}
          </h1>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{saveState}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button variant="secondary" size="sm">Run</Button>
          <Button size="sm">Submit</Button>
        </div>
      </div>
    </div>
  );
}
