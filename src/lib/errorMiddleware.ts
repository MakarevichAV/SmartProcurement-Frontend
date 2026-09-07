/**
 * RTK Query error middleware (T038).
 *
 * Turns every rejected query/mutation into a toast rendered from the unified error model,
 * and clears the in-memory access token on a 401 so the app falls back to the login screen.
 */
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";

import type { ApiError } from "@/api/baseApi";
import { authToken } from "@/lib/authToken";
import { showApiError, showMessage } from "@/lib/errorToast";

interface RejectedPayload {
  status?: number | string;
  data?: { error?: ApiError };
  normalised?: ApiError;
}

export const errorMiddleware: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as RejectedPayload;
    const apiError = payload.normalised ?? payload.data?.error;

    if (payload.status === 401) {
      authToken.clear();
    }

    // Silent for the bootstrap refresh call — no session yet is expected.
    const isBootstrapRefresh = typeof action.type === "string" && action.type.includes("refresh");

    if (apiError && !(payload.status === 401 && isBootstrapRefresh)) {
      showApiError(apiError);
    } else if (!apiError && !isBootstrapRefresh) {
      showMessage("Network error — please retry.");
    }
  }
  return next(action);
};
