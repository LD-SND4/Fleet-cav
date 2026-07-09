"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CurrentLocationMap } from "@/components/map/current-location-map";
import { useLanguage } from "@/components/language-provider";
import type { ShipmentCard } from "@/components/fleet-dashboard/types";
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

function getAdminDeliveryStatus(shipment: ShipmentCard, index: number, languageKey: keyof typeof languages) {
  const labels = {
    en: {
      delivered: "Already delivered",
      dispatcherHalt: "On halt - dispatcher order",
      driverHalt: "On halt - driver requested",
      ongoing: "Ongoing",
      prepared: "Being prepared",
      stopped: "Stopped",
    },
    es: {
      delivered: "Ya entregado",
      dispatcherHalt: "En pausa - orden del despachador",
      driverHalt: "En pausa - solicitado por conductor",
      ongoing: "En curso",
      prepared: "En preparacion",
      stopped: "Detenido",
    },
  }[languageKey];

  if (shipment.status === "On Route") {
    return { label: labels.ongoing, tone: "green" };
  }

  if (shipment.status === "Waiting") {
    return { label: labels.prepared, tone: "yellow" };
  }

  if (shipment.deliveriesToday > 0 && !shipment.active) {
    return { label: labels.delivered, tone: "blue" };
  }

  if (index % 3 === 0) {
    return { label: labels.driverHalt, tone: "pink" };
  }

  if (index % 3 === 1) {
    return { label: labels.dispatcherHalt, tone: "pink" };
  }

  return { label: labels.stopped, tone: "red" };
}

function getStatusToneClass(tone: string) {
  if (tone === "green") {
    return "bg-[#eef9f1] text-[#2d8f4d]";
  }

  if (tone === "yellow") {
    return "bg-[#fff8df] text-[#a17212]";
  }

  if (tone === "blue") {
    return "bg-[#edf5ff] text-[#2d6ea3]";
  }

  if (tone === "pink") {
    return "bg-[#fff2f5] text-[#d9546d]";
  }

  return "bg-[#f4f2f3] text-[#6f6878]";
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
  action?: string;
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
      {action ? (
        <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
          {action}
        </span>
      ) : null}
    </Link>
  );
}

function RouteActionCard({
  shipment,
  action,
  className = "",
  status,
  routeName,
  href = `/dispatcher/tracking/${toVehicleSlug(shipment.id)}`,
}: {
  shipment: ShipmentCard;
  action: string;
  className?: string;
  status: string;
  routeName: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group flex h-full min-h-48 flex-col justify-between rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_18px_44px_rgba(239,102,124,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]",
        className,
      ].join(" ")}
    >
      <div>
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
      </div>
      <span className="mt-5 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
        {action}
      </span>
    </Link>
  );
}

function AdminDeliveryRow({
  shipment,
  index,
  languageKey,
  openLabel,
}: {
  shipment: ShipmentCard;
  index: number;
  languageKey: keyof typeof languages;
  openLabel: string;
}) {
  const deliveryStatus = getAdminDeliveryStatus(shipment, index, languageKey);
  const labels = {
    en: {
      cargo: "Cargo",
      deliveries: "Deliveries",
      driver: "Driver",
      eta: "ETA",
      fleet: "Fleet",
      route: "Route",
      stops: "Stops",
      weight: "Weight",
    },
    es: {
      cargo: "Carga",
      deliveries: "Entregas",
      driver: "Conductor",
      eta: "ETA",
      fleet: "Flota",
      route: "Ruta",
      stops: "Paradas",
      weight: "Peso",
    },
  }[languageKey];

  return (
    <article className="rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{labels.fleet} {shipment.fleetId}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{shipment.fleetLabel}</h2>
        </div>
        <span className={["rounded-full px-3 py-1 text-sm font-semibold", getStatusToneClass(deliveryStatus.tone)].join(" ")}>
          {deliveryStatus.label}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
          <dt className="text-xs font-semibold uppercase text-[#8a8393]">{labels.route}</dt>
          <dd className="mt-1 text-sm font-semibold text-[#394150]">{getLocalizedRouteName(shipment.routeName, languageKey)}</dd>
        </div>
        <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
          <dt className="text-xs font-semibold uppercase text-[#8a8393]">{labels.driver}</dt>
          <dd className="mt-1 text-sm font-semibold text-[#394150]">{shipment.driverName}</dd>
        </div>
        <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
          <dt className="text-xs font-semibold uppercase text-[#8a8393]">{labels.eta}</dt>
          <dd className="mt-1 text-sm font-semibold text-[#394150]">{shipment.eta}</dd>
        </div>
        <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
          <dt className="text-xs font-semibold uppercase text-[#8a8393]">{labels.stops}</dt>
          <dd className="mt-1 text-sm font-semibold text-[#394150]">{shipment.stops.length}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#ece8f1] pt-5">
        <p className="max-w-2xl text-sm leading-6 text-[#6d7685]">
          <span className="font-semibold text-[#394150]">{labels.cargo}:</span> {shipment.cargoSummary || "--"}
          <span className="mx-2 text-[#c7bfcc]">/</span>
          <span className="font-semibold text-[#394150]">{labels.weight}:</span> {shipment.weightKg.toLocaleString()} kg
          <span className="mx-2 text-[#c7bfcc]">/</span>
          <span className="font-semibold text-[#394150]">{labels.deliveries}:</span> {shipment.deliveriesToday}
        </p>
        <Link
          className="inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition hover:bg-[#ef667c] hover:text-white"
          href={`/dispatcher/tracking/${toVehicleSlug(shipment.id)}`}
        >
          {openLabel}
        </Link>
      </div>
    </article>
  );
}

