import "server-only";

import {
  getEffectivePermissions,
  getGrantedPermissions,
  getPrimaryPermission,
  isPermissionRole,
  type PermissionRole,
} from "@/lib/auth/permissions";
import { createSupabaseServerClient, getMissingSupabaseServerEnv } from "@/lib/supabase/server";

type ProfilePermissionResult =
  | {
      ok: true;
      profile: {
        id: string;
        permissions: PermissionRole[];
        role: PermissionRole;
      };
    }
  | {
      error: string;
      ok: false;
      status: number;
    };

type UserPermissionRow = {
  role_name: string | null;
};

type ProfileRoleRow = {
  id: string;
  role: string | null;
};

type ProfileIdRow = {
  id: string;
};

export async function getAuthenticatedProfilePermissions(userId: string): Promise<ProfilePermissionResult> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    console.error("Supabase profile verification is not configured. Missing env:", getMissingSupabaseServerEnv().join(", "));

    return {
      error: "Fleet-cav profile verification is not configured.",
      ok: false,
      status: 500,
    };
  }

  const viewResult = await getPermissionsFromUserPermissionsView(userId);

  if (viewResult.ok) {
    return viewResult;
  }

  const profileRoleResult = await getPermissionsFromProfileRole(userId);

  if (profileRoleResult.ok) {
    return profileRoleResult;
  }

  if (viewResult.status === 404 && profileRoleResult.status === 404) {
    return viewResult;
  }

  const profileFallback = await getProfileIdFallback(userId);

  if (profileFallback.ok) {
    return profileFallback;
  }

  return profileRoleResult.status >= 500 ? profileRoleResult : viewResult;
}

async function getPermissionsFromUserPermissionsView(userId: string): Promise<ProfilePermissionResult> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return {
      error: "Fleet-cav profile verification is not configured.",
      ok: false,
      status: 500,
    };
  }

  const { data, error } = await supabase
    .from("user_permissions")
    .select("role_name")
    .eq("user_id", userId);

  if (error) {
    console.warn("Unable to load user_permissions; falling back to profiles.role:", error.message);

    return {
      error: "Unable to load normalized user permissions.",
      ok: false,
      status: 500,
    };
  }

  const roles = ((data ?? []) as UserPermissionRow[])
    .map((row) => row.role_name)
    .filter(isPermissionRole);
  const permissions = getEffectivePermissions(roles);

  if (!permissions.length) {
    return {
      error: "This account exists, but no Fleet-cav role has been granted yet.",
      ok: false,
      status: 403,
    };
  }

  return {
    ok: true,
    profile: {
      id: userId,
      permissions,
      role: getPrimaryPermission(permissions),
    },
  };
}

async function getPermissionsFromProfileRole(userId: string): Promise<ProfilePermissionResult> {
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
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Unable to load profiles.role; falling back to profile id:", error.message);

    return {
      error: "Unable to load compatibility profile role.",
      ok: false,
      status: 500,
    };
  }

  const profile = data as ProfileRoleRow | null;

  if (!profile) {
    return {
      error: "This account exists in Auth, but it is not registered in Fleet-cav profiles.",
      ok: false,
      status: 404,
    };
  }

  if (!isPermissionRole(profile.role)) {
    return {
      error: "This Fleet-cav profile does not have a valid role.",
      ok: false,
      status: 403,
    };
  }

  return {
    ok: true,
    profile: {
      id: profile.id,
      permissions: getGrantedPermissions(profile.role),
      role: profile.role,
    },
  };
}

async function getProfileIdFallback(userId: string): Promise<ProfilePermissionResult> {
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
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return {
      error: "This account exists in Auth, but it is not registered in Fleet-cav profiles.",
      ok: false,
      status: 404,
    };
  }

  const profile = data as ProfileIdRow;

  return {
    ok: true,
    profile: {
      id: profile.id,
      permissions: ["viewer"],
      role: "viewer",
    },
  };
}
