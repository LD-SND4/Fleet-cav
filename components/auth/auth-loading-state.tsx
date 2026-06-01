export function AuthLoadingState({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-sm font-semibold text-[#394150] shadow-[0_12px_28px_rgba(69,48,107,0.06)]"
      role="status"
    >
      <span className="h-4 w-4 flex-none animate-spin rounded-full border-2 border-[#f0b4c0] border-t-[#ef667c]" />
      <span>{label}</span>
    </div>
  );
}
