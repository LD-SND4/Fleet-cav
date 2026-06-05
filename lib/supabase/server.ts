import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabasePublicKeyEnvKeys = ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;
const supabaseSecretKeyEnvKeys = ["SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const;

export function getMissingSupabaseAuthEnv() {
  const missing: string[] = [];

  if (!getEnvValue("NEXT_PUBLIC_SUPABASE_URL")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!getFirstEnvValue(supabasePublicKeyEnvKeys)) {
    missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function getMissingSupabaseServerEnv() {
  const missing: string[] = [];

  if (!getEnvValue("NEXT_PUBLIC_SUPABASE_URL")) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!getFirstEnvValue(supabaseSecretKeyEnvKeys) && !getFirstEnvValue(supabasePublicKeyEnvKeys)) {
    missing.push("SUPABASE_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, or a public Supabase key");
  }

  return missing;
}

export function createSupabaseServerClient() {
  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = getFirstEnvValue(supabaseSecretKeyEnvKeys) ?? getFirstEnvValue(supabasePublicKeyEnvKeys);

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function createSupabaseAuthClient() {
  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = getFirstEnvValue(supabasePublicKeyEnvKeys);

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function createSupabaseUserClient(accessToken: string) {
  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = getFirstEnvValue(supabasePublicKeyEnvKeys);

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

function getFirstEnvValue(keys: readonly string[]) {
  for (const key of keys) {
    const value = getEnvValue(key);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getEnvValue(key: string) {
  const value = process.env[key]?.trim();

  return value || undefined;
}
