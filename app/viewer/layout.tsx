import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function ViewerLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedProfile();

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
