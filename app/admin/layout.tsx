import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireAuthenticatedProfile("admin");

  return (
    <RoleLayoutShell
      roleKey="admin"
      descriptionKey="adminHome"
      navItems={[
        { labelKey: "overview", href: "/admin" },
        { labelKey: "dispatcherTracking", href: "/dispatcher/tracking" },
        { labelKey: "switchUser", href: "/login" },
      ]}
      workspacePermissions={profile.permissions}
    >
      {children}
    </RoleLayoutShell>
  );
}
