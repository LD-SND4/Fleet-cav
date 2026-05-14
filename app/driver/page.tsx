import { DriverOverview } from "@/components/role-dashboard/role-overviews";
import { getDefaultShipmentCard } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DriverPage() {
  const shipment = await getDefaultShipmentCard();

  return <DriverOverview shipment={shipment} />;
}
