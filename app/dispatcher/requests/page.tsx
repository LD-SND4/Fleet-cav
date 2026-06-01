import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherRequestsOverview } from "@/components/role-dashboard/dispatcher-requests";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function DispatcherRequestsPage() {
  const profile = await requireAuthenticatedProfile("dispatcher");

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
      <DispatcherRequestsOverview />
    </RoleLayoutShell>
  );
}
