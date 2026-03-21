import { notFound } from 'next/navigation';
import { ModuleLandingPage } from '@/components/practice/module-landing-page';
import { getModuleExercises, getModuleSummary } from '@/lib/practice-data';

export default function DataModelingPracticeModulePage() {
  const module = getModuleSummary('data-modeling');
  if (!module) notFound();
  return <ModuleLandingPage module={module} exercises={getModuleExercises('data-modeling')} />;
}
