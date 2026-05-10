"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageKey, useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

type RoleKey = "admin_user" | "dispatcher_user" | "driver_user" | "viewer_user";

type RoleOption = {
  key: RoleKey;
  href: string;
  passwordRequired: boolean;
};

const roleOptions: RoleOption[] = [
  {
    key: "admin_user",
    href: "/admin",
    passwordRequired: true,
  },
  {
    key: "dispatcher_user",
    href: "/dispatcher",
    passwordRequired: true,
  },
  {
    key: "driver_user",
    href: "/driver",
    passwordRequired: true,
  },
  {
    key: "viewer_user",
    href: "/viewer",
    passwordRequired: false,
  },
];

export function RoleLoginScreen() {
  const router = useRouter();
  const { languageKey, setLanguageKey } = useLanguage();
  const [selectedRoleKey, setSelectedRoleKey] = useState<RoleKey | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const content = languages[languageKey].roleLogin;
  const selectedRole = roleOptions.find((role) => role.key === selectedRoleKey);
  const selectedRoleText = selectedRole ? content.roles[selectedRole.key] : null;
  const requiresPassword = Boolean(selectedRole?.passwordRequired);

  function formatMessage(message: string, values: Record<string, string>) {
    return Object.entries(values).reduce(
      (currentMessage, [key, value]) => currentMessage.replace(`{${key}}`, value),
      message,
    );
  }

  function handleRoleSelect(role: RoleOption) {
    setSelectedRoleKey(role.key);
    setError("");

    if (!role.passwordRequired) {
      setPassword("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRole) {
      setError(content.errors.selectUserType);
      return;
    }

    if (selectedRole.passwordRequired && !password.trim()) {
      setError(formatMessage(content.errors.enterPassword, { role: selectedRoleText?.label.toLowerCase() ?? "" }));
      return;
    }

    setSubmitting(true);
    const response = await fetch("/auth/session", {
      body: JSON.stringify({ role: selectedRole.key }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) {
      setError(content.errors.sessionFailed);
      setSubmitting(false);
      return;
    }

    router.push(selectedRole.href);
  }

  return (
    <main className="min-h-screen bg-[#787781] px-5 py-6 text-[#201c27] sm:px-8 lg:px-10">
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-lg border border-white/35 bg-white/70 shadow-[0_40px_120px_rgba(33,24,46,0.22)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex flex-col justify-between gap-10 bg-[#fbfafc] px-7 py-8 sm:px-10 lg:px-12">
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
                FC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8a8393]">{content.brand}</p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#2c2933]">
                  {content.title}
                </h1>
              </div>
            </div>

            <p className="mt-8 max-w-xl text-lg leading-8 text-[#6f6878]">
              {content.intro}
            </p>
          </div>

          <form
            className="space-y-5 rounded-lg border border-[#ece8f1] bg-white p-5 shadow-[0_16px_36px_rgba(69,48,107,0.06)]"
            onSubmit={handleSubmit}
          >
            <div>
              <p className="text-sm font-semibold uppercase text-[#6d7685]">{content.currentSelection}</p>
              <div className="mt-2 rounded-lg bg-[#f8f7fb] px-4 py-3">
                <p className="font-semibold text-[#2c2933]">{selectedRoleText?.label ?? content.noUserTypeSelected}</p>
                <p className="mt-1 text-sm text-[#8a8393]">
                  {selectedRole
                    ? selectedRole.passwordRequired
                      ? content.passwordRequired
                      : content.viewerNoPassword
                    : content.pickRolePrompt}
                </p>
              </div>
            </div>

            {requiresPassword ? (
              <div>
                <label className="text-sm font-semibold uppercase text-[#6d7685]" htmlFor="password">
                  {content.password}
                </label>
                <input
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-[#f8f7fb] px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c] focus:bg-white"
                  id="password"
                  name="password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder={formatMessage(content.passwordPlaceholder, {
                    role: selectedRoleText?.label.toLowerCase() ?? "",
                  })}
                  type="password"
                  value={password}
                />
              </div>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-[#f0b4c0] bg-[#fffafb] px-4 py-3 text-sm font-semibold text-[#d9546d]">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-lg bg-[#ef667c] px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(239,102,124,0.26)] transition hover:bg-[#e75970] disabled:cursor-not-allowed disabled:bg-[#d7dce4] disabled:shadow-none"
              disabled={submitting}
              type="submit"
            >
              {submitting
                ? content.openingView
                : selectedRoleText
                  ? formatMessage(content.continueAs, { role: selectedRoleText.label })
                  : content.selectUserType}
            </button>
          </form>
        </section>

        <section className="space-y-6 bg-[#f4f2fb] px-7 py-8 sm:px-10 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase text-[#8a8393]">{content.userType}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#2c2933]">
                {content.chooseDashboard}
              </h2>
            </div>
            <span className="rounded-full bg-[#eef9f1] px-4 py-2 text-sm font-semibold text-[#41a85f]">
              {content.routeBasedPoc}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {roleOptions.map((role) => {
              const selected = role.key === selectedRoleKey;
              const roleText = content.roles[role.key];

              return (
                <button
                  aria-pressed={selected}
                  className={[
                    "group flex min-h-56 flex-col justify-between rounded-lg border bg-white p-5 text-left shadow-[0_16px_36px_rgba(69,48,107,0.06)] transition hover:-translate-y-0.5 hover:border-[#ef667c] hover:shadow-[0_22px_44px_rgba(239,102,124,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef667c]",
                    selected ? "border-[#ef667c] shadow-[0_22px_44px_rgba(239,102,124,0.16)]" : "border-[#ece8f1]",
                  ].join(" ")}
                  key={role.key}
                  onClick={() => handleRoleSelect(role)}
                  type="button"
                >
                  <span>
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-2xl font-semibold text-[#2c2933]">{roleText.label}</span>
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-sm font-semibold",
                          role.passwordRequired ? "bg-[#fff2f5] text-[#d9546d]" : "bg-[#eef9f1] text-[#41a85f]",
                        ].join(" ")}
                      >
                        {roleText.metric}
                      </span>
                    </span>
                    <span className="mt-5 block text-base leading-7 text-[#6f6878]">{roleText.description}</span>
                  </span>
                  <span
                    className={[
                      "mt-8 inline-flex w-fit rounded-lg px-4 py-3 text-sm font-semibold transition",
                      selected
                        ? "bg-[#ef667c] text-white"
                        : "bg-[#fff2f5] text-[#d9546d] group-hover:bg-[#ef667c] group-hover:text-white",
                    ].join(" ")}
                  >
                    {selected ? content.selected : content.selectRole}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="absolute bottom-4 right-4 rounded-full border border-[#ece8f1] bg-white/90 p-1 shadow-[0_12px_28px_rgba(69,48,107,0.14)] backdrop-blur">
          {(["es", "en"] as LanguageKey[]).map((key) => (
            <button
              aria-pressed={languageKey === key}
              className={[
                "rounded-full px-3 py-2 text-xs font-semibold uppercase transition",
                languageKey === key ? "bg-[#ef667c] text-white" : "text-[#6f6878] hover:bg-[#fff2f5] hover:text-[#d9546d]",
              ].join(" ")}
              key={key}
              onClick={() => {
                setLanguageKey(key);
                setError("");
              }}
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
