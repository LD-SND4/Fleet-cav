import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function DriverLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedProfile();

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
