"use client";

import { useEffect, useMemo, useState, use, startTransition } from "react";
import { useRouter } from "next/navigation";

import { CandidateErrorBanner } from "@/components/candidate/CandidateErrorBanner";
import { TaskWorkspaceSkeleton } from "@/components/candidate/CandidatePageSkeletons";
import { TaskShell } from "@/components/candidate/TaskShell";
import { useAutosaveDraft } from "@/hooks/useAutosaveDraft";
import { fetchCandidateTaskView } from "@/lib/api/sessions";
import { finalizeResponse } from "@/lib/api/responses";
import { routes } from "@/lib/routing/routes";
import { TransitionOverlay } from "@/components/shared/TransitionOverlay";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";
import type { CandidateTaskView } from "@/lib/types";

export default function CandidateTaskPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const { sessionId } = use(params);
  const [taskView, setTaskView] = useState<CandidateTaskView | null>(null);
  const [editorValue, setEditorValue] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const showTransitionOverlay = useDelayedFlag(submitting);

  async function load(background = false) {
    if (background && taskView) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const nextView = await fetchCandidateTaskView(sessionId);
      setTaskView(nextView);
      setLoadError(null);
      if (!background) {
        const answer = typeof nextView.draft?.payload?.answer === "string" ? nextView.draft.payload.answer : "";
        setEditorValue(answer);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Task data unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [sessionId]);

  useEffect(() => {
    router.prefetch(routes.candidateComplete(sessionId));
  }, [router, sessionId]);

  const autosave = useAutosaveDraft({
    sessionId,
    taskId: taskView?.current_unit.task_id ?? null,
    payload: useMemo(() => ({ answer: editorValue }), [editorValue]),
    attemptNo: 1,
    enabled: Boolean(sessionId && taskView?.current_unit.task_id),
  });

  if (loading && !taskView) {
    return <TaskWorkspaceSkeleton />;
  }

  if (loadError || !taskView) {
    return <div className="page-shell"><CandidateErrorBanner message={loadError ?? "Task data unavailable."} /></div>;
  }

  async function handleSubmit() {
    const currentTaskId = taskView?.current_unit.task_id;
    if (!currentTaskId) {
      return;
    }
    setSubmitting(true);
    try {
      const result = await finalizeResponse({
        session_id: sessionId,
        task_id: currentTaskId,
        payload: { answer: editorValue },
        submission_key: `submission-${sessionId}-${currentTaskId}`,
        attempt_no: 1,
      });
      startTransition(() => {
        if (result.session_state === "completed") {
          router.push(routes.candidateComplete(sessionId));
          return;
        }
      });
      if (result.session_state !== "completed") {
        await load(true);
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to finalize response.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      {showTransitionOverlay ? <TransitionOverlay label="Finalizing your response..." /> : null}
      {loadError ? (
        <div className="page-shell" style={{ paddingBottom: 0 }}>
          <CandidateErrorBanner message={loadError} />
        </div>
      ) : null}
      <TaskShell
        currentUnit={taskView.current_unit}
        progress={taskView.progress}
        value={editorValue}
        onChange={setEditorValue}
        onSaveNow={() => void autosave.saveNow()}
        onSubmit={() => void handleSubmit()}
        autosaveStatus={autosave.status}
        autosaveError={autosave.error}
        lastSavedAt={autosave.lastSavedAt ?? taskView.draft?.updated_at ?? null}
        submitting={submitting}
        refreshing={refreshing}
      />
    </main>
  );
}
