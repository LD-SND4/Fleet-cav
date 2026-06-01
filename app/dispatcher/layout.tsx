import type { ReactNode } from "react";

import { requireAuthenticatedProfile } from "@/lib/auth/require-authenticated-profile";

export default async function DispatcherLayout({ children }: { children: ReactNode }) {
  await requireAuthenticatedProfile("dispatcher");

  return children;
}
