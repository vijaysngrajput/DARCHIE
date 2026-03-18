import type { ReactNode } from "react";

import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";

const adminNav = [
  { label: "Assessments", href: "/admin/assessments", description: "Manage assessments and versions" },
  { label: "Library", href: "/admin/library", description: "Browse reusable components" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAreaLayout roleLabel="Admin" navTitle="Content admin" navItems={adminNav}>
      {children}
    </RoleAreaLayout>
  );
}
