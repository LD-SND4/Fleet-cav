import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherRequestModule } from "@/components/role-dashboard/dispatcher-requests";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function DispatcherRequestModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const [{ module }, profile] = await Promise.all([
    params,
    requireAuthenticatedProfile("dispatcher"),
  ]);

  return (
    <RoleLayoutShell
      roleKey="dispatcher"
      descriptionKey="dispatcherRequestModule"
      navItems={[
        { labelKey: "home", href: "/dispatcher" },
        { labelKey: "fleets", href: "/dispatcher/data" },
        { labelKey: "requests", href: "/dispatcher/requests" },
        { labelKey: "tracking", href: "/dispatcher/tracking" },
      ]}
      workspacePermissions={profile.permissions}
    >
      <DispatcherRequestModule moduleKey={module} />
    </RoleLayoutShell>
  );
}
