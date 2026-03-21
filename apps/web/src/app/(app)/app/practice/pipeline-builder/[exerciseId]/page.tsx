import { WorkspacePage } from '@/components/practice/workspace-page';

export default async function PipelineBuilderExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  return <WorkspacePage moduleId="pipeline-builder" exerciseId={exerciseId} />;
}
