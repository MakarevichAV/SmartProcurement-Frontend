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

export interface DomainRows {
  items: Record<string, unknown>[];
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
