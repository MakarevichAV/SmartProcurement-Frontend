import { useEffect } from "react";

import { useRefreshMutation } from "@/api/authApi";
import { useAppDispatch } from "@/app/hooks";
import { setAnonymous } from "@/features/auth/authSlice";

/**
 * On app load: try to obtain an access token from the httpOnly refresh cookie. If that
 * fails the user is anonymous and the login screen is shown. The `me` query (triggered
 * once authenticated) fills roles/permissions.
 */
export function useAuthBootstrap(): { ready: boolean } {
  const dispatch = useAppDispatch();
  const [refresh, { isUninitialized, isLoading }] = useRefreshMutation();

  useEffect(() => {
    refresh()
      .unwrap()
      .catch(() => dispatch(setAnonymous()));
  }, [refresh, dispatch]);

  return { ready: !isUninitialized && !isLoading };
}
