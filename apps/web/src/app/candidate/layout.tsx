import type { ReactNode } from "react";

import { AuthGate } from "@/components/auth/AuthGate";
import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";
import { routes } from "@/lib/routing/routes";

const candidateNav = [
  { label: "Dashboard", href: routes.candidateHome, description: "View active assessments, recent completions, and the next recommended action" },
  { label: "Active session", description: "Current session details, timing, and resume state live inside the assessment flow" },
  { label: "Support", href: routes.login, description: "Return to public entry or local runtime help" },
];

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <RoleAreaLayout roleLabel="Candidate" navTitle="Assessment" navItems={candidateNav}>
        {children}
      </RoleAreaLayout>
    </AuthGate>
  );
}
