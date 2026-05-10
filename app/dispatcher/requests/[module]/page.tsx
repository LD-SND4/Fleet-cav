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
      role="Dispatcher"
      description="Operational request module"
      navItems={[
        { label: "Home", href: "/dispatcher" },
        { label: "Tracking", href: "/dispatcher/tracking" },
        { label: "Requests", href: "/dispatcher/requests" },
        { label: "Switch user", href: "/login" },
      ]}
    >
      <DispatcherRequestModule moduleKey={module} />
    </RoleLayoutShell>
  );
}
