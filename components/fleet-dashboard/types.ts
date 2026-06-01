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
  averageSpeedKmh?: number | null;
  cargoSummary: string;
  currentLatitude?: number | null;
  currentLongitude?: number | null;
  deliveredAt?: string | null;
  weightKg: number;
  temperatureCelsius?: number | null;
  fuelEfficiencyKmPerGallon?: number | null;
  fuelUsageGallons: number;
  fuelCostUsd: number;
  distanceKm: number;
  deliveriesToday: number;
  status: "On Route" | "Waiting" | "Inactive";
  eta: string;
  timeLeft: string;
  stops: string[];
  startedAt?: string | null;
  vehicleType: "box" | "semi" | "van";
  active?: boolean;
};

export type CargoPhoto = {
  id: string;
  imageUrl?: string | null;
  title: string;
  location: string;
  time: string;
};
