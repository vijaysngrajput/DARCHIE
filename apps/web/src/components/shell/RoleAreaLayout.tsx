import type { ReactNode } from "react";

import { AppHeader } from "@/components/shell/AppHeader";
import { SideNav, type NavItem } from "@/components/shell/SideNav";
import { UtilityFooter } from "@/components/shell/UtilityFooter";

interface RoleAreaLayoutProps {
  roleLabel: string;
  navTitle?: string;
  navItems?: NavItem[];
  children: ReactNode;
  compactHeader?: boolean;
  publicShell?: boolean;
}

export function RoleAreaLayout({
  roleLabel,
  navTitle,
  navItems = [],
  children,
  compactHeader = false,
  publicShell = false,
}: RoleAreaLayoutProps) {
  const hasNav = !publicShell && navItems.length > 0;

  return (
    <div className={publicShell ? "role-shell role-shell-public" : "role-shell"}>
      <AppHeader roleLabel={roleLabel} compact={compactHeader} />
      <div className="role-shell-body">
        {hasNav ? <SideNav title={navTitle ?? roleLabel} items={navItems} compact={roleLabel === "Candidate"} /> : null}
        <div className="role-shell-main">
          <div className="role-shell-content">{children}</div>
          <UtilityFooter />
        </div>
      </div>
    </div>
  );
}
