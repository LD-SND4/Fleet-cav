import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherOverview } from "@/components/role-dashboard/role-overviews";
import { getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherPage() {
  const shipments = await getShipmentCards();

  return (
    <RoleLayoutShell
      roleKey="dispatcher"
      descriptionKey="dispatcherHome"
      navItems={[
        { labelKey: "home", href: "/dispatcher" },
        { labelKey: "fleets", href: "/dispatcher/data" },
        { labelKey: "requests", href: "/dispatcher/requests" },
        { labelKey: "tracking", href: "/dispatcher/tracking" },
      ]}
    >
      <DispatcherOverview shipments={shipments} />
    </RoleLayoutShell>
  );
}
