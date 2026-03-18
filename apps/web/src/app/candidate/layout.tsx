import type { ReactNode } from "react";

import { AuthGate } from "@/components/auth/AuthGate";
import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";

const candidateNav = [
  { label: "Current session", description: "Session-specific navigation is shown inside the active flow" },
  { label: "Task workspace", description: "Write and submit responses inside the live workspace" },
  { label: "Help", href: "/login", description: "Return to entry and support" },
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
