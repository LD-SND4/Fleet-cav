import { redirect } from "next/navigation";

import { getDefaultShipmentCard, toVehicleSlug } from "@/lib/supabase/fleet-data";

export const dynamic = "force-dynamic";

export default async function DispatcherTrackingPage() {
  const shipment = await getDefaultShipmentCard();

  if (!shipment) {
    redirect("/dispatcher/data");
  }

  redirect(`/dispatcher/tracking/${toVehicleSlug(shipment.id)}`);
}
