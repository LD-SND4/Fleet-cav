import { NextRequest, NextResponse } from "next/server";

const allowedRoles = new Set(["admin_user", "dispatcher_user", "driver_user", "viewer_user"]);

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { role?: string };

  if (!body.role || !allowedRoles.has(body.role)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("fleetcav_role", body.role, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("fleetcav_role", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
