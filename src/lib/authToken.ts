/**
 * In-memory holder for the short-lived access token.
 *
 * The token is deliberately kept in a module variable, **never** in `localStorage` /
 * `sessionStorage` (those are readable by any script on the page — XSS exposure). On a hard
 * reload the access token is gone and the app re-obtains one via `POST /auth/refresh`, whose
 * refresh token lives in an httpOnly cookie the backend sets. The full login / refresh /
 * silent-renew flow is implemented in `src/features/auth/` (tasks.md T037).
 */

let accessToken: string | null = null;

export const authToken = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token;
  },
  clear: (): void => {
    accessToken = null;
  },
};
