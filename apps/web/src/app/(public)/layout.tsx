import type { ReactNode } from "react";

import { RoleAreaLayout } from "@/components/shell/RoleAreaLayout";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <RoleAreaLayout roleLabel="Public entry" publicShell compactHeader>
      {children}
    </RoleAreaLayout>
  );
}
