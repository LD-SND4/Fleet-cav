"use client";

import { LanguageKey, useLanguage } from "@/components/language-provider";
import { CurrentLocationMap } from "@/components/map/current-location-map";
import languages from "@/locales/languages.json";

import { sidebarItems } from "./data";
import { DetailPanel } from "./detail-panel";
import { DashboardSidebar } from "./sidebar";
import { TrackingPanel } from "./tracking-panel";
import type { ShipmentCard } from "./types";

export function FleetDashboardShell({
  selectedShipment,
  shipments,
}: {
  selectedShipment: ShipmentCard | null;
  shipments: ShipmentCard[];
}) {
  const { languageKey, setLanguageKey } = useLanguage();
  const content = languages[languageKey].fleetDashboard;

  return (
    <main className="min-h-screen bg-[#787781] px-6 py-8 text-[#201c27] xl:px-10">
      <div className="relative mx-auto max-w-[1800px] overflow-hidden rounded-lg border border-white/35 bg-white/65 shadow-[0_40px_120px_rgba(33,24,46,0.22)] backdrop-blur">
        <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[18rem_1fr] xl:grid-cols-[18rem_1.15fr_1.45fr]">
          <DashboardSidebar items={sidebarItems} />
          <TrackingPanel selectedVehicleId={selectedShipment?.id} shipments={shipments} />
          {selectedShipment ? <DetailPanel shipment={selectedShipment} /> : <EmptyTrackingDetail content={content.emptyDetail} />}
        </div>
        <div className="absolute bottom-4 right-4 rounded-full border border-[#ece8f1] bg-white/90 p-1 shadow-[0_12px_28px_rgba(69,48,107,0.14)] backdrop-blur">
          {(["es", "en"] as LanguageKey[]).map((key) => (
            <button
              aria-pressed={languageKey === key}
              className={[
                "rounded-full px-3 py-2 text-xs font-semibold uppercase transition",
                languageKey === key ? "bg-[#ef667c] text-white" : "text-[#6f6878] hover:bg-[#fff2f5] hover:text-[#d9546d]",
              ].join(" ")}
              key={key}
              onClick={() => setLanguageKey(key)}
              type="button"
            >
              {key === "es" ? "ESP" : "ENG"}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function EmptyTrackingDetail({ content }: { content: typeof languages.en.fleetDashboard.emptyDetail }) {
  return (
    <section className="space-y-6 bg-white px-8 py-8">
      <div>
        <p className="text-sm font-semibold uppercase text-[#8a8393]">{content.eyebrow}</p>
        <h2 className="mt-1 text-4xl font-semibold tracking-tight text-[#2c2933]">{content.title}</h2>
        <p className="mt-3 max-w-xl text-[#6f6878]">
          {content.description}
        </p>
      </div>
      <CurrentLocationMap />
    </section>
  );
}
