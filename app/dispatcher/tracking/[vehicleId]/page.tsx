import { FleetDashboardShell } from "@/components/fleet-dashboard/shell";
import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";
import { getShipmentCardByVehicleId, getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherVehicleTrackingPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  const [profile, shipment, shipments] = await Promise.all([
    requireAuthenticatedProfile("dispatcher"),
    getShipmentCardByVehicleId(vehicleId),
    getShipmentCards(),
  ]);

  return <FleetDashboardShell selectedShipment={shipment} shipments={shipments} workspacePermissions={profile.permissions} />;
}
