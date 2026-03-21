import { notFound } from 'next/navigation';
import { ModuleLandingPage } from '@/components/practice/module-landing-page';
import { getModuleExercises, getModuleSummary } from '@/lib/practice-data';

export default function PipelineBuilderPracticeModulePage() {
  const module = getModuleSummary('pipeline-builder');
  if (!module) notFound();
  return <ModuleLandingPage module={module} exercises={getModuleExercises('pipeline-builder')} />;
}
