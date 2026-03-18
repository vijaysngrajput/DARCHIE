import type { ReactNode } from "react";

import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";

const reviewerNav = [
  { label: "Queue", href: "/reviewer/queue", description: "Prioritized review intake" },
  { label: "Active review", href: "/reviewer/reviews/demo", description: "Evidence and comments workspace" },
];

export default function ReviewerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAreaLayout roleLabel="Reviewer" navTitle="Reviewing" navItems={reviewerNav}>
      {children}
    </RoleAreaLayout>
  );
}
