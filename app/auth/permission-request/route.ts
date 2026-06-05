import { NextRequest, NextResponse } from "next/server";

import { isPermissionRole, permissionRoles, type PermissionRole } from "@/lib/auth/permissions";
import {
  createSupabaseAuthClient,
  createSupabaseUserClient,
  getMissingSupabaseAuthEnv,
} from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const authClient = createSupabaseAuthClient();

  if (!authClient) {
    console.error("Supabase authentication is not configured. Missing env:", getMissingSupabaseAuthEnv().join(", "));

    return NextResponse.json({ error: "Supabase authentication is not configured." }, { status: 500 });
  }

  const accessToken = request.cookies.get("fleetcav_access_token")?.value;
  const userId = request.cookies.get("fleetcav_user_id")?.value;

  if (!accessToken || !userId) {
    return NextResponse.json({ error: "Log in before requesting a new permission." }, { status: 401 });
  }

  const body = (await request.json()) as { permission?: unknown };
  const permission = body.permission;

  if (!isPermissionRole(permission)) {
    return NextResponse.json({ error: "Select a valid permission to request." }, { status: 400 });
  }

  const { data, error } = await authClient.auth.getUser(accessToken);

  if (error || !data.user || data.user.id !== userId) {
    return NextResponse.json({ error: "Your session could not be verified." }, { status: 401 });
  }

  const databaseRequest = await persistPermissionRequest(userId, permission, accessToken);
  const previousRequests = parsePermissionRequests(request.cookies.get("fleetcav_permission_requests")?.value);
  const requestedPermissions = permissionRoles.filter((role) => role === permission || previousRequests.includes(role));
  const response = NextResponse.json({
    persisted: databaseRequest.persisted,
    ok: true,
    requestedPermission: permission,
    requestedPermissions,
  });

  response.cookies.set("fleetcav_permission_requests", requestedPermissions.join(","), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

async function persistPermissionRequest(userId: string, permission: PermissionRole, accessToken: string) {
  const userClient = createSupabaseUserClient(accessToken);

  if (!userClient) {
    return { persisted: false };
  }

  const { data: role, error: roleError } = await userClient
    .from("roles")
    .select("id")
    .eq("name", permission)
    .maybeSingle();

  if (roleError || !role) {
    console.warn("Permission request could not find role in Supabase; keeping cookie fallback:", roleError?.message);
    return { persisted: false };
  }

  const { data: existingRequest, error: existingError } = await userClient
    .from("permission_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("requested_role_id", role.id)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) {
    console.warn("Permission request lookup failed; keeping cookie fallback:", existingError.message);
    return { persisted: false };
  }

  if (existingRequest) {
    return { persisted: true };
  }

  const { error } = await userClient
    .from("permission_requests")
    .insert({
      notes: "Requested from Fleet-cav workspace navigation",
      requested_role_id: role.id,
      status: "pending",
      user_id: userId,
    });

  if (error) {
    console.warn("Permission request insert failed; keeping cookie fallback:", error.message);
    return { persisted: false };
  }

  return { persisted: true };
}

function parsePermissionRequests(value: string | undefined) {
  if (!value) {
    return [];
  }

  const requestedPermissions = value.split(",").map((permission) => permission.trim());

  return permissionRoles.filter((permission) => requestedPermissions.includes(permission));
}
