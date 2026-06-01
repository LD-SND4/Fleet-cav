"use client";

import type { ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";
import {
  deleteCargoPhotoAction,
  deleteDriverAction,
  deleteFleetAction,
  deleteShipmentAction,
  deleteShipmentStopAction,
  upsertCargoPhotoAction,
  upsertDriverAction,
  upsertFleetAction,
  upsertShipmentAction,
  upsertShipmentStopAction,
} from "@/lib/supabase/fleet-actions";
import type { DriverOption, FleetOption } from "@/lib/supabase/fleet-data";
import type { CargoPhoto, ShipmentCard } from "@/components/fleet-dashboard/types";

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required = true,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold uppercase text-[#6d7685]">
      <span>{label}</span>
      <input
        className="w-full rounded-lg border border-[#dfe3ea] bg-[#f8f7fb] px-4 py-3 normal-case text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c] focus:bg-white"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "any" : undefined}
        type={type}
      />
    </label>
  );
}

function SelectField({
  children,
  label,
  name,
}: {
  children: ReactNode;
  label: string;
  name: string;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold uppercase text-[#6d7685]">
      <span>{label}</span>
      <select
        className="w-full rounded-lg border border-[#dfe3ea] bg-[#f8f7fb] px-4 py-3 normal-case text-[#20232a] outline-none transition focus:border-[#ef667c] focus:bg-white"
        name={name}
        required
      >
        {children}
      </select>
    </label>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]"
      type="submit"
    >
      {children}
    </button>
  );
}

function DeleteButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="rounded-lg border border-[#f0b4c0] px-4 py-2 text-sm font-semibold text-[#d9546d] transition hover:bg-[#fff2f5]"
      type="submit"
    >
      {children}
    </button>
  );
}

