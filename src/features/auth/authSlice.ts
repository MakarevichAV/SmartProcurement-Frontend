import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { authApi } from "@/api/authApi";
import type { MeResponse } from "@/api/authApi";

export type AuthStatus = "unknown" | "anonymous" | "authenticated";

interface AuthState {
  status: AuthStatus;
  me: MeResponse | null;
}

const initialState: AuthState = { status: "unknown", me: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAnonymous(state) {
      state.status = "anonymous";
      state.me = null;
    },
    setMe(state, action: PayloadAction<MeResponse>) {
      state.status = "authenticated";
      state.me = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.me.matchFulfilled, (state, { payload }) => {
        state.status = "authenticated";
        state.me = payload;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.status = "anonymous";
        state.me = null;
      });
  },
});

export const { setAnonymous, setMe } = authSlice.actions;
export default authSlice.reducer;
