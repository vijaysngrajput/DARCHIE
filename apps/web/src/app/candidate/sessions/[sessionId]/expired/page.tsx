import { CandidateRecoveryCard } from "@/components/candidate/CandidateRecoveryCard";
import { routes } from "@/lib/routing/routes";

export default async function CandidateExpiredPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  return (
    <CandidateRecoveryCard
      eyebrow="Session expired"
      title="The active assessment window has ended."
      message={`Session ${sessionId} has moved into an expired state, so the candidate flow returns to a safe recovery path instead of reopening the task workspace.`}
      primaryLabel="Return to dashboard"
      primaryHref={routes.candidateHome}
      secondaryLabel="Back to sign in"
      secondaryHref={routes.login}
    />
  );
}
