"use client";

import { LanguageKey, useLanguage } from "@/components/language-provider";
import { CurrentLocationMap } from "@/components/map/current-location-map";
import { WorkspaceViewSidebar } from "@/components/shared/workspace-view-sidebar";
import type { PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

import { sidebarItems } from "./data";
import { DetailPanel } from "./detail-panel";
import { DashboardSidebar } from "./sidebar";
import { TrackingPanel } from "./tracking-panel";
import type { ShipmentCard } from "./types";

export function FleetDashboardShell({
  selectedShipment,
  shipments,
  workspacePermissions,
}: {
  selectedShipment: ShipmentCard | null;
  shipments: ShipmentCard[];
  workspacePermissions?: PermissionRole[];
}) {
  const { languageKey, setLanguageKey } = useLanguage();
  const content = languages[languageKey].fleetDashboard;
  const activeWorkspacePermissions: PermissionRole[] = workspacePermissions?.length ? workspacePermissions : ["dispatcher"];

  return (
    <main className="min-h-screen bg-[#f4f2fb] text-[#201c27]">
      <div className="grid min-h-screen lg:grid-cols-[15rem_1fr]">
        <WorkspaceViewSidebar activePermission="dispatcher" workspacePermissions={activeWorkspacePermissions} />
        <div className="relative min-h-screen overflow-hidden bg-white/65">
          <div className="grid min-h-screen lg:grid-cols-[18rem_1fr] xl:grid-cols-[18rem_1.15fr_1.45fr]">
            <DashboardSidebar items={sidebarItems} />
            <TrackingPanel selectedVehicleId={selectedShipment?.id} shipments={shipments} />
            {selectedShipment ? <DetailPanel shipment={selectedShipment} /> : <EmptyTrackingDetail content={content.emptyDetail} />}
          </div>
          <div className="fixed bottom-4 left-4 z-40 flex flex-wrap justify-end gap-2">
            <div className="rounded-full border border-[#ece8f1] bg-white/90 p-1 shadow-[0_12px_28px_rgba(69,48,107,0.14)] backdrop-blur">
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
