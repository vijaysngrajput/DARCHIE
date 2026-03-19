"use client";

import { use, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";

import { CandidateErrorBanner } from "@/components/candidate/CandidateErrorBanner";
import { SessionLandingCard } from "@/components/candidate/SessionLandingCard";
import { SessionLandingSkeleton } from "@/components/candidate/CandidatePageSkeletons";
import { useCandidateSession } from "@/hooks/useCandidateSession";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { routes } from "@/lib/routing/routes";
import { TransitionOverlay } from "@/components/shared/TransitionOverlay";
import { useDelayedFlag } from "@/hooks/useDelayedFlag";

export default function CandidateSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { sessionId } = use(params);
  const viewModel = useCandidateSession(sessionId);
  const timer = useSessionTimer(viewModel.session?.expires_at);
  const showTransitionOverlay = useDelayedFlag(busy);

  useEffect(() => {
    router.prefetch(routes.candidateHome);
    router.prefetch(routes.candidateTask(sessionId));
    router.prefetch(routes.candidateComplete(sessionId));
    router.prefetch(routes.candidateExpired(sessionId));
  }, [router, sessionId]);

  useEffect(() => {
    if (viewModel.errorStatus === 401) {
      router.replace(routes.candidateAccessLost);
      return;
    }
    if (viewModel.errorStatus === 403) {
      router.replace(routes.candidateUnauthorized);
    }
  }, [router, viewModel.errorStatus]);

  useEffect(() => {
    if (!viewModel.session) {
      return;
    }
    const expectedLandingRoute = routes.candidateSession(sessionId);
    if (viewModel.session.next_route !== expectedLandingRoute) {
      router.replace(viewModel.session.next_route);
    }
  }, [router, sessionId, viewModel.session]);

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
        router.push(session.next_route);
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-shell">
      {showTransitionOverlay ? <TransitionOverlay label="Opening your assessment workspace..." /> : null}
      <SessionLandingCard
        session={viewModel.session}
        currentUnit={viewModel.currentUnit}
        progress={viewModel.progress}
        onContinue={handleContinue}
        busy={busy}
        refreshing={viewModel.refreshing}
        timerLabel={timer.label}
        timerWarning={timer.warning}
      />
    </main>
  );
}
