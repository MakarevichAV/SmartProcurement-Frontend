import { Link } from "react-router-dom";

import { useDomainMapQuery } from "@/api/domainApi";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { ObservabilityBadge } from "@/lib/statusBadges";

export function DomainMapPage() {
  const { data, isLoading } = useDomainMapQuery();
  const entities = data?.entities ?? [];
  const total = entities.reduce((n, e) => n + e.count, 0);

  return (
    <>
      <PageHeader
        title="Domain map"
        description="The canonical L0 view — what the system knows exists, where each fact came from, and whether its source is still observable."
      />

      {isLoading ? (
        <Card className="p-5">
          <SkeletonText lines={5} />
        </Card>
      ) : total === 0 ? (
        <Card>
          <EmptyState
            title="The domain map is empty"
            description="Connect a data source, confirm its field mappings, then run a sync. Canonical items, suppliers, warehouses and their relationships will appear here."
            action={
              <Link to="/data-sources" className="text-brand-strong hover:underline">
                Go to data sources
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {entities.map((e) => (
              <Link key={e.entity} to={`/domain/${e.entity.replace(/_/g, "-")}`} className="block">
                <Card className="h-full transition-colors hover:border-line-strong">
                  <CardBody className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[13px] text-ink">{e.entity}</span>
                      <span className="text-[22px] font-semibold tabular-nums text-ink">
                        {e.count}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(e.observability).map(([state, n]) => (
                        <span key={state} className="inline-flex items-center gap-1">
                          <ObservabilityBadge state={state} />
                          <span className="text-[12px] text-ink-subtle tabular-nums">{n}</span>
                        </span>
                      ))}
                      {e.count === 0 && (
                        <span className="text-[12px] text-ink-subtle">no rows</span>
                      )}
                    </div>
                    <p className="text-[12px] text-ink-subtle">
                      {e.sources.length} source{e.sources.length === 1 ? "" : "s"}
                    </p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader title="Relationships" description="Structural links between L0 entities." />
            <CardBody>
              <ul className="flex flex-wrap gap-2">
                {(data?.relationships ?? []).map((r, i) => (
                  <li key={i}>
                    <Badge tone="neutral" mono>
                      {r.from} → {r.to}
                      <span className="ml-1 text-ink-subtle">({r.kind})</span>
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
