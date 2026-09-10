import { useDashboardQuery } from "@/api/dashboardApi";
import type { DashboardLorm } from "@/api/dashboardApi";
import { useAppSelector } from "@/app/hooks";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { StatTile } from "@/components/ui/StatTile";

/** The four LORM responsibility levels, left-to-right: L2 → L3 → L4 → L5. */
const LORM_CARDS: {
  key: keyof DashboardLorm;
  level: string;
  label: string;
  note: string;
  unavailable: string;
}[] = [
  {
    key: "open_risks",
    level: "L2",
    label: "Open risks",
    note: "Diagnosed procurement risks that require attention.",
    unavailable: "Available when risk analysis is enabled.",
  },
  {
    key: "recommendations",
    level: "L3",
    label: "Recommendations",
    note: "Actions the system proposes, awaiting human review.",
    unavailable: "Available when recommendations are enabled.",
  },
  {
    key: "approvals",
    level: "L4",
    label: "Approvals",
    note: "Concrete actions that need per-action human approval.",
    unavailable: "Available when the approval workflow is enabled.",
  },
  {
    key: "autopilot",
    level: "L5",
    label: "Autopilot",
    note: "L5 capabilities operating under approved policies.",
    unavailable: "Available when autopilot policies are enabled.",
  },
];

function whenText(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString() : "—";
}

export function DashboardPage() {
  const me = useAppSelector((s) => s.auth.me);
  const firstName = me?.full_name?.trim().split(/\s+/)[0];
  const { data, isLoading } = useDashboardQuery();
  const lorm = data?.lorm;
  const dh = data?.data_health;

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        description="Where Smart Procurement's control flow comes together — from diagnosed risks through to autonomous action — alongside the health of the data behind those decisions."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {LORM_CARDS.map((c) => {
          const raw = lorm?.[c.key];
          const known = typeof raw === "number";
          return (
            <StatTile
              key={c.key}
              label={c.label}
              value={isLoading ? "…" : known ? raw : "—"}
              note={isLoading || known ? c.note : c.unavailable}
              icon={
                <Badge tone="neutral" mono>
                  {c.level}
                </Badge>
              }
            />
          );
        })}
      </div>

      <div className="mt-8">
        <SectionHeader
          title="Data health"
          description="How current and trustworthy the data behind these decisions is."
        />
        <Card className="mt-3">
          <CardBody>
            {isLoading || !dh ? (
              <SkeletonText lines={3} />
            ) : (
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-4">
                <div>
                  <dt className="text-ink-subtle">Connected sources</dt>
                  <dd className="mt-1 text-[15px] font-semibold tabular-nums text-ink">
                    {dh.sources_total}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Source health</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    <Badge tone="success" dot>
                      {dh.sources_available} available
                    </Badge>
                    {dh.sources_stale > 0 && (
                      <Badge tone="warning" dot>
                        {dh.sources_stale} stale
                      </Badge>
                    )}
                    {dh.sources_unavailable > 0 && (
                      <Badge tone="danger" dot>
                        {dh.sources_unavailable} unavailable
                      </Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Latest successful sync</dt>
                  <dd className="mt-1 text-ink">{whenText(dh.last_successful_sync)}</dd>
                </div>
                <div>
                  <dt className="text-ink-subtle">Open observability gaps</dt>
                  <dd className="mt-1 text-[15px] font-semibold tabular-nums text-ink">
                    {dh.open_observability_gaps}
                  </dd>
                </div>
                <div className="sm:col-span-4">
                  <dt className="text-ink-subtle">Canonical data freshness</dt>
                  <dd className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone="success" dot>
                      {dh.rows_fresh} fresh
                    </Badge>
                    {dh.rows_stale > 0 && (
                      <Badge tone="warning" dot>
                        {dh.rows_stale} stale
                      </Badge>
                    )}
                    {dh.rows_lost > 0 && (
                      <Badge tone="danger" dot>
                        {dh.rows_lost} lost
                      </Badge>
                    )}
                    <span className="text-ink-subtle">of {dh.canonical_rows} canonical rows</span>
                  </dd>
                </div>
              </dl>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="mt-8">
        <SectionHeader
          title="Recent activity"
          description="Significant operational events — newest first."
        />
        <Card className="mt-3">
          <EmptyState
            title="No activity yet"
            description="Executions, approvals and audit events will appear here as the system operates."
          />
        </Card>
      </div>
    </>
  );
}
