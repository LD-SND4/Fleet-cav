import Link from "next/link";

import { getDefaultShipment, shipmentCards, toVehicleSlug } from "@/components/fleet-dashboard/data";
import type { ShipmentCard } from "@/components/fleet-dashboard/types";

function ActionCard({
  label,
  value,
  href,
  action,
  status,
}: {
  label: string;
  value: string;
  href: string;
  action: string;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_18px_44px_rgba(239,102,124,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]"
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold uppercase text-[#6d7685]">{label}</span>
        {status ? (
          <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
            {status}
          </span>
        ) : null}
      </span>
      <span className="mt-3 block text-3xl font-semibold text-[#20232a]">{value}</span>
      <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
        {action}
      </span>
    </Link>
  );
}

function RouteActionCard({
  shipment,
  href = `/dispatcher/tracking/${toVehicleSlug(shipment.id)}`,
}: {
  shipment: ShipmentCard;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_18px_44px_rgba(239,102,124,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{shipment.fleetId}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{shipment.fleetLabel}</h2>
        </div>
        <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
          {shipment.status}
        </span>
      </div>
      <div className="mt-6 rounded-lg bg-[#f8f7fb] px-4 py-3 text-sm font-semibold text-[#6d7685]">
        {shipment.routeName}
      </div>
      <span className="mt-5 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
        Open route
      </span>
    </Link>
  );
}

function RouteMapSection({ shipment }: { shipment: ShipmentCard }) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dfe3ea] bg-white shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">Map</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{shipment.routeName}</h2>
        </div>
        <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
          {shipment.status}
        </span>
      </div>
      <div className="relative h-[22rem] overflow-hidden border-t border-[#ece8f1] bg-[#f3f1f6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:14rem_14rem,2.8rem_2.8rem,2.8rem_2.8rem] opacity-90" />
        <div className="absolute left-[16%] top-[76%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
        <div className="absolute left-[40%] top-[63%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
        <div className="absolute left-[58%] top-[49%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
        <div className="absolute left-[71%] top-[30%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M18 82 C28 70, 32 73, 41 63 S58 48, 71 31" fill="none" stroke="#ef667c" strokeWidth="0.7" />
        </svg>
        <div className="absolute left-5 top-5 rounded-lg bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(69,48,107,0.08)]">
          <p className="text-sm font-semibold text-[#2c2933]">{shipment.fleetLabel}</p>
          <p className="mt-1 text-xs font-semibold uppercase text-[#8a8393]">{shipment.driverName}</p>
        </div>
        <div className="absolute bottom-5 right-5 flex gap-2">
          {["+", "-"].map((symbol) => (
            <button
              key={symbol}
              className="grid h-11 w-11 place-items-center rounded-lg border border-[#f2ced5] bg-white text-2xl leading-none text-[#d9546d] shadow-[0_10px_24px_rgba(69,48,107,0.08)]"
              type="button"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminOverview() {
  const totalDeliveries = shipmentCards.reduce((sum, item) => sum + item.deliveriesToday, 0);
  const totalFuelCost = shipmentCards.reduce((sum, item) => sum + item.fuelCostUsd, 0);
  const totalWeight = shipmentCards.reduce((sum, item) => sum + item.weightKg, 0);
  const defaultTrackingHref = `/dispatcher/tracking/${toVehicleSlug(getDefaultShipment().id)}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard label="Active routes" value="4" href={defaultTrackingHref} action="Open tracking" />
        <ActionCard label="Deliveries" value={String(totalDeliveries)} href="/dispatcher" action="Open dispatch" />
        <ActionCard label="Cargo weight" value={`${totalWeight.toLocaleString()} kg`} href="/viewer" action="Open viewer" />
        <ActionCard label="Fuel cost" value={`$${totalFuelCost}`} href="/admin" action="Review" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {shipmentCards.slice(0, 4).map((shipment) => (
          <RouteActionCard key={shipment.id} shipment={shipment} />
        ))}
      </div>
      <RouteMapSection shipment={getDefaultShipment()} />
    </section>
  );
}

export function DispatcherOverview() {
  const defaultTrackingHref = `/dispatcher/tracking/${toVehicleSlug(getDefaultShipment().id)}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard label="Route builder" value="Ready" href="/dispatcher/requests" action="Start request" />
        <ActionCard label="Drivers" value="6" href={defaultTrackingHref} action="Assign" />
        <ActionCard label="Reports" value="Email / Sheet" href="/dispatcher/requests" action="Prepare" />
      </div>
      <RouteMapSection shipment={getDefaultShipment()} />
    </section>
  );
}

export function DriverOverview() {
  const shipment = getDefaultShipment();
  const driverHref = "/driver";

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard label="Distance" value={`${shipment.distanceKm} km`} href={driverHref} action="Open route" status={shipment.status} />
        <ActionCard label="Route time" value={shipment.timeLeft} href={driverHref} action="Open ETA" />
        <ActionCard label="Stops" value={String(shipment.stops.length)} href={driverHref} action="Open stops" />
      </div>
      <RouteMapSection shipment={shipment} />
      <RouteActionCard shipment={shipment} href={driverHref} />
      <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]" type="button">
        Emergency stop alert
      </button>
    </section>
  );
}

export function ViewerFleetOverview({ shipment }: { shipment: ShipmentCard }) {
  const viewerHref = `/viewer/fleet/${shipment.fleetId}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard label="Fleet ID" value={shipment.fleetId} href={viewerHref} action="Open fleet" status={shipment.status} />
        <ActionCard label="Delivery time" value={shipment.timeLeft} href={viewerHref} action="Open route" />
        <ActionCard label="Cargo" value={`${shipment.weightKg.toLocaleString()} kg`} href={viewerHref} action="Open cargo" />
      </div>
      <RouteMapSection shipment={shipment} />
      <RouteActionCard shipment={shipment} href={viewerHref} />
    </section>
  );
}
