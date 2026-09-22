import { baseApi } from "@/api/baseApi";

/**
 * LORM control-flow counters. `open_risks` is a real count as of Phase 4 (T072) — a
 * non-terminal `risk_finding` count, never `null` in practice though the backend schema
 * keeps the `| null` type for forward consistency. `recommendations` / `approvals` stay
 * `null` until their subsystems exist (US3/US4) — never a fake `0`. `autopilot` is a real
 * count of L5 capabilities (refined to "L5 + active policy" when US5 lands).
 */
export interface DashboardLorm {
  open_risks: number | null;
  recommendations: number | null;
  approvals: number | null;
  autopilot: number;
}

/** `ai_unavailable_items` is a real count as of Phase 4 (T072): `risk_finding` rows with
 * `ai_status=unavailable`, excluding terminal (resolved/dismissed) findings. */
export interface DashboardDataHealth {
  sources_total: number;
  sources_available: number;
  sources_unavailable: number;
  sources_stale: number;
  last_successful_sync: string | null;
  canonical_rows: number;
  rows_fresh: number;
  rows_stale: number;
  rows_lost: number;
  open_observability_gaps: number;
  ai_unavailable_items: number;
}

export interface Dashboard {
  lorm: DashboardLorm;
  data_health: DashboardDataHealth;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    dashboard: build.query<Dashboard, void>({
      query: () => "/dashboard",
      providesTags: [{ type: "Dashboard", id: "SUMMARY" }],
    }),
  }),
});

export const { useDashboardQuery } = dashboardApi;
