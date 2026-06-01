import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function DriverLayout({ children }: { children: ReactNode }) {
  const profile = await requireAuthenticatedProfile("driver");

  return (
    <RoleLayoutShell
      roleKey="driver"
      descriptionKey="driverHome"
      navItems={[
        { labelKey: "route", href: "/driver" },
        { labelKey: "switchUser", href: "/login" },
      ]}
      workspacePermissions={profile.permissions}
    >
      {children}
    </RoleLayoutShell>
  );
}
