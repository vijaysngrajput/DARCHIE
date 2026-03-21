import { Badge } from '@/components/ui/badge';

export function WorkspaceStatusBar({ saveState, feedbackState }: { saveState: string; feedbackState: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 text-sm text-[var(--text-secondary)]">
      <Badge variant="neutral">Status</Badge>
      <span>{saveState}</span>
      <span className="text-[var(--text-muted)]">•</span>
      <span>Feedback state: {feedbackState}</span>
    </div>
  );
}
