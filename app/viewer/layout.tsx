import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function ViewerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      role="Viewer"
      description="Dispatcher-approved fleet visibility"
      navItems={[
        { label: "Default fleet", href: "/viewer/fleet/ccsval_01" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
