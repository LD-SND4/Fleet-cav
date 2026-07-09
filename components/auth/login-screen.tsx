"use client";

import { FormEvent, type PointerEvent, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AuthLoadingState } from "@/components/auth/auth-loading-state";
import { PermissionSelector } from "@/components/auth/permission-selector";
import { LanguageKey, useLanguage } from "@/components/language-provider";
import type { PermissionRole } from "@/lib/auth/permissions";
import languages from "@/locales/languages.json";

type AuthMode = "login" | "register";
type LoadingStage = keyof typeof languages.en.appLogin.loadingStages;

type AccountResponse = {
  error?: string;
  needsEmailConfirmation?: boolean;
  redirectTo?: string | null;
};

type FleetLogEntry = {
  id: string;
  label: string;
  route_name: string;
};

const defaultSelectedPermissions: PermissionRole[] = ["viewer"];
const authModeFadeMs = 700;
const honeycombSize = 15;
const honeycombColSpacing = honeycombSize * 1.5;
const honeycombRowSpacing = honeycombSize * Math.sqrt(3);
const honeycombRippleRadius = 60;
const honeycombBaseColor = "#8a8393";
const honeycombRippleColor = "#ef667c";
const honeycombCells = createHoneycombCells();

export function LoginScreen() {
  const router = useRouter();
  const { languageKey, setLanguageKey } = useLanguage();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [visibleAuthMode, setVisibleAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionRole[]>(defaultSelectedPermissions);
  const [fleetLogEntries, setFleetLogEntries] = useState<FleetLogEntry[] | null>(null);
  const [fleetLogError, setFleetLogError] = useState<string | null>(null);
  const [loadingFleetLog, setLoadingFleetLog] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage | null>(null);
  const [modeTransition, setModeTransition] = useState<"entering" | "exiting" | "idle">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [isRouting, startRouteTransition] = useTransition();
  const modeSwitchTimeouts = useRef<number[]>([]);

  const content = languages[languageKey].appLogin;
  const modeContent = visibleAuthMode === "login" ? content.login : content.register;
  const switchingMode = modeTransition !== "idle";
  const busy = submitting || isRouting || switchingMode;
  const loadingLabel = loadingStage
    ? loadingStage === "opening"
      ? content.loading
      : content.loadingStages[loadingStage]
    : "";

  useEffect(() => {
    return () => {
      modeSwitchTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchFleetLog() {
      setLoadingFleetLog(true);
      setFleetLogError(null);

      try {
        const response = await fetch("/api/fleet-log");

        if (!response.ok) {
          throw new Error(`Failed to load fleet log: ${response.statusText}`);
        }

        const data = (await response.json()) as FleetLogEntry[];

        if (isCancelled) {
          return;
        }

        setFleetLogEntries(data);
        console.groupCollapsed("Fleet DB console: current backend fleet query results");
        console.table(data);
        console.groupEnd();
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setFleetLogError(error instanceof Error ? error.message : String(error));
        console.error("Fleet DB console: failed to load fleet data:", error);
      } finally {
        if (!isCancelled) {
          setLoadingFleetLog(false);
        }
      }
    }

    fetchFleetLog();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (visibleAuthMode === "register" && !selectedPermissions.length) {
      setError(content.errors.permissionRequired);
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
    setLoadingStage("validating");
    await holdLoadingFrame();
    setLoadingStage("authenticating");

    let response: Response;
    let result: AccountResponse;

    try {
      response = await fetch("/auth/account", {
        body: JSON.stringify({
          email,
          mode: visibleAuthMode,
          password,
          requestedPermissions: visibleAuthMode === "register" ? selectedPermissions : undefined,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      result = (await response.json()) as AccountResponse;
    } catch {
      setError(content.errors.authFailed);
      setLoadingStage(null);
      setSubmitting(false);
      return;
    }

    if (!response.ok) {
      setError(result.error ?? content.errors.authFailed);
      setLoadingStage(null);
      setSubmitting(false);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage(content.confirmEmail);
      setLoadingStage(null);
      setSubmitting(false);
      return;
    }

    if (!result.redirectTo) {
      setError(content.errors.profileRequired);
      setLoadingStage(null);
      setSubmitting(false);
      return;
    }

    setLoadingStage("opening");
    startRouteTransition(() => {
      router.push(result.redirectTo as string);
    });
  }

  function handleModeChange(mode: AuthMode) {
    if (mode === authMode || submitting || isRouting || switchingMode) {
      return;
    }

    modeSwitchTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    modeSwitchTimeouts.current = [];
    setAuthMode(mode);
    setError("");
    setMessage("");
    setLoadingStage(null);
    setModeTransition("exiting");

    const swapTimeout = window.setTimeout(() => {
      setVisibleAuthMode(mode);
      setModeTransition("entering");

      const finishTimeout = window.setTimeout(() => {
        setModeTransition("idle");
      }, authModeFadeMs);

      modeSwitchTimeouts.current.push(finishTimeout);
    }, authModeFadeMs);

    modeSwitchTimeouts.current.push(swapTimeout);
  }

  function handleTogglePermission(permission: PermissionRole) {
    setError("");
    setMessage("");
    setSelectedPermissions((currentPermissions) => {
      if (currentPermissions.includes(permission)) {
        return currentPermissions.filter((currentPermission) => currentPermission !== permission);
      }

      return [...currentPermissions, permission];
    });
  }

  return (
    <main className="min-h-screen bg-[#f4f2fb] text-[#201c27]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex min-h-[42rem] flex-col overflow-hidden bg-[#fbfafc] px-6 py-7 sm:px-10 lg:px-12">
          <div className="relative z-20 flex items-center justify-between gap-4">
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
                  disabled={busy}
                  key={key}
                  onClick={() => setLanguageKey(key)}
                  type="button"
                >
                  {key === "es" ? "ESP" : "ENG"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-20 max-w-2xl pb-8 pt-10">
            <p className="text-sm font-semibold uppercase text-[#ef667c]">{content.status}</p>
            <h2 className="mt-4 text-5xl font-semibold leading-tight text-[#2c2933] sm:text-6xl">
              {content.title}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f6878]">{content.intro}</p>
            {/* <div className="hidden lg:block relative mt-10 h-[30rem] w-full max-w-3xl">
              {fleetImages.map((image, index) => (
                <div
                  key={index}
                  className="group absolute top-0 h-52 w-[88%] overflow-hidden rounded-[2rem] border border-white bg-[#fff] shadow-[0_18px_40px_rgba(69,48,107,0.08)] transition-all duration-300 ease-out hover:-translate-y-6 hover:shadow-[0_28px_64px_rgba(69,48,107,0.18)]"
                  style={{ top: `${index * 2.6}rem`, left: `calc(0% + ${index * 2.6}rem)`, zIndex: 10 + index }}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#eef1f7]">
                    <Image
                      alt={image.alt}
                      fill
                      className="object-cover"
                      src={image.src}
                      priority
                    />
                  </div>
                </div>
              ))}
            </div> */}
          </div>
          <HoneycombSection />
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
                  disabled={busy}
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  type="button"
                >
                  {content[mode].tab}
                </button>
              ))}
            </div>

            <div
              className={[
                "auth-mode-panel space-y-6",
                modeTransition === "exiting" ? "auth-mode-panel-out" : "auth-mode-panel-in",
              ].join(" ")}
            >
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold uppercase text-[#6d7685]">{content.fields.email}</span>
                  <input
                    autoComplete="email"
                    className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c] disabled:cursor-not-allowed disabled:bg-[#eef1f5]"
                    disabled={busy}
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
                    autoComplete={visibleAuthMode === "login" ? "current-password" : "new-password"}
                    className="mt-2 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-[#20232a] outline-none transition placeholder:text-[#a39cab] focus:border-[#ef667c] disabled:cursor-not-allowed disabled:bg-[#eef1f5]"
                    disabled={busy}
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

              {visibleAuthMode === "register" ? (
                <PermissionSelector
                  content={content.permissions}
                  disabled={busy}
                  onToggle={handleTogglePermission}
                  selectedPermissions={selectedPermissions}
                />
              ) : null}

              {loadingLabel ? <AuthLoadingState label={loadingLabel} /> : null}

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
                disabled={busy}
                type="submit"
              >
                {submitting ? content.loading : modeContent.action}
              </button>
            </div>

            <p className="text-sm leading-6 text-[#6f6878]">{content.authNote}</p>
          </form>
          <section className="mt-8 rounded-3xl border border-[#ece8f1] bg-[#f9fafc] p-5 shadow-[0_14px_32px_rgba(32,35,42,0.06)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a8393]">Backend fleet log</p>
                <h3 className="mt-2 text-xl font-semibold text-[#2c2933]">Developer console showcase</h3>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm text-[#6f6878]">
                This page loads backend fleet records and writes the response into the browser developer console via <code>console.table</code>.
              </p>
              <div className="rounded-2xl bg-[#1f2937] p-4 text-xs font-mono text-[#e2e8f0]">
                {loadingFleetLog ? (
                  <p>Loading backend fleet log...</p>
                ) : fleetLogError ? (
                  <p>Error loading backend fleet log: {fleetLogError}</p>
                ) : fleetLogEntries?.length ? (
                  <pre className="whitespace-pre-wrap break-words">
{fleetLogEntries.map((fleet) => `${fleet.id} | ${fleet.label} | ${fleet.route_name}`).join("\n")}
                  </pre>
                ) : (
                  <p>No fleet records were retrieved from the backend.</p>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function holdLoadingFrame() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 120);
  });
}

function HoneycombSection() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cellRefs = useRef<Array<SVGPolygonElement | null>>([]);

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;

    const ctm = svg.getScreenCTM();

    if (!ctm) {
      return;
    }

    const local = point.matrixTransform(ctm.inverse());

    honeycombCells.forEach((cell, index) => {
      const element = cellRefs.current[index];

      if (!element) {
        return;
      }

      const dx = cell.cx - local.x;
      const dy = cell.cy - local.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < honeycombRippleRadius) {
        const intensity = 1 - distance / honeycombRippleRadius;
        element.style.stroke = honeycombRippleColor;
        element.style.opacity = (intensity * 0.9).toFixed(2);
      } else {
        element.style.opacity = "0";
      }
    });
  }

  function handleLeave() {
    cellRefs.current.forEach((element) => {
      if (element) {
        element.style.opacity = "0";
      }
    });
  }

  return (
    <div
      aria-hidden="true"
      className="relative -mx-6 min-h-[260px] flex-1 overflow-hidden sm:-mx-10 lg:-mx-12"
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
    >
      <div className="fleet-honeycomb-layer">
        <svg
          className="fleet-honeycomb-svg"
          ref={svgRef}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="fleetHexPatternBase" x="0" y="0" width="45" height="25.98" patternUnits="userSpaceOnUse">
              <polygon points="30,12.99 22.5,25.98 7.5,25.98 0,12.99 7.5,0 22.5,0" fill="none" stroke={honeycombBaseColor} strokeWidth="1.5" opacity="0.45" />
              <polygon points="52.5,0 45,12.99 30,12.99 22.5,0 30,-12.99 45,-12.99" fill="none" stroke={honeycombBaseColor} strokeWidth="1.5" opacity="0.45" />
              <polygon points="52.5,25.98 45,38.97 30,38.97 22.5,25.98 30,12.99 45,12.99" fill="none" stroke={honeycombBaseColor} strokeWidth="1.5" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="600" height="300" fill="url(#fleetHexPatternBase)" />
          <g>
            {honeycombCells.map((cell, index) => (
              <polygon
                className="fleet-honeycomb-cell"
                key={`${cell.cx}-${cell.cy}`}
                points={cell.points}
                ref={(element) => {
                  cellRefs.current[index] = element;
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

function createHoneycombCells() {
  const cells: { cx: number; cy: number; points: string }[] = [];
  let column = 0;

  for (let cx = -50; cx <= 450; cx += honeycombColSpacing) {
    const yOffset = column % 2 === 0 ? 12.99 : 0;

    for (let cy = -50 + yOffset; cy <= 350; cy += honeycombRowSpacing) {
      cells.push({ cx, cy, points: getHoneycombPoints(cx, cy) });
    }

    column++;
  }

  return cells;
}

function getHoneycombPoints(cx: number, cy: number) {
  const points: string[] = [];

  for (let index = 0; index < 6; index++) {
    const angle = (Math.PI / 180) * (60 * index);
    points.push(
      `${(cx + honeycombSize * Math.cos(angle)).toFixed(2)},${(cy + honeycombSize * Math.sin(angle)).toFixed(2)}`
    );
  }

  return points.join(" ");
}
