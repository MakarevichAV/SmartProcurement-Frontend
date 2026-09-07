import { cn } from "@/lib/cn";

/**
 * "SP" monogram — a navy tile with the mark set in IBM Plex Mono and a single
 * green node on the corner (the one accent). Geometric, technical, no clichés.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-navy font-mono font-semibold text-ink-on-navy",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.42, letterSpacing: "0.02em" }}
      aria-hidden="true"
    >
      SP
      <span
        className="absolute rounded-full bg-brand"
        style={{ width: size * 0.14, height: size * 0.14, right: size * 0.12, bottom: size * 0.12 }}
      />
    </span>
  );
}

/**
 * Full lockup: mark + wordmark. `tone` controls the wordmark colour so it reads
 * on the navy sidebar ("on-navy") or on a light surface ("default").
 */
export function LogoLockup({
  tone = "default",
  descriptor = true,
  className,
}: {
  tone?: "default" | "on-navy";
  descriptor?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={32} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            tone === "on-navy" ? "text-ink-on-navy" : "text-ink",
          )}
        >
          Smart Procurement
        </span>
        {descriptor ? (
          <span
            className={cn(
              "mt-1 font-mono text-[10.5px] tracking-[0.02em]",
              tone === "on-navy" ? "text-white/45" : "text-ink-subtle",
            )}
          >
            Bounded autonomy
          </span>
        ) : null}
      </span>
    </span>
  );
}
