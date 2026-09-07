import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
}

const controlBase =
  "block w-full rounded-[var(--radius-sm)] border bg-surface px-3 text-sm text-ink " +
  "placeholder:text-ink-subtle transition-colors duration-150 " +
  "focus:outline-none focus-visible:outline-none " +
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted";

/**
 * Labelled text input with hint / error slots. Wires `id`, `aria-describedby`
 * and `aria-invalid` so the label, hint and error are announced together.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, className, required, disabled, id: idProp, ...props },
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
      <input
        ref={ref}
        id={id}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          controlBase,
          "h-10",
          error
            ? "border-danger focus:border-danger focus-visible:ring-2 focus-visible:ring-danger/30"
            : "border-line-strong hover:border-ink-subtle focus:border-brand focus-visible:ring-2 focus-visible:ring-brand/25",
        )}
        {...props}
      />
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
