import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherRequestsOverview } from "@/components/role-dashboard/dispatcher-requests";

export default function DispatcherRequestsPage() {
  return (
    <RoleLayoutShell
      roleKey="dispatcher"
      descriptionKey="dispatcherRequests"
      navItems={[
        { labelKey: "home", href: "/dispatcher" },
        { labelKey: "fleets", href: "/dispatcher/data" },
        { labelKey: "requests", href: "/dispatcher/requests" },
        { labelKey: "tracking", href: "/dispatcher/tracking" },
      ]}
    >
      <DispatcherRequestsOverview />
    </RoleLayoutShell>
  );
}
