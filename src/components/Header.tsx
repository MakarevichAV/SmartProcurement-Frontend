import { useLocation } from "react-router-dom";

import { useLogoutMutation } from "@/api/authApi";
import { useAppSelector } from "@/app/hooks";
import { NAV_ITEMS } from "@/components/nav";
import { Badge } from "@/components/ui/Badge";
import { IconMenu, IconSignOut } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/cn";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  administrator: "Administrator",
  buyer: "Buyer",
  approver: "Approver",
  manager: "Approver",
};

function roleLabel(role: string): string {
  return ROLE_LABELS[role.toLowerCase()] ?? role;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function useSectionTitle(): string {
  const { pathname } = useLocation();
  const exact = NAV_ITEMS.find((i) => i.path === pathname);
  if (exact) return exact.title;
  const prefix = NAV_ITEMS.filter((i) => i.path !== "/").find((i) => pathname.startsWith(i.path));
  return prefix?.title ?? "Smart Procurement";
}

export function Header({ onOpenNav }: { onOpenNav: () => void }) {
  const me = useAppSelector((s) => s.auth.me);
  const [logout, { isLoading: signingOut }] = useLogoutMutation();
  const title = useSectionTitle();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-ink-muted hover:bg-surface-muted hover:text-ink lg:hidden"
      >
        <IconMenu size={20} />
      </button>

      <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">{title}</h1>

      {me ? (
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 sm:flex">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy font-mono text-[12px] font-semibold text-ink-on-navy"
            >
              {initials(me.full_name)}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium text-ink">{me.full_name}</span>
              <span className="text-[11px] text-ink-muted">
                {me.roles.length > 0 ? me.roles.map(roleLabel).join(", ") : "No role assigned"}
              </span>
            </span>
          </div>

          <Badge tone="neutral" className="sm:hidden" mono>
            {initials(me.full_name)}
          </Badge>

          <div className="h-6 w-px bg-line" aria-hidden="true" />

          <button
            type="button"
            onClick={() => logout()}
            disabled={signingOut}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-line-strong bg-surface px-3 text-[13px] font-medium text-ink-muted",
              "transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-55",
            )}
          >
            {signingOut ? <Spinner size={15} /> : <IconSignOut size={16} />}
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      ) : null}
    </header>
  );
}
