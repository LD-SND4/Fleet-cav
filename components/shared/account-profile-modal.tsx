"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faKey, faTimes, faUserCircle, faUsersGear } from "@fortawesome/free-solid-svg-icons";

import { useLanguage } from "@/components/language-provider";
import { permissionRoles, type PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

type AccountProfile = {
  email: string;
  fullName: string;
  permissions: PermissionRole[];
  role: PermissionRole;
};

export function AccountProfileModal({ workspacePermissions }: { workspacePermissions: PermissionRole[] }) {
  const router = useRouter();
  const { languageKey } = useLanguage();
  const roleLabels = languages[languageKey].roleDashboard.roles;
  const navLabels = languages[languageKey].roleDashboard.nav;
  const isSpanish = languageKey === "es";
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [requestingPermission, setRequestingPermission] = useState<PermissionRole | null>(null);
  const [requestedPermissions, setRequestedPermissions] = useState<PermissionRole[]>([]);

  function handleOpenProfile() {
    setOpen(true);

    if (profile || loading) {
      return;
    }

    setLoading(true);
    fetch("/auth/account")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: AccountProfile) => setProfile(data))
      .catch(() => setMessage(isSpanish ? "No pudimos cargar el perfil." : "We could not load this profile."))
      .finally(() => setLoading(false));
  }

  async function handleResetPassword() {
    setMessage(isSpanish ? "Enviando correo de recuperacion..." : "Sending password reset email...");
    const response = await fetch("/auth/account", { method: "PATCH" });
    setMessage(
      response.ok
        ? isSpanish
          ? "Correo de recuperacion enviado."
          : "Password reset email sent."
        : isSpanish
          ? "No pudimos enviar el correo."
          : "We could not send the reset email.",
    );
  }

  async function handleRequestPermission(permission: PermissionRole) {
    setRequestingPermission(permission);
    setMessage(isSpanish ? "Enviando solicitud..." : "Sending request...");

    try {
      const response = await fetch("/auth/permission-request", {
        body: JSON.stringify({ permission }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        setMessage(isSpanish ? "No pudimos enviar esta solicitud." : "We could not send this request.");
        return;
      }

      setRequestedPermissions((current) => (current.includes(permission) ? current : [...current, permission]));
      setMessage(
        isSpanish
          ? `Solicitud de permiso ${roleLabels[permission]} enviada.`
          : `${roleLabels[permission]} permission request sent.`,
      );
    } catch {
      setMessage(isSpanish ? "No pudimos enviar esta solicitud." : "We could not send this request.");
    } finally {
      setRequestingPermission(null);
    }
  }

  async function handleLogOff() {
    await fetch("/auth/account", { method: "DELETE" });
    router.push("/login");
  }

  const currentPermissions = profile?.permissions.length ? profile.permissions : workspacePermissions;
  const missingPermissions = permissionRoles.filter((permission) => !currentPermissions.includes(permission));

  return (
    <>
      <button
        aria-label={isSpanish ? "Abrir perfil" : "Open profile"}
        className="grid h-11 w-11 place-items-center rounded-full border border-[#ece8f1] bg-white text-[#394150] shadow-[0_10px_24px_rgba(69,48,107,0.06)] transition hover:border-[#ef667c] hover:text-[#d9546d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef667c]"
        onClick={handleOpenProfile}
        type="button"
      >
        <FontAwesomeIcon className="h-6 w-6" icon={faUserCircle} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-[2000] grid place-items-center bg-[#201c27]/30 px-4 py-6 backdrop-blur-sm">
          <section
            aria-labelledby="account-profile-title"
            className="w-full max-w-md rounded-lg border border-[#ece8f1] bg-white p-5 shadow-[0_24px_70px_rgba(32,28,39,0.24)]"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a8393]">
                  {isSpanish ? "Perfil" : "Profile"}
                </p>
                <h2 id="account-profile-title" className="mt-1 text-2xl font-semibold text-[#2c2933]">
                  {profile?.fullName || (isSpanish ? "Usuario actual" : "Current user")}
                </h2>
              </div>
              <button
                aria-label={isSpanish ? "Cerrar perfil" : "Close profile"}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#f8f7fa] text-[#6f6878] transition hover:bg-[#fff2f5] hover:text-[#d9546d]"
                onClick={() => setOpen(false)}
                type="button"
              >
                <FontAwesomeIcon className="h-4 w-4" icon={faTimes} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
                <p className="text-xs font-semibold uppercase text-[#8a8393]">{isSpanish ? "Correo" : "Email"}</p>
                <p className="mt-1 break-words text-sm font-semibold text-[#394150]">
                  {loading ? (isSpanish ? "Cargando..." : "Loading...") : profile?.email || "--"}
                </p>
              </div>
              <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
                <p className="text-xs font-semibold uppercase text-[#8a8393]">{isSpanish ? "Permisos verificados" : "Verified permissions"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentPermissions.map((permission) => (
                    <span className="rounded-full bg-[#edf9f0] px-3 py-1 text-xs font-semibold text-[#2d8f4d]" key={permission}>
                      {roleLabels[permission]}
                    </span>
                  ))}
                </div>
              </div>
              {missingPermissions.length ? (
                <div className="rounded-lg bg-[#f8f7fb] px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-[#8a8393]">{isSpanish ? "Solicitar roles" : "Request roles"}</p>
                  <div className="mt-2 grid gap-2">
                    {missingPermissions.map((permission) => {
                      const requested = requestedPermissions.includes(permission);
                      const requesting = requestingPermission === permission;

                      return (
                        <button
                          className="inline-flex items-center justify-center rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-sm font-semibold text-[#6f6878] transition hover:border-[#ef667c] hover:text-[#d9546d] disabled:cursor-not-allowed disabled:bg-[#eef1f5] disabled:text-[#7a8490]"
                          disabled={requesting || requested}
                          key={permission}
                          onClick={() => handleRequestPermission(permission)}
                          type="button"
                        >
                          {requesting
                            ? isSpanish ? "Enviando..." : "Sending..."
                            : requested
                              ? isSpanish ? `${roleLabels[permission]} solicitado` : `${roleLabels[permission]} requested`
                              : isSpanish ? `Solicitar ${roleLabels[permission]}` : `Request ${roleLabels[permission]}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            {message ? <p className="mt-4 rounded-lg border border-[#ece8f1] bg-[#fbfafc] px-3 py-2 text-sm font-semibold text-[#6f6878]">{message}</p> : null}

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-sm font-semibold text-[#394150] transition hover:border-[#ef667c] hover:text-[#d9546d]" onClick={handleResetPassword} type="button">
                <FontAwesomeIcon className="h-4 w-4" icon={faKey} />
                {isSpanish ? "Restablecer" : "Reset password"}
              </button>
              <Link className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-sm font-semibold text-[#394150] transition hover:border-[#ef667c] hover:text-[#d9546d]" href="/login">
                <FontAwesomeIcon className="h-4 w-4" icon={faUsersGear} />
                {navLabels.switchUser}
              </Link>
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ef667c] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(239,102,124,0.20)] transition hover:bg-[#e75970] sm:col-span-2" onClick={handleLogOff} type="button">
                <FontAwesomeIcon className="h-4 w-4" icon={faArrowRightFromBracket} />
                {isSpanish ? "Cerrar sesion" : "Log off"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
