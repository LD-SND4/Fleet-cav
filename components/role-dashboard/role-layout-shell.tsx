"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageKey, useLanguage } from "@/components/language-provider";

type RoleNavItem = {
  label: string;
  href: string;
};

export function RoleLayoutShell({
  role,
  description,
  navItems,
  children,
}: {
  role: string;
  description: string;
  navItems: RoleNavItem[];
  children: ReactNode;
}) {
  const { languageKey, setLanguageKey } = useLanguage();

  return (
    <main className="min-h-screen bg-[#787781] px-5 py-6 text-[#201c27] sm:px-8 lg:px-10">
      <div className="relative mx-auto min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-lg border border-white/35 bg-white/70 shadow-[0_40px_120px_rgba(33,24,46,0.22)] backdrop-blur">
        <header className="border-b border-[#ece8f1] bg-[#fbfafc]">
          <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7 sm:px-10">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
                FC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8a8393]">{role}</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#2c2933]">{description}</h1>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-[#ece8f1] bg-white px-4 py-2 text-sm font-semibold text-[#394150] shadow-[0_10px_24px_rgba(69,48,107,0.05)] transition hover:border-[#ef667c] hover:text-[#d9546d]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div className="bg-[#f4f2fb] px-7 py-8 sm:px-10">{children}</div>
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
