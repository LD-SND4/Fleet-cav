"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

type RequestModuleKey = keyof typeof languages.en.roleDashboard.dispatcherRequests.modules;

type RequestModule = {
  key: RequestModuleKey;
  href: string;
};

const requestModules: RequestModule[] = [
  { key: "trucks", href: "/dispatcher/requests/trucks" },
  { key: "cargos", href: "/dispatcher/requests/cargos" },
  { key: "repair", href: "/dispatcher/requests/repair" },
  { key: "drivers", href: "/dispatcher/requests/drivers" },
  { key: "reports", href: "/dispatcher/requests/reports" },
];

function formatMessage(message: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (currentMessage, [key, value]) => currentMessage.replace(`{${key}}`, value),
    message,
  );
}

export function DispatcherRequestsOverview() {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard.dispatcherRequests;

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{content.title}</h2>
        <p className="mt-3 max-w-3xl text-[#6d7685]">
          {content.intro}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requestModules.map((requestModule) => {
          const moduleContent = content.modules[requestModule.key];

          return (
            <Link
              className="group rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-[0_12px_32px_rgba(32,35,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_18px_44px_rgba(239,102,124,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]"
              href={requestModule.href}
              key={requestModule.key}
            >
              <span className="text-sm font-semibold uppercase text-[#6d7685]">{moduleContent.status}</span>
              <span className="mt-3 block text-3xl font-semibold text-[#20232a]">{moduleContent.label}</span>
              <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
                {moduleContent.action}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function DispatcherRequestModule({ moduleKey }: { moduleKey: string }) {
  const { languageKey } = useLanguage();
  const content = languages[languageKey].roleDashboard.dispatcherRequests;
  const requestModule = requestModules.find((item) => item.key === moduleKey) ?? requestModules[0];
  const moduleContent = content.modules[requestModule.key];

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-[0_12px_32px_rgba(32,35,42,0.04)]">
        <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.moduleEyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#20232a]">{moduleContent.label}</h2>
        <p className="mt-3 max-w-3xl text-[#6d7685]">
          {formatMessage(content.moduleIntro, { module: moduleContent.label.toLowerCase() })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-[#dfe3ea] bg-white p-5">
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.status}</p>
          <p className="mt-3 text-3xl font-semibold text-[#20232a]">{moduleContent.status}</p>
        </article>
        <article className="rounded-lg border border-[#dfe3ea] bg-white p-5">
          <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.access}</p>
          <p className="mt-3 text-3xl font-semibold text-[#20232a]">{content.accessValue}</p>
        </article>
        <Link
          className="group rounded-lg border border-[#dfe3ea] bg-white p-5 transition hover:border-[#ef667c]"
          href="/dispatcher/requests"
        >
          <span className="text-sm font-semibold uppercase text-[#6d7685]">{content.back}</span>
          <span className="mt-3 block text-3xl font-semibold text-[#20232a]">{content.allModules}</span>
          <span className="mt-6 inline-flex rounded-lg bg-[#fff2f5] px-3 py-2 text-sm font-semibold text-[#d9546d] transition group-hover:bg-[#ef667c] group-hover:text-white">
            {content.return}
          </span>
        </Link>
      </div>
    </section>
  );
}
