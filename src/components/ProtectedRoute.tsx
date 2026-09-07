import type { ReactNode } from "react";

import { useAppSelector } from "@/app/hooks";
import { LogoMark } from "@/components/brand/Logo";
import { Spinner } from "@/components/ui/Spinner";
import { LoginPage } from "@/features/auth/LoginPage";

/**
 * Renders children only when authenticated. While the bootstrap refresh is in
 * flight the status is "unknown" and we show a branded splash; on failure it
 * becomes "anonymous" and the login screen is shown.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const status = useAppSelector((s) => s.auth.status);

  if (status === "unknown") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas">
        <LogoMark size={44} />
        <div className="flex items-center gap-2 text-[13px] text-ink-muted">
          <Spinner size={15} />
          Restoring your session…
        </div>
      </div>
    );
  }
  if (status === "anonymous") {
    return <LoginPage />;
  }
  return <>{children}</>;
}
