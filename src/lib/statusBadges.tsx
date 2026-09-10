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
