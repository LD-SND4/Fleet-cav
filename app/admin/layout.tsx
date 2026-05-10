import type { ReactNode } from "react";

import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleLayoutShell
      role="Admin"
      description="Fleet performance and delivery intelligence"
      navItems={[
        { label: "Overview", href: "/admin" },
        { label: "Dispatcher tracking", href: "/dispatcher/tracking" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      {children}
    </RoleLayoutShell>
  );
}
