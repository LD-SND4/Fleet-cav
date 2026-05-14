"use client";

import Link from "next/link";

import { CurrentLocationMap } from "@/components/map/current-location-map";
import { useLanguage } from "@/components/language-provider";
import type { ShipmentCard } from "@/components/fleet-dashboard/types";
import { updateShipmentLifecycleAction } from "@/lib/supabase/fleet-actions";
import languages from "@/locales/languages.json";

type RoleDashboardContent = typeof languages.en.roleDashboard;

function getLocalizedStatus(status: string, content: RoleDashboardContent) {
  if (status === "On Route") {
    return content.status.onRoute;
  }

  if (status === "Waiting") {
    return content.status.waiting;
  }

  if (status === "Inactive") {
    return content.status.inactive;
  }

  return status;
}

function getLocalizedRouteName(routeName: string, languageKey: keyof typeof languages) {
  return languageKey === "es" ? routeName.replace(" to ", " a ") : routeName;
}

function toVehicleSlug(vehicleId: string) {
  return vehicleId.toLowerCase();
}

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
  action,
  status,
  routeName,
  href = `/dispatcher/tracking/${toVehicleSlug(shipment.id)}`,
}: {
  shipment: ShipmentCard;
  action: string;
  status: string;
  routeName: string;
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
          {status}
        </span>
      </div>
      <div className="mt-6 rounded-lg bg-[#f8f7fb] px-4 py-3 text-sm font-semibold text-[#6d7685]">
        {routeName}
      </div>
      <span className="mt-5 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
        {action}
      </span>
    </Link>
  );
}

function AdminApprovalCard({
  action,
  approveLabel,
  rejectLabel,
  routeName,
  shipment,
  status,
}: {
  action: string;
  approveLabel: string;
  rejectLabel: string;
  routeName: string;
  shipment: ShipmentCard;
  status: string;
}) {
  return (
    <article className="rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{shipment.fleetId}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{shipment.fleetLabel}</h2>
        </div>
        <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
          {status}
        </span>
      </div>
      <div className="mt-6 rounded-lg bg-[#f8f7fb] px-4 py-3 text-sm font-semibold text-[#6d7685]">
        {routeName}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          className="inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition hover:bg-[#ef667c] hover:text-white"
          href={`/dispatcher/tracking/${toVehicleSlug(shipment.id)}`}
        >
          {action}
        </Link>
        <form action={updateShipmentLifecycleAction}>
          <input name="id" type="hidden" value={shipment.id} />
          <input name="status" type="hidden" value="On Route" />
          <button className="rounded-lg bg-[#eef9f1] px-3 py-2 text-sm font-semibold text-[#2d8f4d]" type="submit">
            {approveLabel}
          </button>
        </form>
        <form action={updateShipmentLifecycleAction}>
          <input name="id" type="hidden" value={shipment.id} />
          <input name="status" type="hidden" value="Inactive" />
          <button className="rounded-lg border border-[#f0b4c0] px-3 py-2 text-sm font-semibold text-[#d9546d]" type="submit">
            {rejectLabel}
          </button>
        </form>
      </div>
    </article>
  );
}

function RouteMapSection({
  mapLabel,
  routeName,
  status,
}: {
  mapLabel: string;
  routeName: string;
  status: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#dfe3ea] bg-white shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{mapLabel}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{routeName}</h2>
        </div>
        <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
          {status}
        </span>
      </div>
      <CurrentLocationMap className="h-[22rem] rounded-none border-0 border-t border-[#ece8f1]" />
    </section>
  );
}

function EmptyFleetState({
  actionLabel,
  description,
  eyebrow,
  title,
}: {
  actionLabel: string;
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{title}</h2>
        <p className="mt-3 text-[#6d7685]">{description}</p>
        <Link
          className="mt-6 inline-flex rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]"
          href="/dispatcher/data"
        >
          {actionLabel}
        </Link>
      </div>
      <CurrentLocationMap className="h-[24rem]" />
    </section>
  );
}

