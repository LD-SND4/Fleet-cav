import type { PermissionRole } from "@/lib/auth/permissions";
import { isPermissionDisabled, permissionRoles } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

type PermissionContent = typeof languages.en.appLogin.permissions;

export function WorkspaceAccessPanel({
  content,
  disabled,
  onOpen,
  onRequest,
  openingPermission,
  pendingRequestPermission,
  requestedAccess,
  sessionPermissions,
}: {
  content: PermissionContent;
  disabled: boolean;
  onOpen: (permission: PermissionRole) => void;
  onRequest: (permission: PermissionRole) => void;
  openingPermission: PermissionRole | null;
  pendingRequestPermission: PermissionRole | null;
  requestedAccess: PermissionRole[];
  sessionPermissions: PermissionRole[];
}) {
  return (
    <section
      aria-live="polite"
      className="space-y-4 rounded-lg border border-[#ece8f1] bg-white/90 p-4 shadow-[0_18px_42px_rgba(69,48,107,0.08)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase text-[#8a8393]">{content.workspaceTitle}</p>
        <p className="mt-1 text-sm leading-6 text-[#6f6878]">{content.workspaceIntro}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {permissionRoles.map((permission) => {
          const roleContent = content.roles[permission];
          const permissionDisabled = isPermissionDisabled(permission);
          const canOpen = sessionPermissions.includes(permission) && !permissionDisabled;
          const requestSent = requestedAccess.includes(permission);
          const busy = openingPermission === permission || pendingRequestPermission === permission;
          const label = permissionDisabled ? `${roleContent.label} (Disabled)` : roleContent.label;

          return (
            <article
              className={[
                "relative min-h-44 overflow-hidden rounded-lg border p-4 transition",
                canOpen
                  ? "border-[#bce5c8] bg-[#fbfffc] shadow-[0_12px_28px_rgba(45,143,77,0.10)]"
                  : "border-[#dfe3ea] bg-[#f8f7fa] opacity-80 shadow-inner grayscale-[20%]",
              ].join(" ")}
              key={permission}
            >
              {!canOpen ? <div className="pointer-events-none absolute inset-0 bg-white/35 backdrop-blur-[1px]" /> : null}
              <div className="relative flex h-full flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#2c2933]">{label}</h3>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase",
                        canOpen ? "bg-[#edf9f0] text-[#2d8f4d]" : "bg-[#edf4f7] text-[#58707a]",
                      ].join(" ")}
                    >
                      {canOpen ? content.available : content.locked}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#6f6878]">{roleContent.description}</p>
                  {!canOpen ? (
                    <p className="mt-3 rounded-lg border border-[#e6e0eb] bg-white/80 px-3 py-2 text-xs font-semibold text-[#6f6878]">
                      {permissionDisabled ? "This view is disabled until live tracking is available." : content.notGranted}
                    </p>
                  ) : null}
                </div>

                {canOpen ? (
                  <button
                    className="rounded-lg bg-[#2d8f4d] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(45,143,77,0.18)] transition hover:bg-[#257b42] disabled:cursor-wait disabled:bg-[#9bcbaa] disabled:shadow-none"
                    disabled={disabled || busy}
                    onClick={() => onOpen(permission)}
                    type="button"
                  >
                    {content.openView.replace("{role}", roleContent.label)}
                  </button>
                ) : (
                  <button
                    className="rounded-lg border border-[#f0b4c0] bg-[#fffafb] px-4 py-3 text-sm font-semibold text-[#d9546d] shadow-[0_12px_26px_rgba(217,84,109,0.10)] transition hover:border-[#ef667c] hover:bg-[#fff2f5] disabled:cursor-not-allowed disabled:border-[#dfe3ea] disabled:bg-[#eef1f5] disabled:text-[#7a8490] disabled:shadow-none"
                    disabled={disabled || busy || requestSent || permissionDisabled}
                    onClick={() => onRequest(permission)}
                    type="button"
                  >
                    {permissionDisabled
                      ? "Disabled"
                      : pendingRequestPermission === permission
                      ? content.requesting
                      : requestSent
                        ? content.requested
                        : content.request}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
