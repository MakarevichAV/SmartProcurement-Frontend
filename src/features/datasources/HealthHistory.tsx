import { useHealthHistoryQuery } from "@/api/dataSourcesApi";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { HealthBadge } from "@/lib/statusBadges";

function when(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString() : "—";
}

export function HealthHistory({ dataSourceId }: { dataSourceId: string }) {
  const { data } = useHealthHistoryQuery(dataSourceId);
  if (!data) return null;

  return (
    <Card>
      <CardHeader title="Observability" description="Connection checks and any recorded gaps." />
      <CardBody className="space-y-4">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] sm:grid-cols-4">
          <div>
            <dt className="text-ink-subtle">Health</dt>
            <dd className="mt-1">
              <HealthBadge health={data.health} />
            </dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Last checked</dt>
            <dd className="mt-1 text-ink">{when(data.last_check_at)}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Last success</dt>
            <dd className="mt-1 text-ink">{when(data.last_success_at)}</dd>
          </div>
          <div>
            <dt className="text-ink-subtle">Last error</dt>
            <dd className="mt-1 text-ink">{data.last_error ?? "—"}</dd>
          </div>
        </dl>

        {data.events.length === 0 ? (
          <EmptyState
            title="No observability gaps"
            description="The source has not been recorded as unavailable."
          />
        ) : (
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th>Reason</Th>
                  <Th>Opened</Th>
                  <Th>Closed</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.events.map((e, i) => (
                  <Tr key={i}>
                    <Td className="font-mono text-[12px]">{e.reason}</Td>
                    <Td>{when(e.opened_at)}</Td>
                    <Td>{e.closed_at ? when(e.closed_at) : "open"}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </CardBody>
    </Card>
  );
}
