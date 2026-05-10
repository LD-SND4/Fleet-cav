import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherOverview } from "@/components/role-dashboard/role-overviews";

export default function DispatcherPage() {
  return (
    <RoleLayoutShell
      role="Dispatcher"
      description="Route setup and active fleet coordination"
      navItems={[
        { label: "Home", href: "/dispatcher" },
        { label: "Tracking", href: "/dispatcher/tracking" },
        { label: "Requests", href: "/dispatcher/requests" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      <DispatcherOverview />
    </RoleLayoutShell>
  );
}
