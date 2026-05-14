import { FleetDashboardShell } from "@/components/fleet-dashboard/shell";
import { getShipmentCardByVehicleId, getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherVehicleTrackingPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  const [shipment, shipments] = await Promise.all([
    getShipmentCardByVehicleId(vehicleId),
    getShipmentCards(),
  ]);

  return <FleetDashboardShell selectedShipment={shipment} shipments={shipments} />;
}
