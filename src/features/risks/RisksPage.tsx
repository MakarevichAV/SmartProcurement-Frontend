import { useState } from "react";
import { Link } from "react-router-dom";

import { useListRisksQuery } from "@/api/risksApi";
import type { RiskStatus, RiskType } from "@/api/risksApi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconRisk } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { SkeletonText } from "@/components/ui/Skeleton";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { TextField } from "@/components/ui/TextField";
import { AiStatusBadge, RiskSeverityBadge, RiskStatusBadge } from "@/lib/statusBadges";
import { RISK_STATUS_OPTIONS, RISK_TYPE_OPTIONS, riskTypeLabel } from "@/features/risks/constants";

function when(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Item/supplier context: the list endpoint returns raw ids only (no resolved label, unlike
 * the domain map) — shown honestly as a short id rather than inventing a business name. */
function subjectContext(itemId: string | null, supplierId: string | null): string {
  if (itemId) return `Item ${itemId.slice(0, 8)}`;
  if (supplierId) return `Supplier ${supplierId.slice(0, 8)}`;
  return "—";
}

export function RisksPage() {
  const [status, setStatus] = useState<RiskStatus | "">("");
  const [riskType, setRiskType] = useState<RiskType | "">("");
  const [itemId, setItemId] = useState("");
  // A small stack of visited cursors: the last entry is the current page, so "Previous" just
  // pops it — simpler and less error-prone than merging pages into one accumulated list.
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const cursor = cursorStack[cursorStack.length - 1];

  const { data, isLoading, isFetching } = useListRisksQuery({
    status: status || undefined,
    risk_type: riskType || undefined,
    item_id: itemId.trim() || undefined,
    cursor,
  });
  const items = data?.items ?? [];

  function resetToFirstPage() {
    setCursorStack([null]);
  }

  return (
    <>
      <PageHeader
        title="Risks & recommendations"
        description="Procurement risks the system has diagnosed from observed data, with the evidence and AI explanation behind each one. Recommendations arrive in a later phase."
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-end gap-3 p-4">
          <Select
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as RiskStatus | "");
              resetToFirstPage();
            }}
            options={[{ value: "", label: "All statuses" }, ...RISK_STATUS_OPTIONS]}
            className="w-44"
          />
          <Select
            label="Risk type"
            value={riskType}
            onChange={(e) => {
              setRiskType(e.target.value as RiskType | "");
              resetToFirstPage();
            }}
            options={[{ value: "", label: "All types" }, ...RISK_TYPE_OPTIONS]}
            className="w-56"
          />
          <TextField
            label="Item id"
            placeholder="Paste an item id…"
            value={itemId}
            onChange={(e) => {
              setItemId(e.target.value);
              resetToFirstPage();
            }}
            className="w-56"
          />
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-5">
          <SkeletonText lines={4} />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconRisk size={20} />}
            title="No risks found"
            description={
              status || riskType || itemId
                ? "No risk findings match these filters."
                : "Nothing has been diagnosed yet. Risks appear here once the system observes a concerning pattern in the data."
            }
          />
        </Card>
      ) : (
        <>
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th>Risk type</Th>
                  <Th>Item / supplier</Th>
                  <Th>Severity</Th>
                  <Th>Status</Th>
                  <Th>AI explanation</Th>
                  <Th align="right">Detected</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <Link
                        to={`/risks/${r.id}`}
                        className="font-medium text-brand-strong hover:underline"
                      >
                        {riskTypeLabel(r.risk_type)}
                      </Link>
                    </Td>
                    <Td className="font-mono text-[12px] text-ink-muted">
                      {subjectContext(r.item_id, r.supplier_id)}
                    </Td>
                    <Td>
                      <RiskSeverityBadge severity={r.severity} />
                    </Td>
                    <Td>
                      <RiskStatusBadge status={r.status} />
                    </Td>
                    <Td>
                      <AiStatusBadge status={r.ai_status} />
                    </Td>
                    <Td align="right">{when(r.detected_at)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>

          {(cursorStack.length > 1 || data?.next_cursor) && (
            <div className="mt-3 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                disabled={cursorStack.length <= 1 || isFetching}
                onClick={() => setCursorStack((s) => s.slice(0, -1))}
              >
                ← Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!data?.next_cursor || isFetching}
                loading={isFetching}
                onClick={() => data?.next_cursor && setCursorStack((s) => [...s, data.next_cursor])}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
