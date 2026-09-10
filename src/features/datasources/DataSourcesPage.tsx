import { useState } from "react";
import { Link } from "react-router-dom";

import { useListDataSourcesQuery } from "@/api/dataSourcesApi";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconDataSources } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { HealthBadge } from "@/lib/statusBadges";
import { ConnectSourceForm } from "@/features/datasources/ConnectSourceForm";

function when(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString() : "—";
}

export function DataSourcesPage() {
  const { data, isLoading } = useListDataSourcesQuery();
  const [connecting, setConnecting] = useState(false);
  const sources = data?.items ?? [];

  return (
    <>
      <PageHeader
        title="Data sources"
        description="Connected systems of record. Onboarding is a review flow: connect, test, introspect the schema, confirm AI-suggested field mappings, then sync into the domain model."
        actions={
          !connecting ? (
            <Button onClick={() => setConnecting(true)}>Connect source</Button>
          ) : undefined
        }
      />

      {connecting && (
        <div className="mb-6">
          <ConnectSourceForm onDone={() => setConnecting(false)} />
        </div>
      )}

      {isLoading ? (
        <Card className="p-5">
          <SkeletonText lines={4} />
        </Card>
      ) : sources.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconDataSources size={20} />}
            title="No data sources connected"
            description="Connect a file, REST or SQL source to begin building the L0 domain map. Nothing is imported until you confirm its field mappings."
            action={<Button onClick={() => setConnecting(true)}>Connect source</Button>}
          />
        </Card>
      ) : (
        <TableWrap>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Kind</Th>
                <Th>Connector</Th>
                <Th>Health</Th>
                <Th>Last checked</Th>
                <Th>Last sync</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sources.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <Link
                      to={`/data-sources/${s.id}`}
                      className="font-medium text-brand-strong hover:underline"
                    >
                      {s.name}
                    </Link>
                  </Td>
                  <Td>{s.kind}</Td>
                  <Td className="font-mono text-[12px]">{s.connector_type}</Td>
                  <Td>
                    <HealthBadge health={s.health} />
                  </Td>
                  <Td>{when(s.last_check_at)}</Td>
                  <Td>{when(s.last_success_at)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableWrap>
      )}
    </>
  );
}
