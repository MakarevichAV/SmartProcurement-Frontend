import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/components/ui/Badge";

const HEALTH_TONE: Record<string, BadgeTone> = {
  available: "success",
  stale: "warning",
  unavailable: "danger",
};

const OBSERVABILITY_TONE: Record<string, BadgeTone> = {
  fresh: "success",
  stale: "warning",
  lost: "danger",
};

const MAPPING_TONE: Record<string, BadgeTone> = {
  suggested: "info",
  confirmed: "success",
  rejected: "neutral",
  retired: "neutral",
};

export function HealthBadge({ health }: { health: string }) {
  return (
    <Badge tone={HEALTH_TONE[health] ?? "neutral"} dot>
      {health}
    </Badge>
  );
}

export function ObservabilityBadge({ state }: { state: string }) {
  return (
    <Badge tone={OBSERVABILITY_TONE[state] ?? "neutral"} dot>
      {state}
    </Badge>
  );
}

export function MappingStatusBadge({ status }: { status: string }) {
  return <Badge tone={MAPPING_TONE[status] ?? "neutral"}>{status}</Badge>;
}

const RISK_SEVERITY_TONE: Record<string, BadgeTone> = {
  low: "neutral",
  med: "warning",
  high: "danger",
};

const RISK_SEVERITY_LABEL: Record<string, string> = {
  low: "Low",
  med: "Medium",
  high: "High",
};

export function RiskSeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge tone={RISK_SEVERITY_TONE[severity] ?? "neutral"} dot>
      {RISK_SEVERITY_LABEL[severity] ?? severity}
    </Badge>
  );
}

const RISK_STATUS_TONE: Record<string, BadgeTone> = {
  open: "info",
  recommended: "info",
  actioned: "info",
  resolved: "success",
  dismissed: "neutral",
};

const RISK_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  recommended: "Recommended",
  actioned: "Actioned",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export function RiskStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={RISK_STATUS_TONE[status] ?? "neutral"}>
      {RISK_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

const AI_STATUS_TONE: Record<string, BadgeTone> = {
  pending: "neutral",
  ready: "success",
  unavailable: "warning",
};

const AI_STATUS_LABEL: Record<string, string> = {
  pending: "AI pending",
  ready: "AI explained",
  unavailable: "AI unavailable",
};

/** Deliberately never "danger" — an unavailable AI explanation is not a failed risk (FR-016a);
 * the deterministic finding above it stays fully valid regardless of this badge's state. */
export function AiStatusBadge({ status }: { status: string }) {
  return (
    <Badge tone={AI_STATUS_TONE[status] ?? "neutral"} dot>
      {AI_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
