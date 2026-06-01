"use client";

import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { permissionRoles, permissionRoutes, type PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

export function WorkspacePermissionNav({
  activePermission,
  workspacePermissions,
  variant = "header",
}: {
  activePermission: PermissionRole;
  workspacePermissions: PermissionRole[];
  variant?: "floating" | "header";
}) {
  const { languageKey } = useLanguage();
  const roleContent = languages[languageKey].roleDashboard.roles;
  const loginContent = languages[languageKey].appLogin;
  const accessContent = loginContent.permissions;
  const activePermissions = workspacePermissions.length ? workspacePermissions : [activePermission];
  const [requestingPermission, setRequestingPermission] = useState<PermissionRole | null>(null);
  const [requestedPermissions, setRequestedPermissions] = useState<PermissionRole[]>([]);
  const [message, setMessage] = useState("");

  async function handleRequestPermission(permission: PermissionRole) {
    setMessage("");
    setRequestingPermission(permission);

    try {
      const response = await fetch("/auth/permission-request", {
        body: JSON.stringify({ permission }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setMessage(loginContent.errors.requestFailed);
        return;
      }

      setRequestedPermissions((currentPermissions) => (
        currentPermissions.includes(permission) ? currentPermissions : [...currentPermissions, permission]
      ));
      setMessage(accessContent.requestSent.replace("{role}", roleContent[permission]));
    } catch {
      setMessage(loginContent.errors.requestFailed);
    } finally {
      setRequestingPermission(null);
    }
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {permissionRoles.map((permission) => {
        const hasPermission = activePermissions.includes(permission);
        const requested = requestedPermissions.includes(permission);
        const requesting = requestingPermission === permission;

        if (hasPermission) {
          return (
            <Link
              aria-current={permission === activePermission ? "page" : undefined}
              className={getLinkClassName({ active: permission === activePermission, variant })}
              href={permissionRoutes[permission]}
              key={permission}
            >
              {roleContent[permission]}
            </Link>
          );
        }

        return (
          <button
            className={getRequestClassName(variant)}
            disabled={requesting || requested}
            key={permission}
            onClick={() => handleRequestPermission(permission)}
            type="button"
          >
            {requesting
              ? accessContent.requesting
              : requested
                ? `${roleContent[permission]} ${accessContent.requested}`
                : `${accessContent.request}: ${roleContent[permission]}`}
          </button>
        );
      })}
      {message ? (
        <span
          aria-live="polite"
          className={[
            "rounded-full border border-[#bce5c8] bg-[#f6fff8] px-3 py-2 text-xs font-semibold text-[#2d8f4d]",
            variant === "header" ? "basis-full text-right" : "",
          ].join(" ")}
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

function getLinkClassName({ active, variant }: { active: boolean; variant: "floating" | "header" }) {
  const shape = variant === "floating" ? "rounded-full" : "rounded-lg";

  return [
    shape,
    "border px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(69,48,107,0.05)] transition",
    active
      ? "border-[#ef667c] bg-[#ef667c] text-white"
      : "border-[#dfe3ea] bg-white text-[#394150] hover:border-[#ef667c] hover:text-[#d9546d]",
  ].join(" ");
}

function getRequestClassName(variant: "floating" | "header") {
  const shape = variant === "floating" ? "rounded-full" : "rounded-lg";

  return [
    shape,
    "border border-[#dfe3ea] bg-[#f8f7fa] px-4 py-2 text-sm font-semibold text-[#6f6878] opacity-80 shadow-inner transition hover:border-[#ef667c] hover:bg-[#fffafb] hover:text-[#d9546d] disabled:cursor-not-allowed disabled:border-[#ece8f1] disabled:bg-[#eef1f5] disabled:text-[#7a8490]",
  ].join(" ");
}
