import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  useGetDataSourceQuery,
  useIntrospectDataSourceMutation,
  useSuggestMappingsMutation,
  useTestDataSourceMutation,
  useUploadDataSourceFileMutation,
} from "@/api/dataSourcesApi";
import type { ConnectionCheck, SourceField } from "@/api/dataSourcesApi";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { showMessage } from "@/lib/errorToast";
import { HealthBadge } from "@/lib/statusBadges";
import { HealthHistory } from "@/features/datasources/HealthHistory";
import { MappingReview } from "@/features/datasources/MappingReview";

export function DataSourceDetailPage() {
  const { id = "" } = useParams();
  const { data: source, isLoading } = useGetDataSourceQuery(id, { skip: !id });

  const [test, testState] = useTestDataSourceMutation();
  const [introspect, introspectState] = useIntrospectDataSourceMutation();
  const [suggest, suggestState] = useSuggestMappingsMutation();
  const [upload, uploadState] = useUploadDataSourceFileMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [check, setCheck] = useState<ConnectionCheck | null>(null);
  const [fields, setFields] = useState<SourceField[]>([]);

  if (isLoading) {
    return (
      <Card className="p-5">
        <SkeletonText lines={5} />
      </Card>
    );
  }
  if (!source) {
    return (
      <EmptyState
        title="Data source not found"
        description="It may have been removed."
        action={
          <Link to="/data-sources" className="text-brand-strong hover:underline">
            Back to data sources
          </Link>
        }
      />
    );
  }

  async function runTest() {
    const res = await test(id)
      .unwrap()
      .catch(() => null);
    if (res) setCheck(res);
  }

  async function runIntrospect() {
    const res = await introspect(id)
      .unwrap()
      .catch(() => null);
    if (res) {
      setFields(res);
      showMessage(`Discovered ${res.length} field(s)`, "success");
    }
  }

  async function runSuggest() {
    const res = await suggest(id)
      .unwrap()
      .catch(() => null);
    if (res) showMessage(`AI proposed ${res.length} mapping(s) — confirm below`, "success");
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await upload({ id, content: await file.text() })
      .unwrap()
      .catch(() => undefined);
    showMessage(`Uploaded ${file.name}`, "success");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <PageHeader
        title={source.name}
        meta={
          <>
            <Link to="/data-sources" className="text-[12px] text-ink-muted hover:underline">
              ← Data sources
            </Link>
            <HealthBadge health={source.health} />
          </>
        }
        description={`${source.kind} · ${source.connector_type} connector`}
      />

      <Card className="mb-6">
        <CardHeader
          title="Onboarding"
          description="Test the connection, introspect the schema, then ask the AI to propose field mappings."
        />
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={runTest} loading={testState.isLoading}>
              Test connection
            </Button>
            <Button variant="secondary" onClick={runIntrospect} loading={introspectState.isLoading}>
              Introspect schema
            </Button>
            <Button
              variant="secondary"
              onClick={runSuggest}
              loading={suggestState.isLoading}
              disabled={fields.length === 0}
            >
              Suggest mappings
            </Button>
            {source.connector_type === "file" && (
              <label className="inline-flex">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={onUpload}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  loading={uploadState.isLoading}
                  onClick={() => fileRef.current?.click()}
                >
                  Upload file
                </Button>
              </label>
            )}
          </div>

          {check && (
            <Alert
              tone={check.health === "available" ? "success" : "danger"}
              title={`Connection ${check.health}`}
            >
              {check.detail}
            </Alert>
          )}

          {fields.length > 0 && (
            <TableWrap>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Field</Th>
                    <Th>Inferred type</Th>
                    <Th>Sample values</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fields.map((f) => (
                    <Tr key={f.path}>
                      <Td className="font-mono text-[12px]">{f.path}</Td>
                      <Td>{f.inferred_type}</Td>
                      <Td className="text-ink-muted">
                        {f.sample_values.slice(0, 4).map(String).join(", ") || "—"}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableWrap>
          )}
        </CardBody>
      </Card>

      <div className="space-y-6">
        <MappingReview dataSourceId={id} fields={fields} />
        <HealthHistory dataSourceId={id} />
      </div>
    </>
  );
}
