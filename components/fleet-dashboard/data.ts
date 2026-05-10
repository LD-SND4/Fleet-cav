import type { CargoPhoto, FilterChip, ShipmentCard, SidebarItem } from "./types";

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dispatcher" },
  { label: "Partners", href: "/dispatcher/partners" },
  { label: "Chats", href: "/dispatcher/chats", badge: 7 },
  { label: "Tracking", href: "/dispatcher/tracking", active: true },
  {
    label: "Request",
    href: "/dispatcher/requests",
    badge: 4,
    children: [
      { label: "Trucks", href: "/dispatcher/requests/trucks" },
      { label: "Cargos", href: "/dispatcher/requests/cargos", badge: 2 },
      { label: "Repair", href: "/dispatcher/requests/repair" },
      { label: "Drivers", href: "/dispatcher/requests/drivers" },
      { label: "Reports", href: "/dispatcher/requests/reports", badge: 2 },
    ],
  },
  { label: "Analysis", href: "/dispatcher/analysis" },
  { label: "History", href: "/dispatcher/history" },
];

export const partnerFilters: FilterChip[] = [
  { label: "Shiphike - For Packages", count: 9 },
  { label: "Roambee", count: 13 },
  { label: "Post Hawk", count: 22 },
  { label: "Loginext", count: 3 },
  { label: "Forwardo", count: 5 },
  { label: "Lopez Pallets", count: 17 },
  { label: "Sonosolve", count: 4 },
];

export const statusFilters: FilterChip[] = [
  { label: "Active", count: 45 },
  { label: "Inactive", count: 28 },
  { label: "All", count: 73 },
];

export const shipmentCards: ShipmentCard[] = [
  {
    id: "RE-74ER453TR5",
    fleetId: "ccsval_02",
    fleetLabel: "Caracas-Valencia 02",
    driverName: "Marcos Rivas",
    routeName: "Caracas to Valencia",
    cargoSummary: "Retail packages and palletized dry goods",
    weightKg: 12400,
    fuelUsageGallons: 41,
    fuelCostUsd: 188,
    distanceKm: 173,
    deliveriesToday: 5,
    status: "On Route",
    eta: "02:47:24",
    timeLeft: "58 min. left",
    stops: ["475 Broadus", "377 Hammond", "247 Burke", "687 Volborg", "874 Beebe"],
    vehicleType: "box",
  },
  {
    id: "YR-34DFR734W2",
    fleetId: "ccsval_01",
    fleetLabel: "Caracas-Valencia 01",
    driverName: "Diego Fernandez",
    routeName: "Caracas to Valencia",
    cargoSummary: "Electronics, sealed boxes, and fragile cargo",
    weightKg: 18300,
    fuelUsageGallons: 56,
    fuelCostUsd: 257,
    distanceKm: 168,
    deliveriesToday: 7,
    status: "On Route",
    eta: "01:38:47",
    timeLeft: "57 min. left",
    stops: ["074 Rosebud", "159 Thurlow", "357 Hathaway", "854 Sheffield", "712 Miles City"],
    vehicleType: "semi",
    active: true,
  },
  {
    id: "DW-847DE74E4R",
    fleetId: "ccsmcy_01",
    fleetLabel: "Caracas-Maracay 01",
    driverName: "Valeria Montilla",
    routeName: "Caracas to Maracay",
    cargoSummary: "Food service boxes and chilled containers",
    weightKg: 9600,
    fuelUsageGallons: 28,
    fuelCostUsd: 129,
    distanceKm: 122,
    deliveriesToday: 4,
    status: "On Route",
    eta: "01:38:47",
    timeLeft: "78 min. left",
    stops: ["874 Sheridan", "589 Stone", "967 Claremont", "474 Leiter", "377 Kendrick"],
    vehicleType: "van",
  },
  {
    id: "AQ-257DRE141E",
    fleetId: "valbar_01",
    fleetLabel: "Valencia-Barquisimeto 01",
    driverName: "Andres Castillo",
    routeName: "Valencia to Barquisimeto",
    cargoSummary: "Mixed parcels and maintenance supplies",
    weightKg: 7100,
    fuelUsageGallons: 33,
    fuelCostUsd: 152,
    distanceKm: 187,
    deliveriesToday: 3,
    status: "Waiting",
    eta: "03:29:58",
    timeLeft: "29 min. left",
    stops: ["125 Kinsey", "654 Saugus", "789 Fallon", "577 Glendive"],
    vehicleType: "van",
  },
  {
    id: "BG-ER74R6984R",
    fleetId: "ccspcz_01",
    fleetLabel: "Caracas-Puerto Cabello 01",
    driverName: "Luis Herrera",
    routeName: "Caracas to Puerto Cabello",
    cargoSummary: "Warehouse replenishment cargo",
    weightKg: 14250,
    fuelUsageGallons: 47,
    fuelCostUsd: 216,
    distanceKm: 209,
    deliveriesToday: 6,
    status: "On Route",
    eta: "00:28:38",
    timeLeft: "88 min. left",
    stops: ["369 Cohagen", "258 Hillside", "147 Rock Springs", "268 Angela"],
    vehicleType: "box",
  },
  {
    id: "CV-414ER58SER",
    fleetId: "mcyval_01",
    fleetLabel: "Maracay-Valencia 01",
    driverName: "Camila Navarro",
    routeName: "Maracay to Valencia",
    cargoSummary: "Small cargo and return inventory",
    weightKg: 5300,
    fuelUsageGallons: 19,
    fuelCostUsd: 87,
    distanceKm: 61,
    deliveriesToday: 2,
    status: "Waiting",
    eta: "02:38:47",
    timeLeft: "18 min. left",
    stops: ["536 Dickinson", "469 Belfield", "641 Medora", "279 Wibaux"],
    vehicleType: "semi",
  },
];

export const detailTabs = [
  "Shipping Info",
  "Vehicle Info",
  "Documents",
  "Company",
  "Billing",
];

export const cargoPhotos: CargoPhoto[] = [
  {
    id: "1",
    title: "Point #1 Cargo Photo",
    location: "712 Miles City",
    time: "01:35 PM",
  },
  {
    id: "2",
    title: "Point #2 Cargo Photo",
    location: "854 Sheffield",
    time: "02:10 PM",
  },
  {
    id: "3",
    title: "Point #3 Cargo Photo",
    location: "357 Hathaway",
    time: "02:40 PM",
  },
];

export function toVehicleSlug(vehicleId: string) {
  return vehicleId.toLowerCase();
}

export function getDefaultShipment() {
  return shipmentCards.find((card) => card.active) ?? shipmentCards[0];
}

export function getShipmentByVehicleId(vehicleId: string) {
  return (
    shipmentCards.find((card) => toVehicleSlug(card.id) === vehicleId.toLowerCase()) ??
    getDefaultShipment()
  );
}

export function getShipmentByFleetId(fleetId: string) {
  return (
    shipmentCards.find((card) => card.fleetId.toLowerCase() === fleetId.toLowerCase()) ??
    getDefaultShipment()
  );
}
