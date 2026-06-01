"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageKey, useLanguage } from "@/components/language-provider";
import { WorkspacePermissionNav } from "@/components/shared/workspace-permission-nav";
import type { PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

type RoleKey = PermissionRole;
type RoleDescriptionKey = keyof typeof languages.en.roleDashboard.descriptions;
type RoleNavKey = keyof typeof languages.en.roleDashboard.nav;

type RoleNavItem = {
  labelKey: RoleNavKey;
  href: string;
};

export function RoleLayoutShell({
  roleKey,
  descriptionKey,
  navItems,
  workspacePermissions,
  children,
}: {
  roleKey: RoleKey;
  descriptionKey: RoleDescriptionKey;
  navItems: RoleNavItem[];
  workspacePermissions?: PermissionRole[];
  children: ReactNode;
}) {
  const { languageKey, setLanguageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard;
  const activeWorkspacePermissions = workspacePermissions?.length ? workspacePermissions : [roleKey];
  const shellNavItems = navItems.some((item) => item.href === "/login")
    ? navItems
    : [...navItems, { labelKey: "switchUser" as const, href: "/login" }];

  return (
    <main className="min-h-screen bg-[#f4f2fb] text-[#201c27]">
      <div className="relative min-h-screen overflow-hidden bg-white/70">
        <header className="border-b border-[#ece8f1] bg-[#fbfafc]">
          <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7 sm:px-10">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
                FC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a8393]">{content.roles[roleKey]}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2c2933]">
                  {content.descriptions[descriptionKey]}
                </h1>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              <WorkspacePermissionNav activePermission={roleKey} workspacePermissions={activeWorkspacePermissions} />
              {shellNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-lg border px-4 py-2 text-sm font-semibold shadow-[0_10px_24px_rgba(69,48,107,0.05)] transition",
                    item.href === "/login"
                      ? "border-[#f0b4c0] bg-[#fff2f5] text-[#d9546d] hover:border-[#ef667c] hover:bg-[#ef667c] hover:text-white"
                      : "border-[#ece8f1] bg-white text-[#394150] hover:border-[#ef667c] hover:text-[#d9546d]",
                  ].join(" ")}
                >
                  {content.nav[item.labelKey]}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div className="min-h-[calc(100vh-7rem)] bg-[#f4f2fb] px-5 py-6 sm:px-8 lg:px-10">{children}</div>
        <div className="absolute bottom-4 right-4 rounded-full border border-[#ece8f1] bg-white/90 p-1 shadow-[0_12px_28px_rgba(69,48,107,0.14)] backdrop-blur">
          {(["es", "en"] as LanguageKey[]).map((key) => (
            <button
              aria-pressed={languageKey === key}
              className={[
                "rounded-full px-3 py-2 text-xs font-semibold uppercase transition",
                languageKey === key ? "bg-[#ef667c] text-white" : "text-[#6f6878] hover:bg-[#fff2f5] hover:text-[#d9546d]",
              ].join(" ")}
              key={key}
              onClick={() => setLanguageKey(key)}
              type="button"
            >
              {key === "es" ? "ESP" : "ENG"}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
