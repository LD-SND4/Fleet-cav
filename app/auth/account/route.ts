import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { cookies } from "next/headers";

import {
  getDefaultPermissionRoute,
  isPermissionDisabled,
  normalizePermissions,
  profileRoleCookies,
  serializePermissions,
  type PermissionRole,
} from "@/lib/auth/permissions";
import { getAuthenticatedProfilePermissions } from "@/lib/auth/profile-permissions";
import {
  createSupabaseAuthClient,
  getMissingSupabaseAuthEnv,
} from "@/lib/supabase/server";

type AccountMode = "login" | "register";

const authCookieNames = [
  "fleetcav_access_token",
  "fleetcav_permission_requests",
  "fleetcav_refresh_token",
  "fleetcav_permissions",
  "fleetcav_role",
  "fleetcav_user_id",
];

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("fleetcav_access_token")?.value;
  const userId = cookieStore.get("fleetcav_user_id")?.value;

  if (!accessToken || !userId) {
    return NextResponse.json({ error: "No active account session." }, { status: 401 });
  }

  const supabase = createSupabaseAuthClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return NextResponse.json({ error: "Unable to verify this account session." }, { status: 401 });
  }

  const profileResult = await getAuthenticatedProfilePermissions(userId, accessToken);

  if (!profileResult.ok) {
    return NextResponse.json({ error: profileResult.error }, { status: profileResult.status });
  }

  return NextResponse.json({
    email: data.user.email ?? "",
    fullName: getUserFullName(data.user.user_metadata, data.user.email ?? ""),
    ok: true,
    permissions: profileResult.profile.permissions,
    role: profileResult.profile.role,
  });
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAuthClient();

  if (!supabase) {
    console.error("Supabase authentication is not configured. Missing env:", getMissingSupabaseAuthEnv().join(", "));

    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as {
    email?: string;
    mode?: AccountMode;
    password?: string;
    requestedPermissions?: unknown;
  };
  const mode = body.mode === "register" ? "register" : "login";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const requestedPermissions = mode === "register"
    ? normalizePermissions(body.requestedPermissions).filter((permission) => !isPermissionDisabled(permission))
    : [];

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (mode === "register" && !requestedPermissions.length) {
    return NextResponse.json({ error: "Select at least one workspace permission." }, { status: 400 });
  }

  const { data, error } = mode === "register"
    ? await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: createGeneratedUserName(email),
            requested_permissions: requestedPermissions,
          },
        },
      })
    : await supabase.auth.signInWithPassword({
        email,
        password,
      });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json({ error: "Authentication did not return a user." }, { status: 400 });
  }

  if (!data.session) {
    return NextResponse.json({
      ok: true,
      needsEmailConfirmation: true,
    });
  }

  const profileResult = await getAuthenticatedProfilePermissions(data.user.id, data.session.access_token);

  if (!profileResult.ok) {
    return NextResponse.json({ error: profileResult.error }, { status: profileResult.status });
  }

  const { permissions: sessionPermissions, role: profileRole } = profileResult.profile;
  const response = NextResponse.json({
    grantedPermissions: sessionPermissions,
    ok: true,
    permissions: sessionPermissions,
    redirectTo: getDefaultPermissionRoute(sessionPermissions),
    role: profileRole,
  });

  setAuthCookies(response, {
    accessToken: data.session.access_token,
    expiresIn: data.session.expires_in,
    permissions: sessionPermissions,
    refreshToken: data.session.refresh_token,
    role: profileRole,
    userId: data.user.id,
  });

  return response;
}

export async function PATCH() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("fleetcav_access_token")?.value;
  const supabase = createSupabaseAuthClient();

  if (!accessToken || !supabase) {
    return NextResponse.json({ error: "No active account session." }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user?.email) {
    return NextResponse.json({ error: "Unable to verify this account email." }, { status: 401 });
  }

  const resetResult = await supabase.auth.resetPasswordForEmail(data.user.email);

  if (resetResult.error) {
    return NextResponse.json({ error: resetResult.error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}

function getUserFullName(metadata: Record<string, unknown> | null | undefined, email: string) {
  const name = metadata?.full_name;

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  return createGeneratedUserName(email);
}

function setAuthCookies(
  response: NextResponse,
  values: {
    accessToken: string;
    expiresIn: number;
    permissions: PermissionRole[];
    refreshToken: string;
    role: PermissionRole;
    userId: string;
  },
) {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = values.expiresIn || 60 * 60;

  response.cookies.set("fleetcav_access_token", values.accessToken, {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("fleetcav_refresh_token", values.refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("fleetcav_permissions", serializePermissions(values.permissions), {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("fleetcav_role", profileRoleCookies[values.role], {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure,
  });
  response.cookies.set("fleetcav_user_id", values.userId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
    secure,
  });
}

function clearAuthCookies(response: NextResponse) {
  authCookieNames.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      maxAge: 0,
      path: "/",
    });
  });
}

function createGeneratedUserName(email: string) {
  const [localPart] = email.split("@");
  const baseName = localPart
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  return `${baseName || "Fleet User"} ${randomInt(1000, 10000)}`;
}
