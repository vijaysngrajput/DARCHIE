import { WorkspacePage } from '@/components/practice/workspace-page';

export default async function DataModelingExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return <WorkspacePage moduleId="data-modeling" exerciseId={exerciseId} />;
}
