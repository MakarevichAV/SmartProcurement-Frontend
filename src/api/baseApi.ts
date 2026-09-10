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

type RawResult = Awaited<ReturnType<typeof rawBaseQuery>>;

function normaliseError(result: RawResult): RawResult & { error?: { normalised?: ApiError } } {
  if (result.error && isApiError(result.error.data)) {
    return { ...result, error: { ...result.error, normalised: result.error.data.error } };
  }
  return result;
}

function isAuthEndpoint(args: string | FetchArgs): boolean {
  const url = typeof args === "string" ? args : args.url;
  return url.startsWith("/auth/");
}

/**
 * Silent re-auth: on load *and on a 401* the SPA re-obtains an access token from the
 * httpOnly refresh cookie (tasks.md T037). One refresh attempt is shared across all
 * requests that 401 concurrently. Returns whether a fresh token is now in memory.
 */
let refreshInFlight: Promise<boolean> | null = null;

async function trySilentRefresh(
  api: Parameters<typeof rawBaseQuery>[1],
  extraOptions: Parameters<typeof rawBaseQuery>[2],
): Promise<boolean> {
  refreshInFlight ??= (async () => {
    const result = await rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);
    const data = result.data as { access_token?: string } | undefined;
    if (!result.error && data?.access_token) {
      authToken.set(data.access_token);
      return true;
    }
    return false;
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

/**
 * Base query: raw fetch → on 401 for a non-auth route, one silent refresh + retry →
 * error normalisation to `{ error: { normalised: ApiError } }`.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError & { normalised?: ApiError }
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401 && !isAuthEndpoint(args)) {
    const refreshed = await trySilentRefresh(api, extraOptions);
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }
  return normaliseError(result);
};

/** Root RTK Query API. Feature slices extend it via `injectEndpoints`. */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Enterprise",
    "User",
    "Dashboard",
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