export function AdminOverview({ shipments }: { shipments: ShipmentCard[] }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;
  const defaultShipment = shipments.find((shipment) => shipment.active) ?? shipments[0];

  if (!defaultShipment) {
    return (
      <EmptyFleetState
        actionLabel={emptyStates.adminNoData.action}
        description={emptyStates.adminNoData.description}
        eyebrow={emptyStates.eyebrow}
        title={emptyStates.adminNoData.title}
      />
    );
  }

  const totalDeliveries = shipments.reduce((sum, item) => sum + item.deliveriesToday, 0);
  const totalFuelCost = shipments.reduce((sum, item) => sum + item.fuelCostUsd, 0);
  const totalWeight = shipments.reduce((sum, item) => sum + item.weightKg, 0);
  const defaultTrackingHref = `/dispatcher/tracking/${toVehicleSlug(defaultShipment.id)}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard label={overview.admin.activeRoutes} value={String(shipments.length)} href={defaultTrackingHref} action={overview.admin.openTracking} />
        <ActionCard label={overview.admin.deliveries} value={String(totalDeliveries)} href="/dispatcher" action={overview.admin.openDispatch} />
        <ActionCard label={overview.admin.cargoWeight} value={`${totalWeight.toLocaleString()} ${content.units.kilograms}`} href="/viewer" action={overview.admin.openViewer} />
        <ActionCard label={overview.admin.fuelCost} value={`$${totalFuelCost}`} href="/admin" action={overview.admin.review} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {shipments.slice(0, 4).map((shipment) => (
          <AdminApprovalCard
            action={overview.common.openRoute}
            approveLabel={overview.admin.approveRoute}
            key={shipment.id}
            rejectLabel={overview.admin.rejectRoute}
            routeName={getLocalizedRouteName(shipment.routeName, languageKey)}
            shipment={shipment}
            status={getLocalizedStatus(shipment.status, content)}
          />
        ))}
      </div>
      <RouteMapSection
        mapLabel={overview.common.map}
        routeName={getLocalizedRouteName(defaultShipment.routeName, languageKey)}
        status={getLocalizedStatus(defaultShipment.status, content)}
      />
    </section>
  );
}

export function DispatcherOverview({ shipments }: { shipments: ShipmentCard[] }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;
  const defaultShipment = shipments.find((shipment) => shipment.active) ?? shipments[0];

  if (!defaultShipment) {
    return (
      <EmptyFleetState
        actionLabel={emptyStates.dispatcherStart.action}
        description={emptyStates.dispatcherStart.description}
        eyebrow={emptyStates.eyebrow}
        title={emptyStates.dispatcherStart.title}
      />
    );
  }

  const defaultTrackingHref = `/dispatcher/tracking/${toVehicleSlug(defaultShipment.id)}`;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard label={overview.dispatcher.routeBuilder} value={overview.dispatcher.ready} href="/dispatcher/requests" action={overview.dispatcher.startRequest} />
        <ActionCard label={overview.dispatcher.drivers} value="6" href={defaultTrackingHref} action={overview.dispatcher.assign} />
        <ActionCard label={overview.dispatcher.reports} value={overview.dispatcher.emailSheet} href="/dispatcher/requests" action={overview.dispatcher.prepare} />
      </div>
      <RouteMapSection
        mapLabel={overview.common.map}
        routeName={getLocalizedRouteName(defaultShipment.routeName, languageKey)}
        status={getLocalizedStatus(defaultShipment.status, content)}
      />
    </section>
  );
}

export function DriverOverview({ shipment }: { shipment: ShipmentCard | null }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;

  if (!shipment) {
    return (
      <EmptyFleetState
        actionLabel={emptyStates.driverNoRoute.action}
        description={emptyStates.driverNoRoute.description}
        eyebrow={emptyStates.eyebrow}
        title={emptyStates.driverNoRoute.title}
      />
    );
  }

  const driverHref = "/driver";
  const shipmentStatus = getLocalizedStatus(shipment.status, content);
  const routeName = getLocalizedRouteName(shipment.routeName, languageKey);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard label={overview.driver.distance} value={`${shipment.distanceKm} km`} href={driverHref} action={overview.common.openRoute} status={shipmentStatus} />
        <ActionCard label={overview.driver.routeTime} value={shipment.timeLeft} href={driverHref} action={overview.driver.openEta} />
        <ActionCard label={overview.driver.stops} value={String(shipment.stops.length)} href={driverHref} action={overview.driver.openStops} />
      </div>
      <RouteMapSection mapLabel={overview.common.map} routeName={routeName} status={shipmentStatus} />
      <RouteActionCard action={overview.common.openRoute} routeName={routeName} shipment={shipment} status={shipmentStatus} href={driverHref} />
      <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]" type="button">
        {overview.driver.emergencyStopAlert}
      </button>
    </section>
  );
}

export function ViewerFleetOverview({ shipment }: { shipment: ShipmentCard | null }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;

  if (!shipment) {
    return (
      <EmptyFleetState
        actionLabel={emptyStates.viewerFleetNotFound.action}
        description={emptyStates.viewerFleetNotFound.description}
        eyebrow={emptyStates.eyebrow}
        title={emptyStates.viewerFleetNotFound.title}
      />
    );
  }

  const viewerHref = `/viewer/fleet/${shipment.fleetId}`;
  const shipmentStatus = getLocalizedStatus(shipment.status, content);
  const routeName = getLocalizedRouteName(shipment.routeName, languageKey);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard label={overview.viewer.fleetId} value={shipment.fleetId} href={viewerHref} action={overview.viewer.openFleet} status={shipmentStatus} />
        <ActionCard label={overview.viewer.deliveryTime} value={shipment.timeLeft} href={viewerHref} action={overview.common.openRoute} />
        <ActionCard label={overview.viewer.cargo} value={`${shipment.weightKg.toLocaleString()} ${content.units.kilograms}`} href={viewerHref} action={overview.common.openRoute} />
      </div>
      <RouteMapSection mapLabel={overview.common.map} routeName={routeName} status={shipmentStatus} />
      <RouteActionCard action={overview.common.openRoute} routeName={routeName} shipment={shipment} status={shipmentStatus} href={viewerHref} />
    </section>
  );
}
