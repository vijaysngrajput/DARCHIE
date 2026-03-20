import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Welcome back</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em]">Sign in to continue your practice</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">Pick up where you left off with your modules, dashboards, and mock interview prep.</p>
      <form className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Email</label>
          <Input type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-primary)]">Password</label>
          <Input type="password" placeholder="Enter your password" />
        </div>
        <Button className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
