import { notFound } from 'next/navigation';
import { getModuleSummary, getWorkspaceExercise } from '@/lib/practice-data';
import type { PracticeModuleId } from '@/types/practice';
import { WorkspaceShell } from '@/components/practice/workspace-shell';
import { WorkSurface } from '@/components/practice/work-surfaces';

export function WorkspacePage({
  moduleId,
  exerciseId,
}: {
  moduleId: PracticeModuleId;
  exerciseId: string;
}) {
  const module = getModuleSummary(moduleId);
  const workspace = getWorkspaceExercise(moduleId, exerciseId);

  if (!module || !workspace) {
    notFound();
  }

  return (
    <WorkspaceShell
      workspace={workspace}
      surface={
        <WorkSurface
          module={moduleId}
          title={workspace.workSurfaceTitle}
          description={workspace.workSurfaceDescription}
        />
      }
    />
  );
}
