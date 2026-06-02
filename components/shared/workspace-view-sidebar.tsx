"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { permissionRoles, permissionRoutes, type PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

export function WorkspaceViewSidebar({
  activePermission,
  className = "",
  workspacePermissions,
}: {
  activePermission: PermissionRole;
  className?: string;
  workspacePermissions: PermissionRole[];
}) {
  const { languageKey } = useLanguage();
  const roleContent = languages[languageKey].roleDashboard.roles;
  const switcherContent = languages[languageKey].roleDashboard.viewSwitcher;
  const permissionContent = languages[languageKey].appLogin.permissions;
  const activePermissions = workspacePermissions.length ? workspacePermissions : [activePermission];

  return (
    <aside
      className={[
        "border-b border-[#ece8f1] bg-[#fbfafc] px-4 py-5 lg:min-h-screen lg:border-b-0 lg:border-r",
        className,
      ].join(" ")}
    >
      <div className="flex items-center gap-3 lg:block lg:space-y-4">
        <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
          FC
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a8393]">
            {switcherContent.title}
          </p>
          <p className="mt-1 text-lg font-semibold text-[#2c2933]">{roleContent[activePermission]}</p>
        </div>
      </div>

      <nav aria-label={permissionContent.workspaceTitle} className="mt-5 grid gap-2">
        {permissionRoles.map((permission) => {
          const canOpen = activePermissions.includes(permission);
          const active = permission === activePermission;

          if (!canOpen) {
            return (
              <div
                aria-disabled="true"
                className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-[#e5e1eb] bg-[#f3f1f6] px-3 py-2 text-sm font-semibold text-[#8a8393]"
                key={permission}
              >
                <span>{roleContent[permission]}</span>
                <span className="rounded-full bg-white px-2 py-1 text-[0.68rem] uppercase text-[#8a8393]">
                  {permissionContent.locked}
                </span>
              </div>
            );
          }

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={[
                "flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef667c]",
                active
                  ? "border-[#ef667c] bg-[#ef667c] text-white shadow-[0_14px_32px_rgba(239,102,124,0.24)]"
                  : "border-[#dfe3ea] bg-white text-[#394150] hover:border-[#ef667c] hover:text-[#d9546d]",
              ].join(" ")}
              href={permissionRoutes[permission]}
              key={permission}
            >
              <span>{roleContent[permission]}</span>
              <span
                className={[
                  "rounded-full px-2 py-1 text-[0.68rem] uppercase",
                  active ? "bg-white/20 text-white" : "bg-[#edf9f0] text-[#2d8f4d]",
                ].join(" ")}
              >
                {active ? permissionContent.selected : permissionContent.available}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
