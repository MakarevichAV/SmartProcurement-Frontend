import { useSyncExternalStore } from "react";

import { dismissToast, getToasts, subscribeToasts } from "@/lib/errorToast";

export function ToastHost() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getToasts);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="rounded border border-red-300 bg-red-50 p-3 text-sm shadow">
          <div className="flex items-start justify-between gap-2">
            <span className="font-medium text-red-800">{t.code}</span>
            <button className="text-red-500" onClick={() => dismissToast(t.id)}>
              ×
            </button>
          </div>
          <p className="text-red-700">{t.message}</p>
          {t.correlationId ? (
            <p className="mt-1 text-[11px] text-red-400">id: {t.correlationId}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
