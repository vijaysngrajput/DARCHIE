import type { DraftSaveStatus } from "@/lib/types";

const LABELS: Record<DraftSaveStatus, string> = {
  idle: "Waiting for changes",
  saving: "Saving draft...",
  saved: "Draft saved",
  error: "Autosave failed",
};

export function AutosaveStatusBadge({ status, lastSavedAt }: { status: DraftSaveStatus; lastSavedAt?: string | null }) {
  const savedSuffix = status === "saved" && lastSavedAt ? ` at ${new Date(lastSavedAt).toLocaleTimeString()}` : "";
  return (
    <span className="status-badge" data-status={status}>
      {LABELS[status]}
      {savedSuffix}
    </span>
  );
}
