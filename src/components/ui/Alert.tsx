import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { IconDanger, IconInfo, IconSuccess, IconWarning } from "@/components/ui/icons";

export type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, { wrap: string; icon: typeof IconInfo; iconColor: string }> = {
  info: { wrap: "bg-info-soft border-info-soft-line", icon: IconInfo, iconColor: "text-info" },
  success: {
    wrap: "bg-brand-soft border-brand-soft-line",
    icon: IconSuccess,
    iconColor: "text-brand-strong",
  },
  warning: {
    wrap: "bg-warning-soft border-warning-soft-line",
    icon: IconWarning,
    iconColor: "text-warning",
  },
  danger: {
    wrap: "bg-danger-soft border-danger-soft-line",
    icon: IconDanger,
    iconColor: "text-danger-strong",
  },
};

/** Inline, non-dismissable message tied to the content it sits with. */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const { wrap, icon: Icon, iconColor } = tones[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-[var(--radius-sm)] border px-3.5 py-3 text-[13px] text-ink",
        wrap,
        className,
      )}
    >
      <Icon size={17} className={cn("mt-0.5 shrink-0", iconColor)} />
      <div className="min-w-0">
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        {children ? (
          <div className={cn(title && "mt-0.5", "text-ink-muted")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}
