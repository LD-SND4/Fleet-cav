"use client";

import Link from "next/link";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { isPermissionDisabled, permissionRoles, permissionRoutes, type PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

export function WorkspacePermissionNav({
  activePermission,
  showGrantedLinks = true,
  workspacePermissions,
  variant = "header",
}: {
  activePermission: PermissionRole;
  showGrantedLinks?: boolean;
  workspacePermissions: PermissionRole[];
  variant?: "floating" | "header";
}) {
  const { languageKey } = useLanguage();
  const roleContent = languages[languageKey].roleDashboard.roles;
  const loginContent = languages[languageKey].appLogin;
  const accessContent = loginContent.permissions;
  const activePermissions = workspacePermissions.length ? workspacePermissions : [activePermission];
  const canRequestMoreAccess = activePermissions.length <= 1;
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

  const permissionActions = permissionRoles.map((permission) => {
    const disabled = isPermissionDisabled(permission);
    const hasPermission = activePermissions.includes(permission);
    const requested = requestedPermissions.includes(permission);
    const requesting = requestingPermission === permission;
    const label = disabled ? `${roleContent[permission]} (Disabled)` : roleContent[permission];

    if (hasPermission) {
      if (disabled) {
        return (
          <span aria-disabled="true" className={getDisabledClassName(variant)} key={permission}>
            {label}
          </span>
        );
      }

      if (!showGrantedLinks) {
        return null;
      }

      return (
        <Link
          aria-current={permission === activePermission ? "page" : undefined}
          className={getLinkClassName({ active: permission === activePermission, variant })}
          href={permissionRoutes[permission]}
          key={permission}
        >
          {label}
        </Link>
      );
    }

    if (!canRequestMoreAccess && !disabled) {
      return null;
    }

    return (
      <button
        className={getRequestClassName(variant)}
        disabled={requesting || requested || disabled}
        key={permission}
        onClick={() => handleRequestPermission(permission)}
        type="button"
      >
        {disabled
          ? label
          : requesting
          ? accessContent.requesting
          : requested
            ? `${label} ${accessContent.requested}`
            : `${accessContent.request}: ${label}`}
      </button>
    );
  });

  if (!permissionActions.some(Boolean) && !message) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {permissionActions}
      {message ? (
        <aside
          aria-live="polite"
          className="fixed bottom-4 right-4 z-40 max-w-sm rounded-lg border border-[#bce5c8] bg-[#f6fff8] px-4 py-3 text-sm font-semibold text-[#2d8f4d] shadow-[0_18px_42px_rgba(45,143,77,0.18)]"
        >
          {message}
        </aside>
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

function getDisabledClassName(variant: "floating" | "header") {
  const shape = variant === "floating" ? "rounded-full" : "rounded-lg";

  return [
    shape,
    "border border-[#ece8f1] bg-[#eef1f5] px-4 py-2 text-sm font-semibold text-[#7a8490] shadow-inner",
  ].join(" ");
}
