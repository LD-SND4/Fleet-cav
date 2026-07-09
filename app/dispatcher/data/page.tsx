import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherDataManager } from "@/components/role-dashboard/dispatcher-data-manager";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";
import { getCargoPhotos, getDriverOptions, getFleetLogEntries, getFleetOptions, getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherDataPage() {
  const [profile, cargoPhotos, drivers, fleetLogEntries, fleets, shipments] = await Promise.all([
    requireAuthenticatedProfile("dispatcher"),
    getCargoPhotos(),
    getDriverOptions(),
    getFleetLogEntries(),
    getFleetOptions(),
    getShipmentCards(),
  ]);

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
      workspacePermissions={profile.permissions}
    >
      <DispatcherDataManager
        cargoPhotos={cargoPhotos}
        drivers={drivers}
        fleetLogEntries={fleetLogEntries}
        fleets={fleets}
        shipments={shipments}
      />
    </RoleLayoutShell>
  );
}
