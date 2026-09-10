import { useState } from "react";

import {
  useConfirmMappingMutation,
  useCreateMappingMutation,
  useEditMappingMutation,
  useListMappingsQuery,
  useRejectMappingMutation,
  useRetireMappingMutation,
} from "@/api/dataSourcesApi";
import type { FieldMapping, SourceField } from "@/api/dataSourcesApi";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { TextField } from "@/components/ui/TextField";
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from "@/components/ui/Table";
import { showMessage } from "@/lib/errorToast";
import { MappingStatusBadge } from "@/lib/statusBadges";
import { CANONICAL_ENTITIES } from "@/features/datasources/constants";

const ENTITY_OPTS = CANONICAL_ENTITIES.map((e) => ({ value: e, label: e }));

function confidence(v: number | null): string {
  return v === null ? "—" : `${Math.round(v * 100)}%`;
}

/**
 * Confirms every mapping that is `suggested` at click time, one at a time, via the same
 * `confirm` endpoint the per-row button uses. Confirmed / rejected / retired mappings are
 * never touched. Failures are counted, not fatal: the list refetch shows them as still
 * `suggested`, and a summary error is raised — they are never presented as confirmed.
 */
function BulkConfirmButton({
  dataSourceId,
  suggested,
}: {
  dataSourceId: string;
  suggested: FieldMapping[];
}) {
  const [confirm] = useConfirmMappingMutation();
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);

  async function confirmAll() {
    const targets = suggested; // snapshot — later refetches must not add/skip work
    setProgress({ processed: 0, total: targets.length });
    let ok = 0;
    let failed = 0;
    for (const m of targets) {
      try {
        await confirm({ id: m.id, dataSourceId }).unwrap();
        ok += 1;
      } catch {
        failed += 1;
      }
      setProgress({ processed: ok + failed, total: targets.length });
    }
    setProgress(null);
    if (failed === 0) {
      showMessage(`Confirmed ${ok} mapping${ok === 1 ? "" : "s"}`, "success");
    } else {
      showMessage(
        `Confirmed ${ok} of ${targets.length} — ${failed} failed and are still shown as suggested`,
        "error",
      );
    }
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={confirmAll}
      loading={progress !== null}
      disabled={progress !== null}
    >
      {progress
        ? `Confirming… (${progress.processed}/${progress.total})`
        : `Confirm all suggested (${suggested.length})`}
    </Button>
  );
}

function MappingRow({ m, dataSourceId }: { m: FieldMapping; dataSourceId: string }) {
  const [confirm, confirmState] = useConfirmMappingMutation();
  const [reject] = useRejectMappingMutation();
  const [retire] = useRetireMappingMutation();
  const [edit, editState] = useEditMappingMutation();
  const [editing, setEditing] = useState(false);
  const [entity, setEntity] = useState(m.canonical_entity);
  const [attr, setAttr] = useState(m.canonical_attribute);

  async function saveEdit() {
    await edit({
      id: m.id,
      dataSourceId,
      body: { canonical_entity: entity, canonical_attribute: attr },
    })
      .unwrap()
      .catch(() => undefined);
    setEditing(false);
  }

  return (
    <Tr>
      <Td className="font-mono text-[12px]">{m.source_field_path}</Td>
      <Td>
        {editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <Select
              label=""
              aria-label="Canonical entity"
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              options={ENTITY_OPTS}
              className="w-40"
            />
            <TextField
              label=""
              aria-label="Canonical attribute"
              value={attr}
              onChange={(e) => setAttr(e.target.value)}
              className="w-40"
            />
          </div>
        ) : (
          <span className="font-mono text-[12px]">
            {m.canonical_entity}
            <span className="text-ink-subtle">.</span>
            {m.canonical_attribute}
          </span>
        )}
      </Td>
      <Td>
        <MappingStatusBadge status={m.status} />
      </Td>
      <Td align="right">{confidence(m.ai_confidence)}</Td>
      <Td align="right">
        <div className="flex justify-end gap-1.5">
          {editing ? (
            <>
              <Button size="sm" onClick={saveEdit} loading={editState.isLoading}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              {m.status !== "confirmed" && m.status !== "retired" && (
                <Button
                  size="sm"
                  onClick={() =>
                    confirm({ id: m.id, dataSourceId })
                      .unwrap()
                      .catch(() => undefined)
                  }
                  loading={confirmState.isLoading}
                >
                  Confirm
                </Button>
              )}
              {m.status !== "retired" && (
                <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
              {m.status === "confirmed" ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    retire({ id: m.id, dataSourceId })
                      .unwrap()
                      .catch(() => undefined)
                  }
                >
                  Retire
                </Button>
              ) : (
                m.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      reject({ id: m.id, dataSourceId })
                        .unwrap()
                        .catch(() => undefined)
                    }
                  >
                    Reject
                  </Button>
                )
              )}
            </>
          )}
        </div>
      </Td>
    </Tr>
  );
}

