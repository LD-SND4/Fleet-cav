import type { ShipmentCard } from "./types";

function RouteMapPlaceholder() {
  return (
    <div className="relative h-[23rem] overflow-hidden rounded-lg border border-[#ece8f1] bg-[#f3f1f6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:14rem_14rem,2.8rem_2.8rem,2.8rem_2.8rem] opacity-90" />
      <div className="absolute left-[16%] top-[76%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
      <div className="absolute left-[40%] top-[63%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
      <div className="absolute left-[58%] top-[49%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
      <div className="absolute left-[71%] top-[30%] h-4 w-4 rounded-full border-4 border-white bg-[#ef667c] shadow-[0_0_0_10px_rgba(239,102,124,0.18)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M18 82 C28 70, 32 73, 41 63 S58 48, 71 31" fill="none" stroke="#ef667c" strokeWidth="0.7" />
      </svg>
      <div className="absolute right-5 top-5 space-y-3">
        {["Zoom", "Pin", "Truck"].map((action) => (
          <div
            key={action}
            className="grid h-11 w-11 place-items-center rounded-lg border border-[#f2ced5] bg-white text-xs font-semibold text-[#d9546d] shadow-[0_10px_24px_rgba(69,48,107,0.08)]"
          >
            {action}
          </div>
        ))}
      </div>
      <div className="absolute bottom-5 right-5 space-y-3">
        {["+", "-"].map((symbol) => (
          <div
            key={symbol}
            className="grid h-11 w-11 place-items-center rounded-lg border border-[#f2ced5] bg-white text-2xl leading-none text-[#d9546d] shadow-[0_10px_24px_rgba(69,48,107,0.08)]"
          >
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPanel({ shipment }: { shipment: ShipmentCard }) {
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
            {shipment.status}
          </span>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
            Call Driver
          </button>
          <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)]">
            Chat with Driver
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-[#2c2933]">Selected Route Component</h3>
        <div className="overflow-hidden rounded-lg border border-[#ece8f1] bg-white shadow-[0_16px_36px_rgba(69,48,107,0.06)]">
          <div className="relative h-52 bg-[#f2eff6]">
            <div className="absolute inset-y-0 left-[24%] right-[10%] rounded-lg bg-[repeating-linear-gradient(135deg,#ef667c_0,#ef667c_28px,#ee6277_28px,#ee6277_56px)] opacity-90" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="rounded-lg bg-white/90 px-5 py-3 text-lg font-semibold text-[#d9546d]">
                Ready for action
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 px-5 py-5">
            <button className="rounded-lg bg-[#ef667c] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,102,124,0.22)]">
              Open route
            </button>
            <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
              Assign action
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-[#2c2933]">Route</h3>
          <button className="rounded-lg border border-[#f0b4c0] px-5 py-3 text-sm font-semibold text-[#d9546d]">
            Change Route
          </button>
        </div>
        <RouteMapPlaceholder />
      </section>
    </section>
  );
}
