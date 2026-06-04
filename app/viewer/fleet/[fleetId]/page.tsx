import { ViewerFleetOverview } from "@/components/role-dashboard/role-overviews";
import { getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function ViewerFleetPage({
  params,
}: {
  params: Promise<{ fleetId: string }>;
}) {
  const { fleetId } = await params;
  const shipments = await getShipmentCards();

  return <ViewerFleetOverview selectedFleetId={fleetId} shipments={shipments} />;
}
