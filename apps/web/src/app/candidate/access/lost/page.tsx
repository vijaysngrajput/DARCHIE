import { CandidateRecoveryCard } from "@/components/candidate/CandidateRecoveryCard";
import { routes } from "@/lib/routing/routes";

export default function CandidateAccessLostPage() {
  return (
    <CandidateRecoveryCard
      eyebrow="Access lost"
      title="Your access session is no longer valid."
      message="Sign in again to restore the candidate dashboard and resume the assessment if the session itself is still valid."
      primaryLabel="Return to sign in"
      primaryHref={routes.login}
      secondaryLabel="Try dashboard again"
      secondaryHref={routes.candidateHome}
    />
  );
}
