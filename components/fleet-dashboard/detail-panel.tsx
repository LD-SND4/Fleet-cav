"use client";

import { CurrentLocationMap } from "@/components/map/current-location-map";
import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

import type { ShipmentCard } from "./types";

type DetailContent = typeof languages.en.fleetDashboard.detail;

function getDetailStatus(status: string, content: DetailContent) {
  if (status === "On Route") {
    return content.onRoute;
  }

  if (status === "Waiting") {
    return content.waiting;
  }

  if (status === "Inactive") {
    return content.inactive;
  }

  return status;
}

export function DetailPanel({ shipment }: { shipment: ShipmentCard }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].fleetDashboard.detail;

  return (
    <section className="space-y-8 bg-white px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase text-[#8a8393]">{shipment.fleetId}</p>
            <h2 className="text-5xl font-semibold tracking-tight text-[#2c2933]">{shipment.id}</h2>
            <p className="mt-2 text-lg text-[#6f6878]">{shipment.fleetLabel}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eef9f1] px-4 py-2 text-base font-medium text-[#41a85f]">
            <span className="h-3 w-3 rounded-full bg-current" />
            {getDetailStatus(shipment.status, content)}
          </span>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
            {content.callDriver}
          </button>
          <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)]">
            {content.chatWithDriver}
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#2c2933]">{content.selectedRouteComponent}</h3>
        <div className="overflow-hidden rounded-lg border border-[#ece8f1] bg-white shadow-[0_16px_36px_rgba(69,48,107,0.06)]">
          <div className="relative h-52 bg-[#f2eff6]">
            <div className="absolute inset-y-0 left-[24%] right-[10%] rounded-lg bg-[repeating-linear-gradient(135deg,#ef667c_0,#ef667c_28px,#ee6277_28px,#ee6277_56px)] opacity-90" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="rounded-lg bg-white/90 px-5 py-3 text-lg font-semibold text-[#d9546d]">
                {content.readyForAction}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 px-5 py-5">
            <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)]">
              {content.openRoute}
            </button>
            <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
              {content.assignAction}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-[#2c2933]">{content.route}</h3>
          <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
            {content.changeRoute}
          </button>
        </div>
        <CurrentLocationMap />
      </section>
    </section>
  );
}
