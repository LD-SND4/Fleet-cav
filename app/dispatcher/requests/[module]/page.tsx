import { RoleLayoutShell } from "@/components/role-dashboard/role-layout-shell";
import { DispatcherRequestModule } from "@/components/role-dashboard/dispatcher-requests";

export default async function DispatcherRequestModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;

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
    >
      <DispatcherRequestModule moduleKey={module} />
    </RoleLayoutShell>
  );
}
