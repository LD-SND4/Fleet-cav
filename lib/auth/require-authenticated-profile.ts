import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseAuthClient, createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedProfile() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("fleetcav_access_token")?.value;
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

  const { data: profile, error: profileError } = await serverClient
    .from("profiles")
    .select("id, role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/login");
  }

  return profile;
}