function AddMapping({ dataSourceId, fields }: { dataSourceId: string; fields: SourceField[] }) {
  const [create, { isLoading }] = useCreateMappingMutation();
  const [path, setPath] = useState("");
  const [entity, setEntity] = useState<string>(CANONICAL_ENTITIES[0]);
  const [attr, setAttr] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!path || !attr) return;
    await create({
      data_source_id: dataSourceId,
      source_field_path: path,
      canonical_entity: entity,
      canonical_attribute: attr,
    })
      .unwrap()
      .then(() => {
        setPath("");
        setAttr("");
      })
      .catch(() => undefined);
  }

  return (
    <form className="flex flex-wrap items-end gap-2" onSubmit={add}>
      {fields.length > 0 ? (
        <Select
          label="Source field"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          options={[
            { value: "", label: "Select…" },
            ...fields.map((f) => ({ value: f.path, label: f.path })),
          ]}
          className="w-48"
        />
      ) : (
        <TextField
          label="Source field"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-48"
        />
      )}
      <Select
        label="Entity"
        value={entity}
        onChange={(e) => setEntity(e.target.value)}
        options={ENTITY_OPTS}
        className="w-44"
      />
      <TextField
        label="Attribute"
        value={attr}
        onChange={(e) => setAttr(e.target.value)}
        className="w-44"
      />
      <Button type="submit" size="sm" loading={isLoading} disabled={!path || !attr}>
        Add mapping
      </Button>
    </form>
  );
}

export function MappingReview({
  dataSourceId,
  fields,
}: {
  dataSourceId: string;
  fields: SourceField[];
}) {
  const { data, isLoading } = useListMappingsQuery(dataSourceId);
  const mappings = data?.items ?? [];
  const confirmedCount = mappings.filter((m) => m.status === "confirmed").length;
  const suggested = mappings.filter((m) => m.status === "suggested");

  return (
    <Card>
      <CardHeader
        title="Field mappings"
        description={
          mappings.length
            ? `${confirmedCount} confirmed of ${mappings.length}. Only confirmed mappings are used when syncing.`
            : "AI proposes mappings; you confirm each one. Nothing is applied automatically."
        }
        actions={
          suggested.length > 0 ? (
            <BulkConfirmButton dataSourceId={dataSourceId} suggested={suggested} />
          ) : undefined
        }
      />
      <CardBody className="space-y-4">
        <AddMapping dataSourceId={dataSourceId} fields={fields} />
        {isLoading ? null : mappings.length === 0 ? (
          <EmptyState
            title="No mappings yet"
            description="Run “Suggest mappings” above, or add one by hand."
          />
        ) : (
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th>Source field</Th>
                  <Th>Canonical target</Th>
                  <Th>Status</Th>
                  <Th align="right">AI confidence</Th>
                  <Th align="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mappings.map((m) => (
                  <MappingRow key={m.id} m={m} dataSourceId={dataSourceId} />
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        )}
      </CardBody>
    </Card>
  );
}
