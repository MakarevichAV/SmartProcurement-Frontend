import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { IconInbox } from "@/components/ui/icons";

/**
 * The screen has nothing to show yet. An empty state points at the next action;
 * it is never just a shrug. `icon` defaults to a neutral tray glyph.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-line bg-surface-muted text-ink-subtle">
        {icon ?? <IconInbox size={20} />}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
