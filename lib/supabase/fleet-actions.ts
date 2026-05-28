"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "./server";

const revalidationPaths = ["/admin", "/dispatcher", "/dispatcher/data", "/dispatcher/tracking", "/driver", "/viewer"];

export async function upsertFleetAction(formData: FormData) {
  const supabase = requireSupabase();
  const id = getText(formData, "id");

  await throwIfError(
    supabase.from("fleets").upsert({
      id,
      label: getText(formData, "label"),
      route_name: getText(formData, "route_name"),
    }),
    "fleet",
  );

  revalidateFleetPaths();
}

export async function deleteFleetAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(supabase.from("fleets").delete().eq("id", getText(formData, "id")), "fleet");
  revalidateFleetPaths();
}

export async function upsertDriverAction(formData: FormData) {
  const supabase = requireSupabase();
  const id = getText(formData, "id", false);

  await throwIfError(
    supabase.from("drivers").upsert(
      {
        ...(id ? { id } : {}),
        full_name: getText(formData, "full_name"),
      },
      { onConflict: "full_name" },
    ),
    "driver",
  );

  revalidateFleetPaths();
}

export async function deleteDriverAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(supabase.from("drivers").delete().eq("id", getText(formData, "id")), "driver");
  revalidateFleetPaths();
}

export async function upsertShipmentAction(formData: FormData) {
  const supabase = requireSupabase();
  const isActive = formData.get("is_active") === "on";

  if (isActive) {
    await throwIfError(supabase.from("shipments").update({ is_active: false }).eq("is_active", true), "shipment");
  }

  await throwIfError(
    supabase.from("shipments").upsert({
      cargo_summary: getText(formData, "cargo_summary", false),
      deliveries_today: getInteger(formData, "deliveries_today"),
      distance_km: getInteger(formData, "distance_km"),
      driver_id: getText(formData, "driver_id"),
      eta_text: getText(formData, "eta_text", false),
      fleet_id: getText(formData, "fleet_id"),
      fuel_cost_usd: getNumber(formData, "fuel_cost_usd"),
      fuel_usage_gallons: getNumber(formData, "fuel_usage_gallons"),
      id: getText(formData, "id"),
      is_active: isActive,
      status: getText(formData, "status") as "On Route" | "Waiting" | "Inactive",
      time_left_text: getText(formData, "time_left_text", false),
      vehicle_type: getText(formData, "vehicle_type") as "box" | "semi" | "van",
      weight_kg: getInteger(formData, "weight_kg"),
    }),
    "shipment",
  );

  revalidateFleetPaths();
}

export async function deleteShipmentAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(supabase.from("shipments").delete().eq("id", getText(formData, "id")), "shipment");
  revalidateFleetPaths();
}

export async function updateShipmentLifecycleAction(formData: FormData) {
  const supabase = requireSupabase();
  const id = getText(formData, "id");
  const status = getText(formData, "status") as "On Route" | "Waiting" | "Inactive";
  const isActive = status === "On Route";

  if (isActive) {
    await throwIfError(supabase.from("shipments").update({ is_active: false }).eq("is_active", true), "shipment");
  }

  await throwIfError(
    supabase
      .from("shipments")
      .update({
        is_active: isActive,
        status,
      })
      .eq("id", id),
    "shipment",
  );

  revalidateFleetPaths();
}

export async function upsertShipmentStopAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(
    supabase.from("shipment_stops").upsert(
      {
        address: getText(formData, "address"),
        shipment_id: getText(formData, "shipment_id"),
        stop_order: getInteger(formData, "stop_order") ?? 1,
      },
      { onConflict: "shipment_id,stop_order" },
    ),
    "shipment stop",
  );

  revalidateFleetPaths();
}

export async function deleteShipmentStopAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(
    supabase
      .from("shipment_stops")
      .delete()
      .eq("shipment_id", getText(formData, "shipment_id"))
      .eq("stop_order", getInteger(formData, "stop_order") ?? 1),
    "shipment stop",
  );
  revalidateFleetPaths();
}

export async function upsertCargoPhotoAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(
    supabase.from("cargo_photos").upsert({
      captured_time_text: getText(formData, "captured_time_text", false),
      id: getText(formData, "id"),
      location: getText(formData, "location", false),
      shipment_id: getText(formData, "shipment_id"),
      title: getText(formData, "title"),
    }),
    "cargo photo",
  );

  revalidateFleetPaths();
}

export async function deleteCargoPhotoAction(formData: FormData) {
  const supabase = requireSupabase();

  await throwIfError(supabase.from("cargo_photos").delete().eq("id", getText(formData, "id")), "cargo photo");
  revalidateFleetPaths();
}

function requireSupabase() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and a Supabase server key to .env.local.");
  }

  return supabase;
}

async function throwIfError<T>(
  query: PromiseLike<{ error: { message: string } | null; data: T | null }> | PromiseLike<{ error: { message: string } | null }>,
  entityName: string,
) {
  const result = await query;

  if (result.error) {
    throw new Error(`Unable to save ${entityName}: ${result.error.message}`);
  }
}

function getText(formData: FormData, key: string, required?: true): string;
function getText(formData: FormData, key: string, required: false): string | null;
function getText(formData: FormData, key: string, required = true) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value && required) {
    throw new Error(`${key} is required.`);
  }

  return value || null;
}

function getInteger(formData: FormData, key: string) {
  const value = getText(formData, key, false);

  return value ? Number.parseInt(value, 10) : null;
}

function getNumber(formData: FormData, key: string) {
  const value = getText(formData, key, false);

  return value ? Number(value) : null;
}

function revalidateFleetPaths() {
  revalidationPaths.forEach((path) => revalidatePath(path));
}
