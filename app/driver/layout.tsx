import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      role="Driver"
      description="Assigned route, cargo, vehicle, and alerts"
      navItems={[
        { label: "Route", href: "/driver" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
