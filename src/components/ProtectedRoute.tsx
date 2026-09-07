import type { ReactNode } from "react";

import { useAppSelector } from "@/app/hooks";
import { LoginPage } from "@/features/auth/LoginPage";

/**
 * Renders children only when authenticated. While the bootstrap refresh is in flight the
 * status is "unknown" and we show a lightweight splash; on failure it becomes "anonymous"
 * and the login screen is shown.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAppSelector((s) => s.auth.status);

  if (status === "unknown") {
    return <div className="p-8 text-sm text-gray-500">Loading…</div>;
  }
  if (status === "anonymous") {
    return <LoginPage />;
  }
  return <>{children}</>;
}
