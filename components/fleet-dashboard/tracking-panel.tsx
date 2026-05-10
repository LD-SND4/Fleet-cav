import Link from "next/link";

import { partnerFilters, shipmentCards, statusFilters, toVehicleSlug } from "./data";
import type { FilterChip, ShipmentCard } from "./types";

function ChipGroup({ title, items }: { title: string; items: FilterChip[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium text-[#726c7d]">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-2 rounded-lg border border-[#ef667c] bg-white/80 px-4 py-2 text-sm font-medium text-[#d9546d]"
          >
            {item.label}
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
}: {
  card: ShipmentCard;
  selected: boolean;
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
          {card.status}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-[1fr_1.2fr] gap-4 rounded-2xl bg-[#f6f4fb] p-4">
        <div className="space-y-3">
          <p className="text-2xl font-semibold text-[#312d39]">{card.eta}</p>
          <p className="text-base text-[#8c8696]">{card.timeLeft}</p>
        </div>
        <div className="flex items-center justify-end border-l border-[#ddd8e6] pl-4">
          <span className="rounded-lg bg-[#fff2f5] px-4 py-3 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
            Open route
          </span>
        </div>
      </div>

      <VehicleIllustration type={card.vehicleType} />
    </Link>
  );
}

export function TrackingPanel({ selectedVehicleId }: { selectedVehicleId?: string }) {
  return (
    <section className="space-y-8 bg-[#f4f2fb] px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-[#2c2933]">Tracking</h1>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-[#7d7589] shadow-[0_12px_28px_rgba(69,48,107,0.08)]">
          Search
        </div>
      </div>

      <ChipGroup title="Filter by Partners" items={partnerFilters} />
      <ChipGroup title="Show" items={statusFilters} />

      <div className="grid gap-5 xl:grid-cols-2">
        {shipmentCards.map((card) => (
          <ShipmentCardView
            key={card.id}
            card={card}
            selected={selectedVehicleId ? card.id === selectedVehicleId : Boolean(card.active)}
          />
        ))}
      </div>
    </section>
  );
}
