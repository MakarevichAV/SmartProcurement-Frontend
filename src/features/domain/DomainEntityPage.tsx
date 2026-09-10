import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDomainEntityQuery } from "@/api/domainApi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { ObservabilityBadge } from "@/lib/statusBadges";

const HIDDEN = new Set([
  "id",
  "enterprise_id",
  "created_at",
  "updated_at",
  "source_provenance",
  "observability",
]);

function cell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function DomainEntityPage() {
  const { entity = "" } = useParams();
  const key = entity.replace(/-/g, "_");
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useDomainEntityQuery({ entity: key, cursor });

  // Reset the accumulator when the entity changes.
  useEffect(() => {
    setRows([]);
    setCursor(null);
  }, [key]);

  // Append each fetched page (first page replaces).
  useEffect(() => {
    if (!data) return;
    setRows((prev) => (cursor ? [...prev, ...data.items] : data.items));
  }, [data, cursor]);

  const columns = useMemo(() => {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first)
      .filter((k) => !HIDDEN.has(k))
      .slice(0, 8);
  }, [rows]);

  return (
    <>
      <PageHeader
        title={key}
        meta={
          <Link to="/domain" className="text-[12px] text-ink-muted hover:underline">
            ← Domain map
          </Link>
        }
        description="Canonical rows with their source provenance and current observability."
      />

      {isLoading ? (
        <Card className="p-5">
          <SkeletonText lines={5} />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            title="No rows for this entity"
            description="Confirm the relevant field mappings on a data source and run a sync."
          />
        </Card>
      ) : (
        <>
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  {columns.map((c) => (
                    <Th key={c}>{c}</Th>
                  ))}
                  <Th>Observability</Th>
                  <Th>Source</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows.map((r, i) => {
                  const prov = (r.source_provenance ?? {}) as Record<string, unknown>;
                  return (
                    <Tr key={(r.id as string) ?? i}>
                      {columns.map((c) => (
                        <Td key={c} className={typeof r[c] === "number" ? "tabular-nums" : ""}>
                          {cell(r[c])}
                        </Td>
                      ))}
                      <Td>
                        <ObservabilityBadge state={String(r.observability ?? "—")} />
                      </Td>
                      <Td
                        className="max-w-[10rem] truncate font-mono text-[11px] text-ink-subtle"
                        title={cell(prov.data_source_id)}
                      >
                        {cell(prov.source_field_path)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableWrap>

          {data?.next_cursor && (
            <div className="mt-4">
              <Button
                variant="secondary"
                loading={isFetching}
                onClick={() => setCursor(data.next_cursor)}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
