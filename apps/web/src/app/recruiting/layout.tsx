import type { ReactNode } from "react";

import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";

const recruitingNav = [
  { label: "Candidates", href: "/recruiting/candidates", description: "Review the pipeline" },
  { label: "Comparisons", href: "/recruiting/comparisons", description: "Compare shortlisted candidates" },
];

export default function RecruitingLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAreaLayout roleLabel="Recruiting" navTitle="Hiring" navItems={recruitingNav}>
      {children}
    </RoleAreaLayout>
  );
}
