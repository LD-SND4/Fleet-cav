import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function ViewerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      roleKey="viewer"
      descriptionKey="viewerHome"
      navItems={[
        { labelKey: "defaultFleet", href: "/viewer" },
        { labelKey: "switchUser", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