function RouteMapSection({
  className = "",
  latitude,
  longitude,
  mapLabel,
  routeName,
  status,
}: {
  className?: string;
  latitude?: number | null;
  longitude?: number | null;
  mapLabel: string;
  routeName: string;
  status: string;
}) {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-[#dfe3ea] bg-white shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-5">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{mapLabel}</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#20232a]">{routeName}</h2>
        </div>
        <span className="rounded-full bg-[#eef9f1] px-3 py-1 text-sm font-semibold text-[#2d8f4d]">
          {status}
        </span>
      </div>
      <CurrentLocationMap
        className={["rounded-none border-0 border-t border-[#ece8f1]", className].join(" ")}
        latitude={latitude}
        longitude={longitude}
      />
    </section>
  );
}

function RouteMapFleetGrid({
  children,
  latitude,
  longitude,
  mapClassName = "",
  mapLabel,
  routeName,
  status,
}: {
  children: React.ReactNode;
  latitude?: number | null;
  longitude?: number | null;
  mapClassName?: string;
  mapLabel: string;
  routeName: string;
  status: string;
}) {
  return (
    <section className="grid w-full max-w-[1266px] gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-stretch">
      <RouteMapSection
        className={mapClassName}
        latitude={latitude}
        longitude={longitude}
        mapLabel={mapLabel}
        routeName={routeName}
        status={status}
      />
      <div className="min-w-0">{children}</div>
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
      <CurrentLocationMap />
    </section>
  );
}

export function AdminOverview({ shipments }: { shipments: ShipmentCard[] }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;
  if (!shipments.length) {
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
  const defaultShipment = shipments.find((shipment) => shipment.active) ?? shipments[0];
  const defaultTrackingHref = `/dispatcher/tracking/${toVehicleSlug(defaultShipment.id)}`;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a8393]">{overview.admin.addRouteLabel}</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{overview.admin.addRouteTitle}</h2>
        </div>
        <Link
          href="/dispatcher/data"
          className="inline-flex items-center justify-center rounded-full bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]"
        >
          {overview.admin.addRouteCta}
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard label={overview.admin.activeRoutes} value={String(shipments.length)} href={defaultTrackingHref} action={overview.admin.openTracking} />
        <ActionCard label={overview.admin.deliveries} value={String(totalDeliveries)} href="/dispatcher" action={overview.admin.openDispatch} />
        <ActionCard label={overview.admin.cargoWeight} value={`${totalWeight.toLocaleString()} ${content.units.kilograms}`} href="/viewer" action={overview.admin.openViewer} />
        <ActionCard label={overview.admin.fuelCost} value={`$${totalFuelCost}`} href="/admin" action={overview.admin.review} />
      </div>
      <div className="space-y-4">
        {shipments.map((shipment, index) => (
          <AdminDeliveryRow
            index={index}
            key={shipment.id}
            languageKey={languageKey}
            openLabel={overview.common.openRoute}
            shipment={shipment}
          />
        ))}
      </div>
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
      <RouteMapFleetGrid
        mapLabel={overview.common.map}
        routeName={getLocalizedRouteName(defaultShipment.routeName, languageKey)}
        status={getLocalizedStatus(defaultShipment.status, content)}
      >
        <RouteActionCard
          action={overview.common.openRoute}
          routeName={getLocalizedRouteName(defaultShipment.routeName, languageKey)}
          shipment={defaultShipment}
          status={getLocalizedStatus(defaultShipment.status, content)}
        />
      </RouteMapFleetGrid>
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
      <RouteMapFleetGrid mapLabel={overview.common.map} routeName={routeName} status={shipmentStatus}>
        <RouteActionCard action={overview.common.openRoute} routeName={routeName} shipment={shipment} status={shipmentStatus} href={driverHref} />
      </RouteMapFleetGrid>
      <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)] transition hover:bg-[#e75970]" type="button">
        {overview.driver.emergencyStopAlert}
      </button>
    </section>
  );
}

