import { redirect } from "next/navigation";

import { getDefaultShipmentCard } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function ViewerPage() {
  const shipment = await getDefaultShipmentCard();

  if (!shipment) {
    redirect("/dispatcher/data");
  }

  redirect(`/viewer/fleet/${shipment.fleetId}`);
}
