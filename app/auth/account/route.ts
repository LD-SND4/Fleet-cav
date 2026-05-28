import { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseAuthClient, createSupabaseServerClient } from "@/lib/supabase/server";

type AccountMode = "login" | "register";
type ProfileRole = Database["public"]["Tables"]["profiles"]["Row"]["role"];

const profileRoleRoutes: Record<ProfileRole, string> = {
  admin: "/admin",
  dispatcher: "/dispatcher",
  driver: "/driver",
  viewer: "/viewer",
};

const profileRoleCookies: Record<ProfileRole, string> = {
  admin: "admin_user",
  dispatcher: "dispatcher_user",
  driver: "driver_user",
  viewer: "viewer_user",
};

const authCookieNames = [
  "fleetcav_access_token",
  "fleetcav_refresh_token",
  "fleetcav_role",
  "fleetcav_user_id",
];

export async function POST(request: NextRequest) {
  const supabase = createSupabaseAuthClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as {
    email?: string;
    fullName?: string;
    mode?: AccountMode;
    password?: string;
  };
  const mode = body.mode === "register" ? "register" : "login";
  const email = body.email?.trim().toLowerCase() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  if (mode === "register" && !fullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  const { data, error } = mode === "register"
    ? await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
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

  const profileRoleResult = await getProfileRole(data.user.id);

  if (!profileRoleResult.ok) {
    return NextResponse.json({ error: profileRoleResult.error }, { status: profileRoleResult.status });
  }

  const profileRole = profileRoleResult.role;
  const response = NextResponse.json({
    ok: true,
    redirectTo: profileRoleRoutes[profileRole],
    role: profileRole,
  });

  setAuthCookies(response, {
    accessToken: data.session.access_token,
    expiresIn: data.session.expires_in,
    refreshToken: data.session.refresh_token,
    role: profileRole,
    userId: data.user.id,
  });

  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}

async function getProfileRole(userId: string): Promise<
  | {
      ok: true;
      role: ProfileRole;
    }
  | {
      error: string;
      ok: false;
      status: number;
    }
> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      error: "Fleet-cav profile verification is not configured.",
      ok: false,
      status: 500,
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Unable to load authenticated user profile:", error.message);

    return {
      error: "We could not verify this user's Fleet-cav profile.",
      ok: false,
      status: 500,
    };
  }

  if (!data?.role) {
    return {
      error: "This account exists in Auth, but it is not registered in Fleet-cav profiles.",
      ok: false,
      status: 403,
    };
  }

  return {
    ok: true,
    role: data.role,
  };
}

function setAuthCookies(
  response: NextResponse,
  values: {
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    role: ProfileRole;
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
