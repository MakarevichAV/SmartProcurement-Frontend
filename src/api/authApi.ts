import { baseApi } from "@/api/baseApi";
import { authToken } from "@/lib/authToken";

export interface MeResponse {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
  permissions: string[];
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        authToken.set(data.access_token);
      },
    }),
    refresh: build.mutation<TokenResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        authToken.set(data.access_token);
      },
    }),
    logout: build.mutation<{ status: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          authToken.clear();
        }
      },
    }),
    me: build.query<MeResponse, void>({
      query: () => "/me",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation, useMeQuery } = authApi;
