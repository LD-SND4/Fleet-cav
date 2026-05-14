import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function DriverLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      roleKey="driver"
      descriptionKey="driverHome"
      navItems={[
        { labelKey: "route", href: "/driver" },
        { labelKey: "switchUser", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
