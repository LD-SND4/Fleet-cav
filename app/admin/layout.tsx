import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      roleKey="admin"
      descriptionKey="adminHome"
      navItems={[
        { labelKey: "overview", href: "/admin" },
        { labelKey: "dispatcherTracking", href: "/dispatcher/tracking" },
        { labelKey: "switchUser", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
