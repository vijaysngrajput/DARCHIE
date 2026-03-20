import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignUpPage() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Create your workspace</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em]">Start practicing with DARCHIE</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">Set up your account and move straight into interview-focused practice flows.</p>
      <form className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Full name</label>
          <Input placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Email</label>
          <Input type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Password</label>
          <Input type="password" placeholder="Create a password" />
        </div>
        <Button className="w-full">Create account</Button>
      </form>
    </div>
  );
}
