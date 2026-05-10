import { redirect } from "next/navigation";

import { getDefaultShipment, toVehicleSlug } from "@/components/fleet-dashboard/data";

export default function DispatcherTrackingPage() {
  redirect(`/dispatcher/tracking/${toVehicleSlug(getDefaultShipment().id)}`);
}
