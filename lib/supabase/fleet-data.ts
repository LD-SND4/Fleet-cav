import "server-only";

import type { CargoPhoto, ShipmentCard } from "@/components/fleet-dashboard/types";

import type { Database } from "./database.types";
import { createSupabaseServerClient } from "./server";

type FleetRow = Database["public"]["Tables"]["fleets"]["Row"];
type DriverRow = Database["public"]["Tables"]["drivers"]["Row"];
type ShipmentRow = Database["public"]["Tables"]["shipments"]["Row"];
type StopRow = Pick<
  Database["public"]["Tables"]["shipment_stops"]["Row"],
  "address" | "completed" | "latitude" | "longitude" | "stop_order"
>;
type CargoPhotoRow = Database["public"]["Tables"]["cargo_photos"]["Row"];

type ShipmentQueryRow = ShipmentRow & {
  drivers: Pick<DriverRow, "full_name"> | null;
  fleets: Pick<FleetRow, "id" | "label" | "route_name"> | null;
  shipment_stops: StopRow[] | null;
};

export type FleetOption = Pick<FleetRow, "id" | "label" | "route_name">;
export type FleetLogEntry = FleetOption;
export type DriverOption = Pick<DriverRow, "full_name" | "id" | "license_number" | "phone_number">;

const baseShipmentSelect = `
  id,
  fleet_id,
  driver_id,
  cargo_summary,
  weight_kg,
  fuel_usage_gallons,
  fuel_cost_usd,
  distance_km,
  deliveries_today,
  status,
  eta_text,
  time_left_text,
  vehicle_type,
  is_active,
  created_at,
  fleets ( id, label, route_name ),
  drivers ( full_name ),
  shipment_stops ( address, stop_order )
`;

const pocShipmentSelect = `
  id,
  fleet_id,
  driver_id,
  cargo_summary,
  weight_kg,
  fuel_usage_gallons,
  fuel_cost_usd,
  distance_km,
  deliveries_today,
  status,
  eta_text,
  time_left_text,
  vehicle_type,
  is_active,
  created_at,
  current_latitude,
  current_longitude,
  average_speed_kmh,
  temperature_celsius,
  fuel_efficiency_km_per_gallon,
  started_at,
  delivered_at,
  updated_at,
  fleets ( id, label, route_name ),
  drivers ( full_name ),
  shipment_stops ( address, stop_order, latitude, longitude, completed )
`;

export async function getShipmentCards(): Promise<ShipmentCard[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("shipments")
    .select(pocShipmentSelect)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Unable to load POC shipment fields; falling back to base schema:", error.message);

    const fallback = await supabase
      .from("shipments")
      .select(baseShipmentSelect)
      .order("created_at", { ascending: false });

    if (fallback.error || !fallback.data) {
      console.error("Unable to load shipments from Supabase:", fallback.error?.message);
      return [];
    }

    return (fallback.data as unknown as ShipmentQueryRow[]).map(mapShipmentRowToCard);
  }

  if (!data) {
    console.error("Unable to load shipments from Supabase.");
    return [];
  }

  return (data as unknown as ShipmentQueryRow[]).map(mapShipmentRowToCard);
}

export async function getDefaultShipmentCard(): Promise<ShipmentCard | null> {
  const cards = await getShipmentCards();

  return cards.find((card) => card.active) ?? cards[0] ?? null;
}

export async function getShipmentCardByVehicleId(vehicleId: string): Promise<ShipmentCard | null> {
  const cards = await getShipmentCards();

  return cards.find((card) => toVehicleSlug(card.id) === vehicleId.toLowerCase()) ?? null;
}

export async function getShipmentCardByFleetId(fleetId: string): Promise<ShipmentCard | null> {
  const cards = await getShipmentCards();

  return cards.find((card) => card.fleetId.toLowerCase() === fleetId.toLowerCase()) ?? null;
}

export async function getFleetOptions(): Promise<FleetOption[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from("fleets").select("id, label, route_name").order("label");

  if (error || !data) {
    console.error("Unable to load fleets from Supabase:", error?.message);
    return [];
  }

  return data;
}

export async function getFleetLogEntries(): Promise<FleetLogEntry[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from("fleets").select("id, label, route_name").order("id");

  if (error || !data) {
    console.error("Unable to load fleet log entries from Supabase:", error?.message);
    return [];
  }

  return data;
}

