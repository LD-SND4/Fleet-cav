import { ViewerFleetOverview } from "@/components/role-dashboard/role-overviews";
import { getShipmentCardByFleetId } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function ViewerFleetPage({
  params,
}: {
  params: Promise<{ fleetId: string }>;
}) {
  const { fleetId } = await params;
  const shipment = await getShipmentCardByFleetId(fleetId);

  return <ViewerFleetOverview shipment={shipment} />;
}
