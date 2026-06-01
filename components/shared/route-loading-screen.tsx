export function RouteLoadingScreen({
  message = "Validating access and loading fleet data.",
  title = "Preparing workspace",
}: {
  message?: string;
  title?: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f2fb] px-6 text-[#201c27]">
      <section
        aria-live="polite"
        className="w-full max-w-md rounded-lg border border-[#ece8f1] bg-white p-6 shadow-[0_22px_55px_rgba(69,48,107,0.12)]"
        role="status"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff2f5]">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#f0b4c0] border-t-[#ef667c]" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a8393]">Fleet-cav</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2c2933]">{title}</h1>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-[#6f6878]">{message}</p>
        <div className="mt-6 space-y-3">
          <span className="block h-3 w-full animate-pulse rounded-full bg-[#ece8f1]" />
          <span className="block h-3 w-4/5 animate-pulse rounded-full bg-[#dfe3ea]" />
          <span className="block h-3 w-2/3 animate-pulse rounded-full bg-[#ece8f1]" />
        </div>
      </section>
    </main>
  );
}