export async function getDriverOptions(): Promise<DriverOption[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("drivers")
    .select("id, full_name, phone_number, license_number")
    .order("full_name");

  if (error) {
    console.warn("Unable to load POC driver fields; falling back to base schema:", error.message);

    const fallback = await supabase.from("drivers").select("id, full_name").order("full_name");

    if (fallback.error || !fallback.data) {
      console.error("Unable to load drivers from Supabase:", fallback.error?.message);
      return [];
    }

    return (fallback.data as DriverRow[]).map((driver) => ({
      full_name: driver.full_name,
      id: driver.id,
      license_number: null,
      phone_number: null,
    }));
  }

  if (!data) {
    console.error("Unable to load drivers from Supabase.");
    return [];
  }

  return data;
}

export async function getCargoPhotosForShipment(shipmentId: string): Promise<CargoPhoto[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cargo_photos")
    .select("id, shipment_id, title, location, captured_time_text, image_url, created_at")
    .eq("shipment_id", shipmentId)
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("Unable to load POC cargo photo fields; falling back to base schema:", error.message);

    const fallback = await supabase
      .from("cargo_photos")
      .select("id, shipment_id, title, location, captured_time_text, created_at")
      .eq("shipment_id", shipmentId)
      .order("created_at", { ascending: true });

    if (fallback.error || !fallback.data) {
      console.error("Unable to load cargo photos from Supabase:", fallback.error?.message);
      return [];
    }

    return (fallback.data as CargoPhotoRow[]).map(mapCargoPhotoRow);
  }

  if (!data) {
    console.error("Unable to load cargo photos from Supabase.");
    return [];
  }

  return (data as CargoPhotoRow[]).map(mapCargoPhotoRow);
}

export async function getCargoPhotos(): Promise<CargoPhoto[]> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cargo_photos")
    .select("id, shipment_id, title, location, captured_time_text, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("Unable to load POC cargo photo fields; falling back to base schema:", error.message);

    const fallback = await supabase
      .from("cargo_photos")
      .select("id, shipment_id, title, location, captured_time_text, created_at")
      .order("created_at", { ascending: false });

    if (fallback.error || !fallback.data) {
      console.error("Unable to load cargo photos from Supabase:", fallback.error?.message);
      return [];
    }

    return (fallback.data as CargoPhotoRow[]).map(mapCargoPhotoRow);
  }

  if (!data) {
    console.error("Unable to load cargo photos from Supabase.");
    return [];
  }

  return (data as CargoPhotoRow[]).map(mapCargoPhotoRow);
}

export function toVehicleSlug(vehicleId: string) {
  return vehicleId.toLowerCase();
}

function mapShipmentRowToCard(row: ShipmentQueryRow): ShipmentCard {
  const sortedStops = [...(row.shipment_stops ?? [])].sort((a, b) => a.stop_order - b.stop_order);

  return {
    active: row.is_active,
    averageSpeedKmh: row.average_speed_kmh,
    cargoSummary: row.cargo_summary ?? "",
    currentLatitude: row.current_latitude,
    currentLongitude: row.current_longitude,
    deliveredAt: row.delivered_at,
    deliveriesToday: row.deliveries_today ?? 0,
    distanceKm: row.distance_km ?? 0,
    driverName: row.drivers?.full_name ?? "Unassigned",
    eta: row.eta_text ?? "--:--:--",
    fleetId: row.fleets?.id ?? row.fleet_id,
    fleetLabel: row.fleets?.label ?? row.fleet_id,
    fuelEfficiencyKmPerGallon: row.fuel_efficiency_km_per_gallon,
    fuelCostUsd: Number(row.fuel_cost_usd ?? 0),
    fuelUsageGallons: Number(row.fuel_usage_gallons ?? 0),
    id: row.id,
    routeName: row.fleets?.route_name ?? "",
    status: row.status,
    startedAt: row.started_at,
    stops: sortedStops.map((stop) => stop.address),
    temperatureCelsius: row.temperature_celsius,
    timeLeft: row.time_left_text ?? "",
    vehicleType: row.vehicle_type,
    weightKg: row.weight_kg ?? 0,
  };
}

function mapCargoPhotoRow(photo: CargoPhotoRow): CargoPhoto {
  return {
    id: photo.id,
    imageUrl: photo.image_url,
    location: photo.location ?? "",
    time: photo.captured_time_text ?? "",
    title: photo.title,
  };
}
