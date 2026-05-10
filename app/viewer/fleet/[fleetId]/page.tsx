import { getShipmentByFleetId } from "@/components/fleet-dashboard/data";
import { ViewerFleetOverview } from "@/components/role-dashboard/role-overviews";

export default async function ViewerFleetPage({
  params,
}: {
  params: Promise<{ fleetId: string }>;
}) {
  const { fleetId } = await params;
  const shipment = getShipmentByFleetId(fleetId);

  return <ViewerFleetOverview shipment={shipment} />;
}
