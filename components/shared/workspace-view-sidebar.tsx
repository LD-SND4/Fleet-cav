"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarSide, faClipboardList, faEye, faRoute, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

import { useLanguage } from "@/components/language-provider";
import { AccountProfileModal } from "@/components/shared/account-profile-modal";
import { isPermissionDisabled, permissionRoles, permissionRoutes, type PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

const roleIcons = {
  admin: faShieldHalved,
  dispatcher: faClipboardList,
  driver: faCarSide,
  viewer: faEye,
} satisfies Record<PermissionRole, typeof faRoute>;

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
  const activePermissions = workspacePermissions.length ? workspacePermissions : [activePermission];

  return (
    <aside
      className={[
        "border-b border-[#ece8f1] bg-[#fbfafc] px-4 py-5 lg:min-h-screen lg:border-b-0 lg:border-r",
        className,
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3 lg:block lg:space-y-4">
        <AccountProfileModal workspacePermissions={activePermissions} />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a8393]">
            {switcherContent.title}
          </p>
          <p className="mt-1 text-lg font-semibold text-[#2c2933]">{roleContent[activePermission]}</p>
        </div>
      </div>

      <nav aria-label={switcherContent.title} className="mt-5 grid gap-2">
        {permissionRoles.map((permission) => {
          const canOpen = activePermissions.includes(permission);
          const disabled = isPermissionDisabled(permission);
          const active = permission === activePermission;
          const label = disabled ? `${roleContent[permission]} (Disabled)` : roleContent[permission];

          if (!canOpen || disabled) {
            return (
              <div
                aria-disabled="true"
                className="flex min-h-14 cursor-not-allowed items-center justify-between gap-3 rounded-lg border border-[#e5e1eb] bg-[#f3f1f6] px-3 py-2 text-sm font-semibold text-[#8a8393]"
                key={permission}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <FontAwesomeIcon aria-hidden="true" className="h-4 w-4 flex-none" icon={roleIcons[permission]} />
                  <span className="truncate">{label}</span>
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
              <span className="flex min-w-0 items-center gap-3">
                <FontAwesomeIcon aria-hidden="true" className="h-4 w-4 flex-none" icon={roleIcons[permission]} />
                <span className="truncate">{label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
