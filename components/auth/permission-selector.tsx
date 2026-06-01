import type { PermissionRole } from "@/lib/auth/permissions";
import { permissionRoles } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

type PermissionContent = typeof languages.en.appLogin.permissions;

export function PermissionSelector({
  content,
  disabled,
  onToggle,
  selectedPermissions,
}: {
  content: PermissionContent;
  disabled: boolean;
  onToggle: (permission: PermissionRole) => void;
  selectedPermissions: PermissionRole[];
}) {
  return (
    <fieldset className="space-y-3">
      <div>
        <legend className="text-sm font-semibold uppercase text-[#6d7685]">{content.label}</legend>
        <p className="mt-1 text-sm leading-6 text-[#6f6878]">{content.intro}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {permissionRoles.map((permission) => {
          const selected = selectedPermissions.includes(permission);
          const roleContent = content.roles[permission];

          return (
            <label
              className={[
                "flex min-h-32 cursor-pointer gap-3 rounded-lg border bg-white p-4 shadow-[0_10px_24px_rgba(69,48,107,0.05)] transition",
                selected
                  ? "border-[#ef667c] ring-2 ring-[#ffd5de]"
                  : "border-[#dfe3ea] hover:border-[#ef667c] hover:bg-[#fffafb]",
                disabled ? "cursor-not-allowed opacity-70" : "",
              ].join(" ")}
              key={permission}
            >
              <input
                aria-label={roleContent.label}
                checked={selected}
                className="mt-1 h-4 w-4 flex-none accent-[#ef667c]"
                disabled={disabled}
                onChange={() => onToggle(permission)}
                type="checkbox"
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-[#2c2933]">{roleContent.label}</span>
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase",
                      selected ? "bg-[#fff2f5] text-[#d9546d]" : "bg-[#edf4f7] text-[#58707a]",
                    ].join(" ")}
                  >
                    {selected ? content.selected : content.notSelected}
                  </span>
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#6f6878]">{roleContent.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
