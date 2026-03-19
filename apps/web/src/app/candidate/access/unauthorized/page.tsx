import { CandidateRecoveryCard } from "@/components/candidate/CandidateRecoveryCard";
import { routes } from "@/lib/routing/routes";

export default function CandidateUnauthorizedPage() {
  return (
    <CandidateRecoveryCard
      eyebrow="Unauthorized"
      title="This session does not belong to the current candidate account."
      message="Return to the dashboard to continue with the valid session owned by your account."
      primaryLabel="Go to dashboard"
      primaryHref={routes.candidateHome}
      secondaryLabel="Sign in again"
      secondaryHref={routes.login}
    />
  );
}
