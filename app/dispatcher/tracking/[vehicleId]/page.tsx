import { getShipmentByVehicleId } from "@/components/fleet-dashboard/data";
import { FleetDashboardShell } from "@/components/fleet-dashboard/shell";

export default async function DispatcherVehicleTrackingPage({
  params,
}: {
  params: Promise<{ vehicleId: string }>;
}) {
  const { vehicleId } = await params;
  const shipment = getShipmentByVehicleId(vehicleId);

  return <FleetDashboardShell selectedShipment={shipment} />;
}
