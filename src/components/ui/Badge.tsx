import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-muted border-line-strong",
  brand: "bg-brand-soft text-brand-strong border-brand-soft-line",
  success: "bg-brand-soft text-brand-strong border-brand-soft-line",
  warning: "bg-warning-soft text-warning border-warning-soft-line",
  danger: "bg-danger-soft text-danger-strong border-danger-soft-line",
  info: "bg-info-soft text-info border-info-soft-line",
};

/**
 * Status chip. `dot` adds a leading indicator; `mono` sets the label in
 * IBM Plex Mono for machine values (capability keys, L-levels, decisions).
 */
export function Badge({
  tone = "neutral",
  dot = false,
  mono = false,
  children,
  className,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  mono?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-medium",
        mono && "font-mono tracking-tight",
        tones[tone],
        className,
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" /> : null}
      {children}
    </span>
  );
}
