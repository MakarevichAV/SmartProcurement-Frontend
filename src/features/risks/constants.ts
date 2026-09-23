import type { RiskStatus, RiskType } from "@/api/risksApi";

/** Human-readable labels for the six deterministic risk types (data-model.md §5). */
export const RISK_TYPE_LABELS: Record<RiskType, string> = {
  likely_shortage: "Likely shortage",
  insufficient_until_next_delivery: "Insufficient until next delivery",
  production_stop_risk: "Production stop risk",
  systematic_supplier_delay: "Systematic supplier delay",
  quality_degradation: "Quality degradation",
  price_anomaly: "Price anomaly",
};

export const RISK_TYPE_OPTIONS: { value: RiskType; label: string }[] = (
  Object.keys(RISK_TYPE_LABELS) as RiskType[]
).map((value) => ({ value, label: RISK_TYPE_LABELS[value] }));

/** Every status the API can return (data-model.md §5) — `recommended`/`actioned` are not
 * reachable yet (US3/US4), but listing them is accurate, not invented. */
export const RISK_STATUS_OPTIONS: { value: RiskStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "recommended", label: "Recommended" },
  { value: "actioned", label: "Actioned" },
  { value: "resolved", label: "Resolved" },
  { value: "dismissed", label: "Dismissed" },
];

export const TERMINAL_RISK_STATUSES: RiskStatus[] = ["resolved", "dismissed"];

export function riskTypeLabel(type: RiskType | string): string {
  return RISK_TYPE_LABELS[type as RiskType] ?? type;
}

/** Human-readable labels for `observation_signal.signal_type` (data-model.md §4). */
const SIGNAL_TYPE_LABELS: Record<string, string> = {
  stock_change: "Stock change",
  consumption_rate: "Consumption rate",
  reorder_point_near: "Reorder point near",
  demand_change: "Demand change",
  supplier_delay: "Supplier delay",
  lead_time_change: "Lead time change",
  price_change: "Price change",
  quality_issue: "Quality issue",
  other: "Other",
};

export function signalTypeLabel(type: string): string {
  return SIGNAL_TYPE_LABELS[type] ?? type;
}