export function ViewerFleetOverview({
  selectedFleetId,
  shipments,
}: {
  selectedFleetId: string;
  shipments: ShipmentCard[];
}) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const overview = content.overviews;
  const emptyStates = content.emptyStates;
  const [selectedId, setSelectedId] = useState(selectedFleetId);
  const shipment = useMemo(
    () => shipments.find((item) => item.fleetId.toLowerCase() === selectedId.toLowerCase()) ?? shipments[0] ?? null,
    [selectedId, shipments],
  );

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
        <ActionCard label={overview.viewer.deliveryTime} value={shipment.timeLeft} href={viewerHref} />
        <ActionCard label={overview.viewer.cargo} value={`${shipment.weightKg.toLocaleString()} ${content.units.kilograms}`} href={viewerHref} />
      </div>
      <RouteMapFleetGrid
        mapClassName="h-[400px] max-h-[400px] w-full max-w-none aspect-auto"
        latitude={shipment.currentLatitude}
        longitude={shipment.currentLongitude}
        mapLabel={overview.common.map}
        routeName={routeName}
        status={shipmentStatus}
      >
        <FleetListPanel
          activeFleetId={shipment.fleetId}
          languageKey={languageKey}
          onSelectFleet={setSelectedId}
          openLabel={overview.viewer.openFleet}
          shipments={shipments}
        />
      </RouteMapFleetGrid>
    </section>
  );
}

function FleetListPanel({
  activeFleetId,
  languageKey,
  onSelectFleet,
  openLabel,
  shipments,
}: {
  activeFleetId: string;
  languageKey: keyof typeof languages;
  onSelectFleet: (fleetId: string) => void;
  openLabel: string;
  shipments: ShipmentCard[];
}) {
  const content = languages[languageKey].roleDashboard;
  const labels = languageKey === "es"
    ? { title: "Flotas actuales", route: "Ruta", load: "Carga" }
    : { title: "Current fleets", route: "Route", load: "Load" };

  return (
    <section className="h-[400px] overflow-hidden rounded-lg border border-[#dfe3ea] bg-white shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
      <div className="border-b border-[#ece8f1] px-5 py-4">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">{labels.title}</p>
      </div>
      <div className="h-[calc(400px-4.5rem)] overflow-y-auto p-3">
        <div className="grid gap-3">
          {shipments.map((shipment) => {
            const active = shipment.fleetId === activeFleetId;
            const status = getLocalizedStatus(shipment.status, content);

            return (
              <button
                className={[
                  "w-full rounded-lg border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef667c]",
                  active
                    ? "border-[#ef667c] bg-[#fff2f5] shadow-[0_12px_28px_rgba(239,102,124,0.12)]"
                    : "border-[#ece8f1] bg-white hover:border-[#ef667c]",
                ].join(" ")}
                key={shipment.id}
                onClick={() => onSelectFleet(shipment.fleetId)}
                type="button"
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-xs font-semibold uppercase text-[#6d7685]">{shipment.fleetId}</span>
                    <span className="mt-1 block text-lg font-semibold text-[#20232a]">{shipment.fleetLabel}</span>
                  </span>
                  <span className={["rounded-full px-3 py-1 text-xs font-semibold", getStatusToneClass(shipment.status === "On Route" ? "green" : shipment.status === "Waiting" ? "yellow" : "red")].join(" ")}>
                    {status}
                  </span>
                </span>
                <span className="mt-3 grid gap-2 text-sm font-semibold text-[#6d7685] sm:grid-cols-2">
                  <span className="rounded-lg bg-[#f8f7fb] px-3 py-2">{labels.route}: {getLocalizedRouteName(shipment.routeName, languageKey)}</span>
                  <span className="rounded-lg bg-[#f8f7fb] px-3 py-2">{labels.load}: {shipment.weightKg.toLocaleString()} {content.units.kilograms}</span>
                </span>
                <span className="mt-3 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d]">
                  {openLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
