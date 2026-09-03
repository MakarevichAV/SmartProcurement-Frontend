import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

import { authToken } from "@/lib/authToken";

/** Backend base URL — overridable via `VITE_API_BASE_URL`. */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_V1 = `${API_BASE_URL}/api/v1`;

/** Shape of the backend's unified error model (see contracts/rest-api.md). */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | null;
  correlation_id: string;
}

function isApiError(data: unknown): data is { error: ApiError } {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "object"
  );
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_V1,
  credentials: "include", // send the httpOnly refresh cookie to /auth/refresh
  prepareHeaders: (headers) => {
    // Access token is held in memory only (see lib/authToken) — never in web storage.
    const token = authToken.get();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/** Wraps the raw base query, normalising errors to `{ status, data: ApiError }`. */
const baseQueryWithErrorNormalisation: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError & { normalised?: ApiError }
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && isApiError(result.error.data)) {
    return {
      ...result,
      error: { ...result.error, normalised: result.error.data.error },
    };
  }
  return result;
};

/** Root RTK Query API. Feature slices extend it via `injectEndpoints`. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorNormalisation,
  tagTypes: [
    "Enterprise",
    "User",
    "DataSource",
    "Mapping",
    "DomainMap",
    "Risk",
    "Recommendation",
    "Approval",
    "Policy",
    "Capability",
    "Execution",
    "Audit",
  ],
  endpoints: () => ({}),
});
