import Link from "next/link";

type RequestModule = {
  key: string;
  label: string;
  href: string;
  status: string;
  action: string;
};

const requestModules: RequestModule[] = [
  { key: "trucks", label: "Trucks", href: "/dispatcher/requests/trucks", status: "Assign vehicles", action: "Open trucks" },
  { key: "cargos", label: "Cargos", href: "/dispatcher/requests/cargos", status: "Review load", action: "Open cargos" },
  { key: "repair", label: "Repair", href: "/dispatcher/requests/repair", status: "Vehicle service", action: "Open repair" },
  { key: "drivers", label: "Drivers", href: "/dispatcher/requests/drivers", status: "Manage drivers", action: "Open drivers" },
  { key: "reports", label: "Reports", href: "/dispatcher/requests/reports", status: "Export ready", action: "Open reports" },
];

export function DispatcherRequestsOverview() {
  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">Operational modules</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">Create and manage dispatcher requests</h2>
        <p className="mt-3 max-w-3xl text-[#6d7685]">
          This skeleton follows the POC scope from the stack instructions: trucks, cargos, repair, drivers, and reports
          stay grouped under dispatcher operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requestModules.map((requestModule) => (
          <Link
            className="group rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_18px_44px_rgba(239,102,124,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]"
            href={requestModule.href}
            key={requestModule.key}
          >
            <span className="text-sm font-semibold uppercase text-[#6d7685]">{requestModule.status}</span>
            <span className="mt-3 block text-3xl font-semibold text-[#20232a]">{requestModule.label}</span>
            <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
              {requestModule.action}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function DispatcherRequestModule({ moduleKey }: { moduleKey: string }) {
  const requestModule = requestModules.find((item) => item.key === moduleKey) ?? requestModules[0];

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">Dispatcher request</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{requestModule.label}</h2>
        <p className="mt-3 max-w-3xl text-[#6d7685]">
          This is the first route-ready view for the {requestModule.label.toLowerCase()} module. Detailed forms and backend
          actions can plug into this surface after the UI skeleton is approved.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-[#dfe3ea] bg-white p-5">
          <p className="text-sm font-semibold uppercase text-[#6d7685]">Status</p>
          <p className="mt-3 text-3xl font-semibold text-[#20232a]">{requestModule.status}</p>
        </article>
        <article className="rounded-lg border border-[#dfe3ea] bg-white p-5">
          <p className="text-sm font-semibold uppercase text-[#6d7685]">Access</p>
          <p className="mt-3 text-3xl font-semibold text-[#20232a]">Dispatcher</p>
        </article>
        <Link
          className="group rounded-lg border border-[#dfe3ea] bg-white p-5 transition hover:border-[#ef667c]"
          href="/dispatcher/requests"
        >
          <span className="text-sm font-semibold uppercase text-[#6d7685]">Back</span>
          <span className="mt-3 block text-3xl font-semibold text-[#20232a]">All modules</span>
          <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
            Return
          </span>
        </Link>
      </div>
    </section>
  );
}
