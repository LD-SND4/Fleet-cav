"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageKey, useLanguage } from "@/components/language-provider";
import languages from "@/locales/languages.json";

type AuthMode = "login" | "register";

export function LoginScreen() {
  const router = useRouter();
  const { languageKey, setLanguageKey } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const content = languages[languageKey].appLogin;
  const modeContent = authMode === "login" ? content.login : content.register;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (authMode === "register" && !name.trim()) {
      setError(content.errors.nameRequired);
      return;
    }

    if (!email.trim()) {
      setError(content.errors.emailRequired);
      return;
    }

    if (!password) {
      setError(content.errors.passwordRequired);
      return;
    }

    setSubmitting(true);

    const response = await fetch("/auth/account", {
      body: JSON.stringify({
        email,
        fullName: name,
        mode: authMode,
        password,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const result = (await response.json()) as {
      error?: string;
      needsEmailConfirmation?: boolean;
      redirectTo?: string;
    };

    if (!response.ok) {
      setError(result.error ?? content.errors.authFailed);
      setSubmitting(false);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage(content.confirmEmail);
      setSubmitting(false);
      return;
    }

    if (!result.redirectTo) {
      setError(content.errors.profileRequired);
      setSubmitting(false);
      return;
    }

    router.push(result.redirectTo);
  }

  return (
    <main className="min-h-screen bg-[#f4f2fb] text-[#201c27]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex min-h-[42rem] flex-col bg-[#fbfafc] px-6 py-7 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#29262f] text-sm font-semibold text-white">
                FC
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8a8393]">{content.eyebrow}</p>
                <h1 className="mt-1 text-4xl font-semibold text-[#2c2933]">{content.brand}</h1>
              </div>
            </div>
            <div className="rounded-full border border-[#ece8f1] bg-white/90 p-1 shadow-[0_12px_28px_rgba(69,48,107,0.10)]">
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

          <div className="max-w-2xl py-10">
            <p className="text-sm font-semibold uppercase text-[#ef667c]">{content.status}</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight text-[#2c2933] sm:text-6xl">
              {content.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f6878]">{content.intro}</p>
          </div>
        </section>

        <section className="flex items-center bg-[#f4f2fb] px-6 py-8 sm:px-10 lg:px-12">
          <form className="w-full space-y-6" noValidate onSubmit={handleSubmit}>
            <div>
              <p className="text-sm font-semibold uppercase text-[#8a8393]">{content.formEyebrow}</p>
              <h2 className="mt-2 text-4xl font-semibold text-[#2c2933]">{modeContent.title}</h2>
            </div>

            <div className="inline-flex rounded-lg border border-[#ece8f1] bg-white p-1 shadow-[0_12px_28px_rgba(69,48,107,0.05)]">
              {(["login", "register"] as AuthMode[]).map((mode) => (
                <button
                  aria-pressed={authMode === mode}
                  className={[
                    "rounded-md px-4 py-2 text-sm font-semibold transition",
                    authMode === mode ? "bg-[#ef667c] text-white" : "text-[#6f6878] hover:bg-[#fff2f5] hover:text-[#d9546d]",
                  ].join(" ")}
                  key={mode}
                  onClick={() => setAuthMode(mode)}
                  type="button"
                >
                  {content[mode].tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {authMode === "register" ? (
                <label className="block">
                  <span className="text-sm font-semibold uppercase text-[#6d7685]">{content.fields.name}</span>
                  <input
                    className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c]"
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                      setMessage("");
                    }}
                    placeholder={content.placeholders.name}
                    type="text"
                    value={name}
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-semibold uppercase text-[#6d7685]">{content.fields.email}</span>
                <input
                  autoComplete="email"
                  className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c]"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder={content.placeholders.email}
                  type="email"
                  value={email}
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold uppercase text-[#6d7685]">{content.fields.password}</span>
                <input
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c]"
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder={content.placeholders.password}
                  type="password"
                  value={password}
                />
              </label>
            </div>

            {error ? (
              <p className="rounded-lg border border-[#f0b4c0] bg-[#fffafb] px-4 py-3 text-sm font-semibold text-[#d9546d]">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-lg border border-[#bce5c8] bg-[#f6fff8] px-4 py-3 text-sm font-semibold text-[#2d8f4d]">
                {message}
              </p>
            ) : null}

            <button
              className="w-full rounded-lg bg-[#ef667c] px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(239,102,124,0.26)] transition hover:bg-[#e75970] disabled:cursor-not-allowed disabled:bg-[#d7dce4] disabled:shadow-none"
              disabled={submitting}
              type="submit"
            >
              {submitting ? content.loading : modeContent.action}
            </button>

            <p className="text-sm leading-6 text-[#6f6878]">{content.authNote}</p>
          </form>
        </section>
      </div>
    </main>
  );
}
