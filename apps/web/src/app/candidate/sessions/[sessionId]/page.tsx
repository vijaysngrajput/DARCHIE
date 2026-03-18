"use client";

import { use, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";

import { CandidateErrorBanner } from "@/components/candidate/CandidateErrorBanner";
import { SessionLandingCard } from "@/components/candidate/SessionLandingCard";
import { SessionLandingSkeleton } from "@/components/candidate/CandidatePageSkeletons";
import { useCandidateSession } from "@/hooks/useCandidateSession";
import { routes } from "@/lib/routing/routes";
import { TransitionOverlay } from "@/components/shared/TransitionOverlay";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";

export default function CandidateSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { sessionId } = use(params);
  const viewModel = useCandidateSession(sessionId);
  const showTransitionOverlay = useDelayedFlag(busy);

  useEffect(() => {
    router.prefetch(routes.candidateTask(sessionId));
    router.prefetch(routes.candidateComplete(sessionId));
  }, [router, sessionId]);

  if (viewModel.loading && !viewModel.session) {
    return <SessionLandingSkeleton />;
  }

  if (viewModel.error || !viewModel.session) {
    return <div className="page-shell"><CandidateErrorBanner message={viewModel.error ?? "Session unavailable."} /></div>;
  }

  async function handleContinue() {
    setBusy(true);
    try {
      const session = await viewModel.startOrResume();
      startTransition(() => {
        if (session.session_state === "completed") {
          router.push(routes.candidateComplete(session.session_id));
          return;
        }
        router.push(routes.candidateTask(session.session_id));
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      {showTransitionOverlay ? <TransitionOverlay label="Opening your task..." /> : null}
      <SessionLandingCard
        session={viewModel.session}
        currentUnit={viewModel.currentUnit}
        progress={viewModel.progress}
        onContinue={handleContinue}
        busy={busy}
        refreshing={viewModel.refreshing}
      />
    </main>
  );
}
