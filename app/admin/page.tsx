import { AdminOverview } from "@/components/role-dashboard/role-overviews";
import { getShipmentCards } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const shipments = await getShipmentCards();

  return <AdminOverview shipments={shipments} />;
}
