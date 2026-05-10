export type SidebarItem = {
  label: string;
  href?: string;
  badge?: number;
  active?: boolean;
  children?: { label: string; href?: string; badge?: number }[];
};

export type FilterChip = {
  label: string;
  count: number;
};

export type ShipmentCard = {
  id: string;
  fleetId: string;
  fleetLabel: string;
  driverName: string;
  routeName: string;
  cargoSummary: string;
  weightKg: number;
  fuelUsageGallons: number;
  fuelCostUsd: number;
  distanceKm: number;
  deliveriesToday: number;
  status: "On Route" | "Waiting";
  eta: string;
  timeLeft: string;
  stops: string[];
  vehicleType: "box" | "semi" | "van";
  active?: boolean;
};

export type CargoPhoto = {
  id: string;
  title: string;
  location: string;
  time: string;
};
