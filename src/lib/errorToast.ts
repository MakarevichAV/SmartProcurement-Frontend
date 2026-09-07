/**
 * Minimal toast surface for the backend's unified error model (T038).
 *
 * A tiny external store (no extra deps); components subscribe with
 * ``useSyncExternalStore``. RTK Query rejections are funnelled here by
 * ``errorMiddleware``.
 */
import type { ApiError } from "@/api/baseApi";

export interface Toast {
  id: number;
  code: string;
  message: string;
  correlationId?: string;
}

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts(): Toast[] {
  return toasts;
}

export function dismissToast(id: number): void {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function pushToast(t: Omit<Toast, "id">): void {
  const toast: Toast = { id: nextId++, ...t };
  toasts = [...toasts, toast];
  emit();
  setTimeout(() => dismissToast(toast.id), 6000);
}

export function showApiError(err: ApiError): void {
  pushToast({ code: err.code, message: err.message, correlationId: err.correlation_id });
}

export function showMessage(message: string): void {
  pushToast({ code: "info", message });
}
