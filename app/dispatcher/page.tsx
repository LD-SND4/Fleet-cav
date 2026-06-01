import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherOverview } from "@/components/role-dashboard/role-overviews";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";
import { getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherPage() {
  const [profile, shipments] = await Promise.all([
    requireAuthenticatedProfile("dispatcher"),
    getShipmentCards(),
  ]);

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
      workspacePermissions={profile.permissions}
    >
      <DispatcherOverview shipments={shipments} />
    </RoleLayoutShell>
  );
}
