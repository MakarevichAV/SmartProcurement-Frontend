import { baseApi } from "@/api/baseApi";

/** data-model.md §5 / contracts/rest-api.md "Risks / Recommendations". */
export type RiskType =
  | "likely_shortage"
  | "insufficient_until_next_delivery"
  | "production_stop_risk"
  | "systematic_supplier_delay"
  | "quality_degradation"
  | "price_anomaly";

export type RiskSeverity = "low" | "med" | "high";
export type RiskStatus = "open" | "recommended" | "actioned" | "resolved" | "dismissed";
export type AiStatus = "pending" | "ready" | "unavailable";

export interface RiskFinding {
  id: string;
  risk_type: RiskType;
  item_id: string | null;
  supplier_id: string | null;
  severity: RiskSeverity;
  status: RiskStatus;
  ai_status: AiStatus;
  detected_at: string;
  resolved_at: string | null;
  dismissed_reason: string | null;
  dismissed_at: string | null;
  dismissed_by: string | null;
}

export interface RiskFindingList {
  items: RiskFinding[];
  next_cursor: string | null;
}

/** What `Explanation.data_used` actually stores — just kind + ref (contracts/ai-structured-
 * output.md §2), distinct from the richer `evidence` entries below. */
export interface EvidenceRef {
  kind: "observation_signal" | "sku_aggregate" | "domain_row";
  ref: string;
}

export interface RiskFactor {
  name: string;
  effect: string;
  weight: "low" | "med" | "high";
}

export interface RiskExplanation {
  what: string;
  why: string;
  data_used: EvidenceRef[];
  factors: RiskFactor[];
  confidence: number;
  generated_by: "ai" | "rule";
  llm_provider: string | null;
  llm_model: string | null;
}

/** `GET /risks/{id}`'s `evidence` — the same grounding universe T071 validates an AI
 * explanation against (`app.analysis.explain.evidence_payloads`), enriched with the
 * underlying data so a human can see it without a separate lookup. `observation_signal`
 * evidence backs every risk type except `systematic_supplier_delay`, which instead surfaces
 * `domain_row` (`purchase_order`) evidence — it deliberately has no linked signals (T066
 * doesn't diff `purchase_order` changes into signals). */
export interface ObservationSignalEvidence {
  kind: "observation_signal";
  ref: string;
  signal_type: string;
  payload: Record<string, unknown>;
  observed_at: string;
}

export interface DomainRowEvidence {
  kind: "domain_row";
  ref: string;
  entity: string;
  expected_at: string;
  received_at: string;
  late_days: number;
}

export type RiskEvidence = ObservationSignalEvidence | DomainRowEvidence;

export interface RiskFindingDetail extends RiskFinding {
  explanation: RiskExplanation | null;
  evidence: RiskEvidence[];
}

export interface ListRisksParams {
  status?: RiskStatus;
  risk_type?: RiskType;
  item_id?: string;
  limit?: number;
  cursor?: string | null;
}

export interface DismissRiskBody {
  id: string;
  /** Required, non-empty (backend rejects an empty/missing reason with 400). */
  reason: string;
}

export const risksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listRisks: build.query<RiskFindingList, ListRisksParams | void>({
      query: (params) => {
        const p = params ?? {};
        const qs = new URLSearchParams();
        if (p.status) qs.set("status", p.status);
        if (p.risk_type) qs.set("risk_type", p.risk_type);
        if (p.item_id) qs.set("item_id", p.item_id);
        if (p.limit) qs.set("limit", String(p.limit));
        if (p.cursor) qs.set("cursor", p.cursor);
        const s = qs.toString();
        return `/risks${s ? `?${s}` : ""}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((r) => ({ type: "Risk" as const, id: r.id })),
              { type: "Risk" as const, id: "LIST" },
            ]
          : [{ type: "Risk" as const, id: "LIST" }],
    }),
    getRisk: build.query<RiskFindingDetail, string>({
      query: (id) => `/risks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Risk", id }],
    }),
    dismissRisk: build.mutation<RiskFinding, DismissRiskBody>({
      query: ({ id, reason }) => ({
        url: `/risks/${id}/dismiss`,
        method: "POST",
        body: { reason },
      }),
      // A dismissal is terminal (backend rejects re-dismissing), so this finding's detail and
      // the list it was part of both need a refetch; it also changes the dashboard's
      // open_risks / ai_unavailable_items counts (T072).
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Risk", id },
        { type: "Risk", id: "LIST" },
        { type: "Dashboard", id: "SUMMARY" },
      ],
    }),
  }),
});

export const { useListRisksQuery, useGetRiskQuery, useDismissRiskMutation } = risksApi;
