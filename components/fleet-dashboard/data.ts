import type { SidebarItem } from "./types";

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dispatcher" },
  { label: "Fleets", href: "/dispatcher/data" },
  { label: "Tracking", href: "/dispatcher/tracking", active: true },
  {
    label: "Request",
    href: "/dispatcher/requests",
    children: [
      { label: "Trucks", href: "/dispatcher/requests/trucks" },
      { label: "Cargos", href: "/dispatcher/requests/cargos" },
      { label: "Repair", href: "/dispatcher/requests/repair" },
      { label: "Drivers", href: "/dispatcher/requests/drivers" },
      { label: "Reports", href: "/dispatcher/requests/reports" },
    ],
  },
  { label: "Analysis", href: "/dispatcher/analysis" },
  { label: "History", href: "/dispatcher/history" },
];

export function toVehicleSlug(vehicleId: string) {
  return vehicleId.toLowerCase();
}
