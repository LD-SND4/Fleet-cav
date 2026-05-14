"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

import type { SidebarItem } from "./types";

type SidebarContent = typeof languages.en.fleetDashboard.sidebar;

const sidebarLabelKeys: Record<string, keyof SidebarContent> = {
  Analysis: "analysis",
  Cargos: "cargos",
  Chats: "chats",
  Dashboard: "dashboard",
  Data: "data",
  Fleets: "fleets",
  Drivers: "drivers",
  History: "history",
  Partners: "partners",
  Repair: "repair",
  Reports: "reports",
  Request: "request",
  Tracking: "tracking",
  Trucks: "trucks",
};

function getSidebarLabel(label: string, content: SidebarContent) {
  const labelKey = sidebarLabelKeys[label];

  return labelKey ? content[labelKey] : label;
}

function SidebarRow({ item, content }: { item: SidebarItem; content: SidebarContent }) {
  const RowContent = (
    <>
      <span>{getSidebarLabel(item.label, content)}</span>
      {item.badge ? (
        <span
          className={[
            "rounded-full px-2 py-0.5 text-xs",
            item.active ? "bg-white/20 text-white" : "bg-[#f7d6dc] text-[#d9546d]",
          ].join(" ")}
        >
          {item.badge}
        </span>
      ) : null}
    </>
  );

  return (
    <div className="space-y-3">
      <Link
        href={item.href ?? "#"}
        className={[
          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium",
          item.active
            ? "bg-[#ef667c] text-white shadow-[0_14px_32px_rgba(239,102,124,0.28)]"
            : "text-[#37353f] hover:bg-white/70",
        ].join(" ")}
      >
        {RowContent}
      </Link>

      {item.children ? (
        <div className="ml-4 space-y-2 border-l border-[#ddd8e6] pl-4">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href ?? "#"}
              className="flex items-center justify-between rounded-md px-2 py-1 text-sm text-[#5f5a66] hover:bg-white/70"
            >
              <span>{getSidebarLabel(child.label, content)}</span>
              {child.badge ? (
                <span className="rounded-full bg-[#f7d6dc] px-2 py-0.5 text-xs text-[#d9546d]">
                  {child.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DashboardSidebar({ items }: { items: SidebarItem[] }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].fleetDashboard.sidebar;

  return (
    <aside className="flex min-h-full flex-col border-r border-[#ece8f1] bg-[#fbfafc]">
      <div className="border-b border-[#ece8f1] px-8 py-9">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
            GD
          </div>
          <div>
            <p className="text-[1.35rem] font-semibold text-[#2a2732]">George Davidson</p>
            <p className="text-sm text-[#8a8393]">george.davidson@email.com</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-3 px-6 py-8">
        {items.map((item) => (
          <SidebarRow content={content} key={item.label} item={item} />
        ))}
      </nav>

      <div className="px-8 py-8">
        <Link
          className="block w-full rounded-lg bg-[#ef667c] px-5 py-4 text-center text-sm font-semibold text-white shadow-[0_16px_40px_rgba(239,102,124,0.26)] transition hover:bg-[#e75970]"
          href="/dispatcher/requests"
        >
          {content.createNewRequest}
        </Link>
      </div>
    </aside>
  );
}
