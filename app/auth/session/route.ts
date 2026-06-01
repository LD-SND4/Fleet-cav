import { NextResponse } from "next/server";

const authCookieNames = [
  "fleetcav_access_token",
  "fleetcav_permission_requests",
  "fleetcav_refresh_token",
  "fleetcav_permissions",
  "fleetcav_role",
  "fleetcav_user_id",
];

export function POST() {
  return NextResponse.json(
    {
      error: "Testing role sessions are disabled. Log in with a registered Supabase user.",
      ok: false,
    },
    { status: 403 },
  );
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });

  authCookieNames.forEach((cookieName) => {
    response.cookies.set(cookieName, "", {
      maxAge: 0,
      path: "/",
    });
  });

  return response;
}
