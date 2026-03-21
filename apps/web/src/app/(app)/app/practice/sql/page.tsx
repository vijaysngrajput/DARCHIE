import { notFound } from 'next/navigation';
import { ModuleLandingPage } from '@/components/practice/module-landing-page';
import { getModuleExercises, getModuleSummary } from '@/lib/practice-data';

export default function SqlPracticeModulePage() {
  const module = getModuleSummary('sql');
  if (!module) notFound();
  return <ModuleLandingPage module={module} exercises={getModuleExercises('sql')} />;
}
