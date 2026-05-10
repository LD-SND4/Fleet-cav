import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherRequestsOverview } from "@/components/role-dashboard/dispatcher-requests";

export default function DispatcherRequestsPage() {
  return (
    <RoleLayoutShell
      role="Dispatcher"
      description="Operational request modules"
      navItems={[
        { label: "Home", href: "/dispatcher" },
        { label: "Tracking", href: "/dispatcher/tracking" },
        { label: "Requests", href: "/dispatcher/requests" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      <DispatcherRequestsOverview />
    </RoleLayoutShell>
  );
}
