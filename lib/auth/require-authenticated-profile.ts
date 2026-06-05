import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  parseSerializedPermissions,
  type PermissionRole,
} from "@/lib/auth/permissions";
import { getAuthenticatedProfilePermissions } from "@/lib/auth/profile-permissions";
import { createSupabaseAuthClient, createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedProfile(requiredPermission?: PermissionRole) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("fleetcav_access_token")?.value;
  const permissionsCookie = cookieStore.get("fleetcav_permissions");
  const userId = cookieStore.get("fleetcav_user_id")?.value;

  if (!accessToken || !userId) {
    redirect("/login");
  }

  const authClient = createSupabaseAuthClient();
  const serverClient = createSupabaseServerClient();

  if (!authClient || !serverClient) {
    redirect("/login");
  }

  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

  if (userError || !userData.user || userData.user.id !== userId) {
    redirect("/login");
  }

  const profileResult = await getAuthenticatedProfilePermissions(userData.user.id, accessToken);

  if (!profileResult.ok) {
    redirect("/login");
  }

  const profile = profileResult.profile;
  const grantedPermissions = profile.permissions;
  const sessionPermissions = permissionsCookie
    ? parseSerializedPermissions(permissionsCookie.value)
    : grantedPermissions;
  const activePermissions = sessionPermissions.length ? sessionPermissions : grantedPermissions;

  if (requiredPermission) {
    if (!grantedPermissions.includes(requiredPermission) || !activePermissions.includes(requiredPermission)) {
      redirect(`/login?permissionDenied=${requiredPermission}`);
    }
  }

  return {
    ...profile,
    permissions: activePermissions,
  };
}
