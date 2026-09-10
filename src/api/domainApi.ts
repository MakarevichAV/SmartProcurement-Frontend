import { baseApi } from "@/api/baseApi";

export interface DomainEntitySummary {
  entity: string;
  count: number;
  observability: Record<string, number>;
  sources: string[];
}

export interface DomainRelationship {
  from: string;
  to: string;
  via: string;
  kind: string;
}

export interface DomainMap {
  entities: DomainEntitySummary[];
  relationships: DomainRelationship[];
}

/** A resolved foreign-key reference (business label + raw id + natural-key fields). */
export interface DomainReference {
  entity: string;
  id: string;
  label: string;
  sku?: string;
  code?: string;
  name?: string;
}

/** Where a canonical row came from — the data source, its contributing fields, freshness. */
export interface DomainProvenance {
  data_source_id: string | null;
  data_source_name: string | null;
  source_fields: string[];
  fetched_at: string | null;
}

export interface DomainRow extends Record<string, unknown> {
  id?: string;
  observability?: string;
  references?: Record<string, DomainReference>;
  provenance?: DomainProvenance;
  source_provenance?: Record<string, unknown>;
}

export interface DomainRows {
  items: DomainRow[];
  next_cursor: string | null;
}

export const domainApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    domainMap: build.query<DomainMap, void>({
      query: () => "/domain/map",
      providesTags: [{ type: "DomainMap", id: "MAP" }],
    }),
    domainEntity: build.query<
      DomainRows,
      { entity: string; limit?: number; cursor?: string | null }
    >({
      query: ({ entity, limit, cursor }) => {
        const params = new URLSearchParams();
        if (limit) params.set("limit", String(limit));
        if (cursor) params.set("cursor", cursor);
        const qs = params.toString();
        return `/domain/${entity}${qs ? `?${qs}` : ""}`;
      },
      providesTags: (_r, _e, { entity }) => [{ type: "DomainMap", id: entity }],
    }),
  }),
});

export const { useDomainMapQuery, useDomainEntityQuery } = domainApi;
