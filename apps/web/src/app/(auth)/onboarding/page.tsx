import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OnboardingPage() {
  return (
    <div>
      <Badge variant="premium" className="mb-4">Step 1 of 4</Badge>
      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em]">Tell us what you want to improve first</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">A few quick choices will help DARCHIE recommend the right starting modules.</p>
      <div className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Target role</label>
          <Input placeholder="Data engineer" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Priority skill area</label>
          <Input placeholder="Pipelines and orchestration" />
        </div>
        <Button>Continue</Button>
      </div>
    </div>
  );
}
