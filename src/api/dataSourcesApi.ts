import { baseApi } from "@/api/baseApi";

/** Health of a connected source (data-model.md §2). */
export type SourceHealth = "available" | "unavailable" | "stale";
export type MappingStatus = "suggested" | "confirmed" | "rejected" | "retired";

export interface DataSource {
  id: string;
  name: string;
  kind: string;
  connector_type: "rest" | "file" | "sql";
  config: Record<string, unknown>;
  health: SourceHealth;
  observation_interval_seconds: number;
  has_credential: boolean;
  last_success_at: string | null;
  last_check_at: string | null;
  last_error: string | null;
  created_at: string;
}

export interface ConnectionCheck {
  health: string;
  detail: string;
  checked_at: string;
}

export interface SourceField {
  path: string;
  inferred_type: string;
  sample_values: unknown[];
}

export interface FieldMapping {
  id: string;
  data_source_id: string;
  source_field_path: string;
  canonical_entity: string;
  canonical_attribute: string;
  transform: Record<string, unknown> | null;
  status: MappingStatus;
  ai_confidence: number | null;
  confirmed_by: string | null;
  confirmed_at: string | null;
}

export interface MappingChangeEvent {
  action: string;
  actor_id: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  at: string;
}

export interface BulkConfirmResult {
  data_source_id: string;
  requested: string[];
  confirmed: string[];
  failed: { mapping_id: string; reason: string }[];
}

export interface HealthHistory {
  health: SourceHealth;
  last_check_at: string | null;
  last_success_at: string | null;
  last_error: string | null;
  events: { reason: string; opened_at: string; closed_at: string | null }[];
}

export interface CreateDataSourceBody {
  name: string;
  kind: string;
  connector_type: "rest" | "file" | "sql";
  config: Record<string, unknown>;
  credential?: Record<string, unknown> | null;
  observation_interval_seconds?: number | null;
}

interface ListEnvelope<T> {
  items: T[];
  next_cursor?: string | null;
}

export const dataSourcesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listDataSources: build.query<ListEnvelope<DataSource>, void>({
      query: () => "/data-sources",
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((d) => ({ type: "DataSource" as const, id: d.id })),
              { type: "DataSource" as const, id: "LIST" },
            ]
          : [{ type: "DataSource" as const, id: "LIST" }],
    }),
    getDataSource: build.query<DataSource, string>({
      query: (id) => `/data-sources/${id}`,
      providesTags: (_r, _e, id) => [{ type: "DataSource", id }],
    }),
    createDataSource: build.mutation<DataSource, CreateDataSourceBody>({
      query: (body) => ({ url: "/data-sources", method: "POST", body }),
      invalidatesTags: [{ type: "DataSource", id: "LIST" }],
    }),
    updateDataSource: build.mutation<
      DataSource,
      { id: string; body: Partial<CreateDataSourceBody> }
    >({
      query: ({ id, body }) => ({ url: `/data-sources/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "DataSource", id },
        { type: "DataSource", id: "LIST" },
      ],
    }),
    uploadDataSourceFile: build.mutation<DataSource, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `/data-sources/${id}/upload`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "DataSource", id }],
    }),
    testDataSource: build.mutation<ConnectionCheck, string>({
      query: (id) => ({ url: `/data-sources/${id}/test`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "DataSource", id }],
    }),
    introspectDataSource: build.mutation<SourceField[], string>({
      query: (id) => ({ url: `/data-sources/${id}/introspect`, method: "POST" }),
    }),
    suggestMappings: build.mutation<FieldMapping[], string>({
      query: (id) => ({ url: `/data-sources/${id}/mapping-suggestions`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => [{ type: "Mapping", id: `SRC-${id}` }],
    }),
    healthHistory: build.query<HealthHistory, string>({
      query: (id) => `/data-sources/${id}/health-history`,
      providesTags: (_r, _e, id) => [{ type: "DataSource", id }],
    }),

    listMappings: build.query<ListEnvelope<FieldMapping>, string>({
      query: (dataSourceId) => `/data-sources/${dataSourceId}/mappings`,
      providesTags: (_r, _e, id) => [{ type: "Mapping", id: `SRC-${id}` }],
    }),
    createMapping: build.mutation<
      FieldMapping,
      {
        data_source_id: string;
        source_field_path: string;
        canonical_entity: string;
        canonical_attribute: string;
        transform?: Record<string, unknown> | null;
      }
    >({
      query: (body) => ({ url: "/mappings", method: "POST", body }),
      invalidatesTags: (_r, _e, b) => [{ type: "Mapping", id: `SRC-${b.data_source_id}` }],
    }),
    confirmMapping: build.mutation<FieldMapping, { id: string; dataSourceId: string }>({
      query: ({ id }) => ({ url: `/mappings/${id}/confirm`, method: "POST" }),
      invalidatesTags: (_r, _e, { dataSourceId }) => [
        { type: "Mapping", id: `SRC-${dataSourceId}` },
      ],
    }),
    bulkConfirmMappings: build.mutation<
      BulkConfirmResult,
      { dataSourceId: string; mappingIds: string[] }
    >({
      query: ({ dataSourceId, mappingIds }) => ({
        url: "/mappings/bulk-confirm",
        method: "POST",
        body: { data_source_id: dataSourceId, mapping_ids: mappingIds },
      }),
      invalidatesTags: (_r, _e, { dataSourceId }) => [
        { type: "Mapping", id: `SRC-${dataSourceId}` },
      ],
    }),
    rejectMapping: build.mutation<FieldMapping, { id: string; dataSourceId: string }>({
      query: ({ id }) => ({ url: `/mappings/${id}/reject`, method: "POST" }),
      invalidatesTags: (_r, _e, { dataSourceId }) => [
        { type: "Mapping", id: `SRC-${dataSourceId}` },
      ],
    }),
    retireMapping: build.mutation<FieldMapping, { id: string; dataSourceId: string }>({
      query: ({ id }) => ({ url: `/mappings/${id}/retire`, method: "POST" }),
      invalidatesTags: (_r, _e, { dataSourceId }) => [
        { type: "Mapping", id: `SRC-${dataSourceId}` },
      ],
    }),
    editMapping: build.mutation<
      FieldMapping,
      {
        id: string;
        dataSourceId: string;
        body: {
          canonical_entity?: string;
          canonical_attribute?: string;
          transform?: Record<string, unknown> | null;
        };
      }
    >({
      query: ({ id, body }) => ({ url: `/mappings/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { dataSourceId }) => [
        { type: "Mapping", id: `SRC-${dataSourceId}` },
      ],
    }),
    mappingHistory: build.query<ListEnvelope<MappingChangeEvent>, string>({
      query: (mappingId) => `/mappings/${mappingId}/history`,
    }),
  }),
});

export const {
  useListDataSourcesQuery,
  useGetDataSourceQuery,
  useCreateDataSourceMutation,
  useUpdateDataSourceMutation,
  useUploadDataSourceFileMutation,
  useTestDataSourceMutation,
  useIntrospectDataSourceMutation,
  useSuggestMappingsMutation,
  useHealthHistoryQuery,
  useListMappingsQuery,
  useCreateMappingMutation,
  useConfirmMappingMutation,
  useBulkConfirmMappingsMutation,
  useRejectMappingMutation,
  useRetireMappingMutation,
  useEditMappingMutation,
  useMappingHistoryQuery,
} = dataSourcesApi;
