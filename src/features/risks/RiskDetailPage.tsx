import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useDismissRiskMutation, useGetRiskQuery } from "@/api/risksApi";
import type { RiskEvidence } from "@/api/risksApi";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SkeletonText } from "@/components/ui/Skeleton";
import { TextField } from "@/components/ui/TextField";
import { showMessage } from "@/lib/errorToast";
import { AiStatusBadge, RiskSeverityBadge, RiskStatusBadge } from "@/lib/statusBadges";
import { TERMINAL_RISK_STATUSES, riskTypeLabel, signalTypeLabel } from "@/features/risks/constants";

function when(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString() : "—";
}

function shortId(id: string | null): string {
  return id ? id.slice(0, 8) : "—";
}

function factorWeightTone(weight: string): "neutral" | "warning" | "danger" {
  if (weight === "high") return "danger";
  if (weight === "med") return "warning";
  return "neutral";
}

function DismissAction({ riskId }: { riskId: string }) {
  const [dismiss, { isLoading }] = useDismissRiskMutation();
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");

  async function confirmDismiss() {
    const trimmed = reason.trim();
    if (!trimmed) return;
    await dismiss({ id: riskId, reason: trimmed })
      .unwrap()
      .then(() => {
        showMessage("Risk dismissed", "success");
        setConfirming(false);
        setReason("");
      })
      .catch(() => undefined); // request-level failure is surfaced by the global error toast
  }

  if (!confirming) {
    return (
      <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
        Dismiss risk
      </Button>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <TextField
        label="Reason for dismissal"
        required
        autoFocus
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Why is this finding no longer relevant?"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={confirmDismiss}
          loading={isLoading}
          disabled={!reason.trim() || isLoading}
        >
          Confirm dismiss
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          onClick={() => {
            setConfirming(false);
            setReason("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EvidenceItem({ evidence }: { evidence: RiskEvidence }) {
  if (evidence.kind === "observation_signal") {
    return (
      <div className="rounded-[var(--radius-sm)] border border-line p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-ink">{signalTypeLabel(evidence.signal_type)}</span>
          <span className="text-[12px] text-ink-subtle">{when(evidence.observed_at)}</span>
        </div>
        {Object.keys(evidence.payload).length > 0 && (
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            {Object.entries(evidence.payload).map(([key, value]) => (
              <div key={key} className="flex gap-1">
                <dt className="text-ink-subtle">{key}:</dt>
                <dd className="font-medium text-ink">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    );
  }

  // domain_row — currently only produced for systematic_supplier_delay (a purchase_order row
  // with no linked observation_signal, per T071's grounding rules).
  return (
    <div className="rounded-[var(--radius-sm)] border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-ink">
          Purchase order {evidence.entity === "purchase_order" ? "" : `(${evidence.entity})`}
        </span>
        <Badge tone={evidence.late_days > 0 ? "warning" : "neutral"} mono>
          {evidence.late_days > 0 ? `${evidence.late_days}d late` : "on time"}
        </Badge>
      </div>
      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        <div className="flex gap-1">
          <dt className="text-ink-subtle">Expected:</dt>
          <dd className="font-medium text-ink">{when(evidence.expected_at)}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-ink-subtle">Received:</dt>
          <dd className="font-medium text-ink">{when(evidence.received_at)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function RiskDetailPage() {
  const { id = "" } = useParams();
  const { data: risk, isLoading } = useGetRiskQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <Card className="p-5">
        <SkeletonText lines={6} />
      </Card>
    );
  }
  if (!risk) {
    return (
      <EmptyState
        title="Risk not found"
        description="It may have been resolved, or the link may be out of date."
        action={
          <Link to="/risks" className="text-brand-strong hover:underline">
            Back to risks
          </Link>
        }
      />
    );
  }

  const isTerminal = TERMINAL_RISK_STATUSES.includes(risk.status);
  const hasExplanation = risk.explanation !== null;

  return (
    <>
      <PageHeader
        title={riskTypeLabel(risk.risk_type)}
        meta={
          <>
            <Link to="/risks" className="text-[12px] text-ink-muted hover:underline">
              ← Risks
            </Link>
            <RiskStatusBadge status={risk.status} />
            <RiskSeverityBadge severity={risk.severity} />
          </>
        }
        description="Deterministic risk detection with the evidence and, when available, an AI-generated explanation of why it matters."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Detection"
            description="Detected by a deterministic rule (T070) — no AI judgment is involved in whether this risk exists."
          />
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-4">
              <div>
                <dt className="text-ink-subtle">Item</dt>
                <dd className="mt-1 font-mono text-ink">{shortId(risk.item_id)}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">Supplier</dt>
                <dd className="mt-1 font-mono text-ink">{shortId(risk.supplier_id)}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">Detected</dt>
                <dd className="mt-1 text-ink">{when(risk.detected_at)}</dd>
              </div>
              <div>
                <dt className="text-ink-subtle">Resolved</dt>
                <dd className="mt-1 text-ink">{when(risk.resolved_at)}</dd>
              </div>
            </dl>

            {risk.status === "dismissed" && (
              <Alert tone="info" title="Dismissed" className="mt-4">
                <dl className="space-y-1">
                  <div>
                    <span className="text-ink-subtle">Reason: </span>
                    {risk.dismissed_reason}
                  </div>
                  <div>
                    <span className="text-ink-subtle">At: </span>
                    {when(risk.dismissed_at)}
                  </div>
                  <div>
                    <span className="text-ink-subtle">By: </span>
                    <span className="font-mono">{shortId(risk.dismissed_by)}</span>
                  </div>
                </dl>
              </Alert>
            )}

            {!isTerminal && (
              <div className="mt-4">
                <DismissAction riskId={risk.id} />
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="AI explanation"
            description="Explains the already-detected risk above; it does not decide whether the risk exists."
          />
          <CardBody>
            {hasExplanation ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[12.5px] font-semibold text-ink-muted">What</h4>
                  <p className="mt-1 text-[13.5px] text-ink">{risk.explanation!.what}</p>
                </div>
                <div>
                  <h4 className="text-[12.5px] font-semibold text-ink-muted">Why</h4>
                  <p className="mt-1 text-[13.5px] text-ink">{risk.explanation!.why}</p>
                </div>
                {risk.explanation!.factors.length > 0 && (
                  <div>
                    <h4 className="text-[12.5px] font-semibold text-ink-muted">
                      Contributing factors
                    </h4>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {risk.explanation!.factors.map((f, i) => (
                        <li key={i}>
                          <Badge tone={factorWeightTone(f.weight)}>
                            {f.name} · {f.effect}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-semibold text-ink-muted">Confidence</span>
                  <span className="text-[13.5px] font-semibold tabular-nums text-ink">
                    {Math.round(risk.explanation!.confidence * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <Alert tone="info" title="AI explanation unavailable">
                The deterministic risk detected above remains valid.{" "}
                {risk.ai_status === "unavailable"
                  ? "The AI explanation could not be generated for this finding — this does not affect the finding itself."
                  : "An AI explanation has not been generated for this finding yet."}
              </Alert>
            )}
            <div className="mt-3">
              <AiStatusBadge status={risk.ai_status} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Evidence"
            description="The observed data this finding is grounded in."
          />
          <CardBody>
            {risk.evidence.length === 0 ? (
              <p className="text-[13px] text-ink-muted">
                No linked evidence recorded for this finding.
              </p>
            ) : (
              <div className="space-y-2">
                {risk.evidence.map((e) => (
                  <EvidenceItem key={`${e.kind}-${e.ref}`} evidence={e} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
