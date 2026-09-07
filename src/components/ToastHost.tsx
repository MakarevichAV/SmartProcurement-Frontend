import { useSyncExternalStore } from "react";

import { IconClose, IconDanger, IconInfo, IconSuccess } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { ToastTone } from "@/lib/errorToast";
import { dismissToast, getToasts, subscribeToasts } from "@/lib/errorToast";

const TONES: Record<
  ToastTone,
  { wrap: string; icon: typeof IconInfo; iconColor: string; role: "status" | "alert" }
> = {
  error: {
    wrap: "border-danger-soft-line bg-danger-soft",
    icon: IconDanger,
    iconColor: "text-danger-strong",
    role: "alert",
  },
  info: {
    wrap: "border-info-soft-line bg-info-soft",
    icon: IconInfo,
    iconColor: "text-info",
    role: "status",
  },
  success: {
    wrap: "border-brand-soft-line bg-brand-soft",
    icon: IconSuccess,
    iconColor: "text-brand-strong",
    role: "status",
  },
};

export function ToastHost() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getToasts);
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => {
        const tone = TONES[t.tone] ?? TONES.error;
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            role={tone.role}
            className={cn(
              "flex gap-3 rounded-[var(--radius-md)] border bg-surface p-3.5 text-[13px] text-ink shadow-[var(--shadow-overlay)]",
              tone.wrap,
            )}
          >
            <Icon size={18} className={cn("mt-0.5 shrink-0", tone.iconColor)} />
            <div className="min-w-0 flex-1">
              {t.tone === "error" ? (
                <p className="font-mono text-[11.5px] font-medium text-ink-muted">{t.code}</p>
              ) : null}
              <p className={cn(t.tone === "error" && "mt-0.5", "text-ink")}>{t.message}</p>
              {t.correlationId ? (
                <p className="mt-1 font-mono text-[11px] text-ink-subtle">id {t.correlationId}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-ink-subtle hover:bg-surface-muted hover:text-ink"
            >
              <IconClose size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
