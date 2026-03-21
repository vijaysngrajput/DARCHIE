import { WorkspacePage } from '@/components/practice/workspace-page';

export default async function PythonExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return <WorkspacePage moduleId="python" exerciseId={exerciseId} />;
}
