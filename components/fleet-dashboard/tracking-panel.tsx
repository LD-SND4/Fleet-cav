"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

import { toVehicleSlug } from "./data";
import type { FilterChip, ShipmentCard } from "./types";

type TrackingContent = typeof languages.en.fleetDashboard.tracking;

function getStatusLabel(status: string, content: TrackingContent) {
  if (status === "On Route") {
    return content.onRoute;
  }

  if (status === "Waiting") {
    return content.waiting;
  }

  if (status === "Active") {
    return content.active;
  }

  if (status === "Inactive") {
    return content.inactive;
  }

  if (status === "All") {
    return content.all;
  }

  return status;
}

function getTimeLeftLabel(timeLeft: string, languageKey: keyof typeof languages) {
  if (languageKey !== "es") {
    return timeLeft;
  }

  return timeLeft.replace(/^(\d+) min\. left$/, "faltan $1 min.");
}

function ChipGroup({
  title,
  items,
  content,
}: {
  title: string;
  items: FilterChip[];
  content?: TrackingContent;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium text-[#726c7d]">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-2 rounded-lg border border-[#ef667c] bg-white/80 px-4 py-2 text-sm font-medium text-[#d9546d]"
          >
            {content ? getStatusLabel(item.label, content) : item.label}
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[#ef667c] px-1 text-xs text-white">
              {item.count}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function VehicleIllustration({ type }: { type: ShipmentCard["vehicleType"] }) {
  const widthClass =
    type === "semi" ? "w-56" : type === "van" ? "w-40" : "w-44";

  return (
    <div className="flex h-36 items-end justify-center overflow-hidden rounded-2xl bg-linear-to-b from-[#eef1f7] to-[#f9f9fc]">
      <div className={`relative ${widthClass} h-16 rounded-xl bg-[#cfd5de]`}>
        {type === "semi" ? <div className="absolute left-28 top-0 h-16 w-28 bg-[#d7dce4]" /> : null}
        <div className="absolute -bottom-4 left-4 h-8 w-8 rounded-full border-[6px] border-[#49515d] bg-white" />
        <div className="absolute -bottom-4 right-4 h-8 w-8 rounded-full border-[6px] border-[#49515d] bg-white" />
        {type === "semi" ? (
          <>
            <div className="absolute -bottom-4 right-20 h-8 w-8 rounded-full border-[6px] border-[#49515d] bg-white" />
            <div className="absolute -bottom-4 right-36 h-8 w-8 rounded-full border-[6px] border-[#49515d] bg-white" />
          </>
        ) : null}
      </div>
    </div>
  );
}

function ShipmentCardView({
  card,
  selected,
  content,
  languageKey,
}: {
  card: ShipmentCard;
  selected: boolean;
  content: TrackingContent;
  languageKey: keyof typeof languages;
}) {
  return (
    <Link
      href={`/dispatcher/tracking/${toVehicleSlug(card.id)}`}
      className={[
        "group block rounded-lg border bg-white p-6 shadow-[0_14px_34px_rgba(69,48,107,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(69,48,107,0.12)]",
        selected ? "border-[#ef667c] shadow-[0_22px_44px_rgba(239,102,124,0.16)]" : "border-transparent",
      ].join(" ")}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[#2e2a35]">{card.id}</h3>
          <p className="mt-1 text-sm text-[#8a8393]">{card.fleetLabel}</p>
        </div>
        <span
          className={[
            "inline-flex items-center gap-2 text-sm font-medium",
            card.status === "On Route" ? "text-[#41a85f]" : "text-[#d9818f]",
          ].join(" ")}
        >
          <span className="h-3 w-3 rounded-full bg-current opacity-80" />
          {getStatusLabel(card.status, content)}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-[1fr_1.2fr] gap-4 rounded-2xl bg-[#f6f4fb] p-4">
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-[#312d39]">{card.eta}</p>
          <p className="text-base text-[#8c8696]">{getTimeLeftLabel(card.timeLeft, languageKey)}</p>
        </div>
        <div className="flex items-center justify-end border-l border-[#ddd8e6] pl-4">
          <span className="rounded-lg bg-[#fff2f5] px-4 py-3 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
            {content.openRoute}
          </span>
        </div>
      </div>

      <VehicleIllustration type={card.vehicleType} />
    </Link>
  );
}

export function TrackingPanel({
  selectedVehicleId,
  shipments,
}: {
  selectedVehicleId?: string;
  shipments: ShipmentCard[];
}) {
  const { languageKey } = useLanguage();
  const dashboardContent = languages[languageKey].fleetDashboard;
  const content = dashboardContent.tracking;

  return (
    <section className="space-y-8 bg-[#f4f2fb] px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-[#2c2933]">{content.title}</h1>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#7d7589] shadow-[0_12px_28px_rgba(69,48,107,0.08)]">
          {content.search}
        </div>
      </div>

      <ChipGroup title={content.show} items={getStatusFilters(shipments)} content={content} />

      <div className="grid gap-5 xl:grid-cols-2">
        {shipments.length > 0 ? (
          shipments.map((card) => (
            <ShipmentCardView
              key={card.id}
              card={card}
              content={content}
              languageKey={languageKey}
              selected={selectedVehicleId ? card.id === selectedVehicleId : Boolean(card.active)}
            />
          ))
        ) : (
          <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 text-[#6d7685] shadow-[0_12px_32px_rgba(32,35,42,0.04)] xl:col-span-2">
            {dashboardContent.emptyTracking.shipments}
          </div>
        )}
      </div>
    </section>
  );
}

function getStatusFilters(shipments: ShipmentCard[]): FilterChip[] {
  return [
    { label: "Active", count: shipments.filter((shipment) => shipment.status === "On Route").length },
    { label: "Inactive", count: shipments.filter((shipment) => shipment.status === "Inactive").length },
    { label: "All", count: shipments.length },
  ];
}
