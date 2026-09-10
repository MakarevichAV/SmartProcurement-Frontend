import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDomainEntityQuery } from "@/api/domainApi";
import type { DomainRow } from "@/api/domainApi";
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
  "provenance",
  "references",
  "observability",
]);

const MAX_SCALAR_COLS = 8;

function scalarCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** "item_id" -> "Item", "supplier_id" -> "Supplier" */
function refHeader(refKey: string): string {
  const base = refKey.replace(/_id$/, "").replace(/_/g, " ");
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export function DomainEntityPage() {
  const { entity = "" } = useParams();
  const key = entity.replace(/-/g, "_");
  const [rows, setRows] = useState<DomainRow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useDomainEntityQuery({ entity: key, cursor });

  useEffect(() => {
    setRows([]);
    setCursor(null);
  }, [key]);

  useEffect(() => {
    if (!data) return;
    setRows((prev) => (cursor ? [...prev, ...data.items] : data.items));
  }, [data, cursor]);

  // Resolved-reference columns: any FK column that at least one row could resolve.
  const refCols = useMemo(() => {
    const seen = new Set<string>();
    for (const r of rows) for (const k of Object.keys(r.references ?? {})) seen.add(k);
    return [...seen];
  }, [rows]);

  // Scalar columns: everything else that isn't hidden and isn't the raw side of a reference.
  const scalarCols = useMemo(() => {
    const first = rows[0];
    if (!first) return [];
    const refSet = new Set(refCols);
    return Object.keys(first)
      .filter((k) => !HIDDEN.has(k) && !refSet.has(k))
      .slice(0, MAX_SCALAR_COLS);
  }, [rows, refCols]);

  return (
    <>
      <PageHeader
        title={key}
        meta={
          <Link to="/domain" className="text-[12px] text-ink-muted hover:underline">
            ← Domain map
          </Link>
        }
        description="Canonical rows with resolved relationships, source and current observability."
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
                  {refCols.map((c) => (
                    <Th key={c}>{refHeader(c)}</Th>
                  ))}
                  {scalarCols.map((c) => (
                    <Th key={c}>{c}</Th>
                  ))}
                  <Th>Observability</Th>
                  <Th>Source</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows.map((r, i) => {
                  const prov = r.provenance;
                  const fieldList = prov?.source_fields?.join(", ") ?? "";
                  return (
                    <Tr key={r.id ?? i}>
                      {refCols.map((c) => {
                        const ref = r.references?.[c];
                        return (
                          <Td key={c} title={ref?.id}>
                            {ref?.label ?? "—"}
                          </Td>
                        );
                      })}
                      {scalarCols.map((c) => (
                        <Td key={c} className={typeof r[c] === "number" ? "tabular-nums" : ""}>
                          {scalarCell(r[c])}
                        </Td>
                      ))}
                      <Td>
                        <ObservabilityBadge state={String(r.observability ?? "—")} />
                      </Td>
                      <Td>
                        <div className="text-ink">{prov?.data_source_name ?? "—"}</div>
                        {fieldList ? (
                          <div
                            className="mt-0.5 max-w-[14rem] truncate font-mono text-[11px] text-ink-subtle"
                            title={
                              prov?.fetched_at
                                ? `${fieldList} · fetched ${prov.fetched_at}`
                                : fieldList
                            }
                          >
                            {fieldList}
                          </div>
                        ) : null}
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
