import { forwardRef, useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  id?: string;
}

/** Labelled native <select>, styled to match {@link TextField}. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, className, required, disabled, id: idProp, ...props },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
        {required ? (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <select
        ref={ref}
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "block h-10 w-full rounded-[var(--radius-sm)] border bg-surface px-3 text-sm text-ink",
          "transition-colors duration-150 focus:outline-none focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted",
          error
            ? "border-danger focus:border-danger focus-visible:ring-2 focus-visible:ring-danger/30"
            : "border-line-strong hover:border-ink-subtle focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/25",
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error ? (
        <p id={hintId} className="text-[12px] text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-[12px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
});
