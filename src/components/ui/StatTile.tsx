import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A single metric. Flat (border, no shadow) so a row of these reads as one
 * instrument cluster rather than a stack of cards. `value` accepts "—" for
 * "no data yet" states with an explanatory `note`.
 */
export function StatTile({
  label,
  value,
  note,
  icon,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[var(--radius-md)] border border-line bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-medium text-ink-muted">{label}</span>
        {icon ? <span className="text-ink-subtle">{icon}</span> : null}
      </div>
      <span className="text-[26px] font-semibold leading-none tracking-tight text-ink tabular-nums">
        {value}
      </span>
      {note ? <span className="text-[12px] leading-snug text-ink-subtle">{note}</span> : null}
    </div>
  );
}
