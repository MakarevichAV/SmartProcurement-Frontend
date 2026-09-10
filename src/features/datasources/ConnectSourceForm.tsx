import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateDataSourceMutation } from "@/api/dataSourcesApi";
import type { CreateDataSourceBody } from "@/api/dataSourcesApi";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { showMessage } from "@/lib/errorToast";
import { CONNECTOR_TYPES, SOURCE_KINDS } from "@/features/datasources/constants";

type Connector = (typeof CONNECTOR_TYPES)[number];

export function ConnectSourceForm({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();
  const [create, { isLoading }] = useCreateDataSourceMutation();

  const [name, setName] = useState("");
  const [kind, setKind] = useState<string>("file");
  const [connector, setConnector] = useState<Connector>("file");

  // file
  const [format, setFormat] = useState("csv");
  const [hasHeader, setHasHeader] = useState(true);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // rest
  const [baseUrl, setBaseUrl] = useState("");
  const [resourcePaths, setResourcePaths] = useState("");
  const [bearerToken, setBearerToken] = useState("");

  // sql
  const [dsn, setDsn] = useState("");
  const [queryEntity, setQueryEntity] = useState("item");
  const [querySql, setQuerySql] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileContent(await file.text());
  }

  function buildBody(): CreateDataSourceBody {
    if (connector === "file") {
      return {
        name,
        kind,
        connector_type: "file",
        config: {
          format,
          has_header: hasHeader,
          ...(fileContent ? { content: fileContent } : {}),
        },
      };
    }
    if (connector === "rest") {
      return {
        name,
        kind,
        connector_type: "rest",
        config: {
          base_url: baseUrl,
          resource_paths: resourcePaths
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        credential: bearerToken ? { kind: "bearer", token: bearerToken } : null,
      };
    }
    return {
      name,
      kind,
      connector_type: "sql",
      config: { dsn, queries: querySql ? { [queryEntity]: querySql } : {} },
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await create(buildBody()).unwrap();
      showMessage(`Connected "${created.name}"`, "success");
      onDone();
      navigate(`/data-sources/${created.id}`);
    } catch {
      /* surfaced by the global error toast */
    }
  }

  return (
    <Card elevated>
      <CardHeader
        title="Connect a data source"
        description="Nothing is imported yet — you will test the connection, review AI-suggested field mappings, and confirm them before any data is synced."
      />
      <CardBody>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Warehouse export"
          />
          <Select
            label="Kind"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            options={SOURCE_KINDS.map((k) => ({ value: k, label: k }))}
          />
          <Select
            label="Connector"
            value={connector}
            onChange={(e) => setConnector(e.target.value as Connector)}
            options={CONNECTOR_TYPES.map((c) => ({ value: c, label: c }))}
          />
          <div className="hidden sm:block" />

          {connector === "file" && (
            <>
              <Select
                label="Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  { value: "csv", label: "CSV" },
                  { value: "json", label: "JSON" },
                ]}
              />
              <label className="flex items-end gap-2 pb-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="h-4 w-4 rounded border-line-strong"
                />
                File has a header row
              </label>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[13px] font-medium text-ink">File</span>
                <input
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={onFile}
                  className="text-[13px] text-ink-muted file:mr-3 file:rounded-[var(--radius-sm)] file:border file:border-line-strong file:bg-surface file:px-3 file:py-1.5 file:text-[13px]"
                />
                {fileName ? (
                  <span className="text-[12px] text-ink-subtle">
                    {fileName} — {fileContent?.length ?? 0} bytes read
                  </span>
                ) : (
                  <span className="text-[12px] text-ink-subtle">
                    Optional now — you can upload it from the source page.
                  </span>
                )}
              </div>
            </>
          )}

          {connector === "rest" && (
            <>
              <TextField
                label="Base URL"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://erp.example.com/api"
                className="sm:col-span-2"
                required
              />
              <TextField
                label="Resource paths"
                hint="Comma-separated, e.g. items, suppliers"
                value={resourcePaths}
                onChange={(e) => setResourcePaths(e.target.value)}
                className="sm:col-span-2"
              />
              <TextField
                label="Bearer token"
                hint="Stored encrypted; never returned by the API."
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                type="password"
                className="sm:col-span-2"
              />
            </>
          )}

          {connector === "sql" && (
            <>
              <TextField
                label="DSN (no credentials)"
                value={dsn}
                onChange={(e) => setDsn(e.target.value)}
                placeholder="postgresql+asyncpg://db-host/warehouse"
                className="sm:col-span-2"
                required
              />
              <TextField
                label="Entity"
                value={queryEntity}
                onChange={(e) => setQueryEntity(e.target.value)}
              />
              <TextField
                label="SELECT query"
                value={querySql}
                onChange={(e) => setQuerySql(e.target.value)}
                placeholder="SELECT sku, name FROM items"
              />
            </>
          )}

          <div className="mt-1 flex gap-2 sm:col-span-2">
            <Button type="submit" loading={isLoading} disabled={!name}>
              Connect source
            </Button>
            <Button type="button" variant="ghost" onClick={onDone}>
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
