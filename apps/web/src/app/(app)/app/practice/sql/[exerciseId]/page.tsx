import { WorkspacePage } from '@/components/practice/workspace-page';

export default async function SqlExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return <WorkspacePage moduleId="sql" exerciseId={exerciseId} />;
}
