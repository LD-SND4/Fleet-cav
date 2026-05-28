import type { Metadata } from "next";

import { LoginScreen } from "@/components/auth/login-screen";

export const metadata: Metadata = {
  title: "Login | Fleet-cav",
  description: "Access the Fleet-cav operations workspace.",
};

export default function LoginPage() {
  return <LoginScreen />;
}