export function DispatcherDataManager({
  cargoPhotos,
  drivers,
  fleets,
  shipments,
}: {
  cargoPhotos: CargoPhoto[];
  drivers: DriverOption[];
  fleets: FleetOption[];
  shipments: ShipmentCard[];
}) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard.dispatcherData;

  return (
    <section className="space-y-6 pb-12">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{content.title}</h2>
        <p className="mt-3 max-w-3xl text-[#6d7685]">
          {content.intro}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <form action={upsertFleetAction} className="space-y-4 rounded-lg border border-[#dfe3ea] bg-white p-5">
          <h3 className="text-2xl font-semibold text-[#20232a]">{content.forms.fleet}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={content.fields.fleetId} name="id" placeholder={content.placeholders.fleetId} />
            <Field label={content.fields.label} name="label" placeholder={content.placeholders.fleetLabel} />
            <Field label={content.fields.routeName} name="route_name" placeholder={content.placeholders.routeName} />
          </div>
          <SubmitButton>{content.actions.saveFleet}</SubmitButton>
        </form>

        <form action={upsertDriverAction} className="space-y-4 rounded-lg border border-[#dfe3ea] bg-white p-5">
          <h3 className="text-2xl font-semibold text-[#20232a]">{content.forms.driver}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label={content.fields.fullName} name="full_name" placeholder={content.placeholders.driverName} />
            <Field label={content.fields.phoneNumber} name="phone_number" placeholder={content.placeholders.phoneNumber} required={false} />
            <Field label={content.fields.licenseNumber} name="license_number" placeholder={content.placeholders.licenseNumber} required={false} />
          </div>
          <SubmitButton>{content.actions.saveDriver}</SubmitButton>
        </form>
      </div>

      <form action={upsertShipmentAction} className="space-y-4 rounded-lg border border-[#dfe3ea] bg-white p-5">
        <h3 className="text-2xl font-semibold text-[#20232a]">{content.forms.shipment}</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label={content.fields.shipmentId} name="id" placeholder={content.placeholders.shipmentId} />
          <SelectField label={content.fields.fleet} name="fleet_id">
            <option value="">{content.select.fleet}</option>
            {fleets.map((fleet) => (
              <option key={fleet.id} value={fleet.id}>
                {fleet.label}
              </option>
            ))}
          </SelectField>
          <SelectField label={content.fields.driver} name="driver_id">
            <option value="">{content.select.driver}</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.full_name}
              </option>
            ))}
          </SelectField>
          <SelectField label={content.fields.status} name="status">
            <option value="On Route">{content.statuses.onRoute}</option>
            <option value="Waiting">{content.statuses.waiting}</option>
            <option value="Inactive">{content.statuses.inactive}</option>
          </SelectField>
          <SelectField label={content.fields.vehicle} name="vehicle_type">
            <option value="box">{content.vehicles.box}</option>
            <option value="semi">{content.vehicles.semi}</option>
            <option value="van">{content.vehicles.van}</option>
          </SelectField>
          <Field label={content.fields.currentLatitude} name="current_latitude" placeholder={content.placeholders.latitude} required={false} type="number" />
          <Field label={content.fields.currentLongitude} name="current_longitude" placeholder={content.placeholders.longitude} required={false} type="number" />
          <Field label={content.fields.averageSpeedKmh} name="average_speed_kmh" required={false} type="number" />
          <Field label={content.fields.temperatureCelsius} name="temperature_celsius" required={false} type="number" />
          <Field label={content.fields.weightKg} name="weight_kg" required={false} type="number" />
          <Field label={content.fields.fuelGallons} name="fuel_usage_gallons" required={false} type="number" />
          <Field label={content.fields.fuelCostUsd} name="fuel_cost_usd" required={false} type="number" />
          <Field label={content.fields.fuelEfficiency} name="fuel_efficiency_km_per_gallon" required={false} type="number" />
          <Field label={content.fields.distanceKm} name="distance_km" required={false} type="number" />
          <Field label={content.fields.deliveriesToday} name="deliveries_today" required={false} type="number" />
          <Field label={content.fields.etaText} name="eta_text" placeholder={content.placeholders.etaText} required={false} />
          <Field label={content.fields.timeLeft} name="time_left_text" placeholder={content.placeholders.timeLeft} required={false} />
          <Field label={content.fields.startedAt} name="started_at" required={false} type="datetime-local" />
          <Field label={content.fields.deliveredAt} name="delivered_at" required={false} type="datetime-local" />
        </div>
        <label className="block space-y-2 text-sm font-semibold uppercase text-[#6d7685]">
          <span>{content.fields.cargoSummary}</span>
          <textarea
            className="min-h-24 w-full rounded-lg border border-[#dfe3ea] bg-[#f8f7fb] px-4 py-3 normal-case text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c] focus:bg-white"
            name="cargo_summary"
            placeholder={content.placeholders.cargoSummary}
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-semibold text-[#394150]">
          <input className="h-4 w-4 accent-[#ef667c]" name="is_active" type="checkbox" />
          {content.actions.markActive}
        </label>
        <SubmitButton>{content.actions.saveShipment}</SubmitButton>
      </form>

      <div className="grid gap-4 xl:grid-cols-2">
        <form action={upsertShipmentStopAction} className="space-y-4 rounded-lg border border-[#dfe3ea] bg-white p-5">
          <h3 className="text-2xl font-semibold text-[#20232a]">{content.forms.shipmentStop}</h3>
          <SelectField label={content.forms.shipment} name="shipment_id">
            <option value="">{content.select.shipment}</option>
            {shipments.map((shipment) => (
              <option key={shipment.id} value={shipment.id}>
                {shipment.id}
              </option>
            ))}
          </SelectField>
          <div className="grid gap-4 md:grid-cols-[8rem_1fr_10rem_10rem]">
            <Field label={content.fields.order} name="stop_order" type="number" />
            <Field label={content.fields.address} name="address" placeholder={content.placeholders.address} />
            <Field label={content.fields.latitude} name="latitude" placeholder={content.placeholders.latitude} required={false} type="number" />
            <Field label={content.fields.longitude} name="longitude" placeholder={content.placeholders.longitude} required={false} type="number" />
          </div>
          <label className="flex items-center gap-3 text-sm font-semibold text-[#394150]">
            <input className="h-4 w-4 accent-[#ef667c]" name="completed" type="checkbox" />
            {content.fields.completed}
          </label>
          <SubmitButton>{content.actions.saveStop}</SubmitButton>
        </form>

        <form action={upsertCargoPhotoAction} className="space-y-4 rounded-lg border border-[#dfe3ea] bg-white p-5">
          <h3 className="text-2xl font-semibold text-[#20232a]">{content.forms.cargoPhoto}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={content.fields.photoId} name="id" placeholder={content.placeholders.photoId} />
            <SelectField label={content.forms.shipment} name="shipment_id">
              <option value="">{content.select.shipment}</option>
              {shipments.map((shipment) => (
                <option key={shipment.id} value={shipment.id}>
                  {shipment.id}
                </option>
              ))}
            </SelectField>
            <Field label={content.fields.title} name="title" placeholder={content.placeholders.photoTitle} />
            <Field label={content.fields.imageUrl} name="image_url" placeholder={content.placeholders.imageUrl} required={false} />
            <Field label={content.fields.location} name="location" placeholder={content.placeholders.address} required={false} />
            <Field label={content.fields.capturedTime} name="captured_time_text" placeholder={content.placeholders.capturedTime} required={false} />
          </div>
          <SubmitButton>{content.actions.saveCargoPhoto}</SubmitButton>
        </form>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <RecordList title={content.lists.fleets}>
          {fleets.map((fleet) => (
            <li className="flex items-center justify-between gap-3 rounded-lg bg-[#f8f7fb] px-4 py-3" key={fleet.id}>
              <span>
                <span className="block font-semibold text-[#20232a]">{fleet.label}</span>
                <span className="text-sm text-[#6d7685]">{fleet.id}</span>
              </span>
              <form action={deleteFleetAction}>
                <input name="id" type="hidden" value={fleet.id} />
                <DeleteButton>{content.actions.delete}</DeleteButton>
              </form>
            </li>
          ))}
        </RecordList>

        <RecordList title={content.lists.drivers}>
          {drivers.map((driver) => (
            <li className="flex items-center justify-between gap-3 rounded-lg bg-[#f8f7fb] px-4 py-3" key={driver.id}>
              <span>
                <span className="block font-semibold text-[#20232a]">{driver.full_name}</span>
                <span className="text-sm text-[#6d7685]">{driver.phone_number || driver.license_number || driver.id}</span>
              </span>
              <form action={deleteDriverAction}>
                <input name="id" type="hidden" value={driver.id} />
                <DeleteButton>{content.actions.delete}</DeleteButton>
              </form>
            </li>
          ))}
        </RecordList>

        <RecordList title={content.lists.shipments}>
          {shipments.map((shipment) => (
            <li className="space-y-3 rounded-lg bg-[#f8f7fb] px-4 py-3" key={shipment.id}>
              <div className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-semibold text-[#20232a]">{shipment.id}</span>
                  <span className="text-sm text-[#6d7685]">{shipment.fleetLabel}</span>
                </span>
                <form action={deleteShipmentAction}>
                  <input name="id" type="hidden" value={shipment.id} />
                  <DeleteButton>{content.actions.delete}</DeleteButton>
                </form>
              </div>
              <div className="space-y-2">
                {shipment.stops.map((stop, index) => (
                  <form action={deleteShipmentStopAction} className="flex items-center justify-between gap-2 text-sm" key={`${shipment.id}-${stop}`}>
                    <span className="text-[#6d7685]">{index + 1}. {stop}</span>
                    <input name="shipment_id" type="hidden" value={shipment.id} />
                    <input name="stop_order" type="hidden" value={index + 1} />
                    <button className="font-semibold text-[#d9546d]" type="submit">
                      {content.actions.remove}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </RecordList>

        <RecordList title={content.lists.cargoPhotos}>
          {cargoPhotos.map((photo) => (
            <li className="flex items-center justify-between gap-3 rounded-lg bg-[#f8f7fb] px-4 py-3" key={photo.id}>
              <span>
                <span className="block font-semibold text-[#20232a]">{photo.title}</span>
                <span className="text-sm text-[#6d7685]">{photo.location || photo.id}</span>
              </span>
              <form action={deleteCargoPhotoAction}>
                <input name="id" type="hidden" value={photo.id} />
                <DeleteButton>{content.actions.delete}</DeleteButton>
              </form>
            </li>
          ))}
        </RecordList>
      </div>
    </section>
  );
}

function RecordList({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="rounded-lg border border-[#dfe3ea] bg-white p-5">
      <h3 className="text-2xl font-semibold text-[#20232a]">{title}</h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </section>
  );
}
