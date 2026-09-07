# SmartProcurement-Frontend

The web UI for Smart Procurement, used by the **Administrator**, **Buyer**, and **Approver**
roles. It is a single-page app that talks to the backend only through its REST/OpenAPI
contract and holds **no trusted authorization logic** — every permission and state-changing
check lives in the backend.

Spec, plan and contracts live in the top-level **SmartProcurement** repository
(`specs/001-smart-procurement/`). This repo contains only the frontend application.

## Stack

React 18 · TypeScript · Vite 5 · Redux Toolkit + RTK Query · Tailwind CSS v4 ·
ESLint (flat config) + Prettier · `openapi-typescript` for generated API types.

## Local setup

Prerequisites: Node 20+ (developed against Node 24). The backend must be running for anything
past the login screen — see `backend/README.md`.

```sh
npm install
cp .env.example .env
npm run dev            # http://localhost:5173
```

### Environment configuration (`frontend/.env`)

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | backend origin the app calls | `http://localhost:8000` |

`.env` is git-ignored. Use `http://localhost:5173` (not `127.0.0.1`) in the browser so it
stays same-site with the backend and the refresh cookie is sent.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | type-check (`tsc` app + node configs) then production bundle |
| `npm run preview` | serve the production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier `--write` |
| `npm run gen:api` | regenerate `src/api/schema.d.ts` from the running backend's `/openapi.json` |

## How authentication works (high level)

- **Login** posts email + password to `POST /api/v1/auth/login`. The backend returns a
  short-lived **access token** (kept **in memory only**, never in `localStorage`) and sets a
  **refresh token as an httpOnly cookie**.
- On load, the app silently calls `POST /api/v1/auth/refresh`; if the cookie is valid it gets
  a fresh access token and loads the user profile (`GET /api/v1/me`), otherwise it shows the
  login screen.
- After a successful login the app fetches `/me`, which flips the auth state and swaps the
  login screen for the authenticated shell.
- **Sign out** calls `/auth/logout` (revokes the refresh token, clears the cookie) and resets
  the client cache.
- A `401` from any call clears the in-memory token; backend errors are shown as toasts using
  the backend's unified error model.

## Current UI (Phase 2)

Implemented:

- **Login** screen.
- **Authenticated app shell**: a header showing the signed-in user's name and role(s) and a
  **Sign out** button.
- **Navigation** for the nine product areas: Dashboard, Risks / Recommendations, Approvals,
  Autopilot / Policies, Capabilities, Data Sources, Executions / Orders, Audit, Users & Roles.
- Protected routing (loading → login → shell) and a toast host for API errors.
- The generated API-types workflow (`npm run gen:api` → `src/api/schema.d.ts`, git-ignored and
  regenerated on demand).

**The business screens are intentionally placeholders.** Every navigation target currently
renders a "coming in a later phase" placeholder. The real screens (data-source onboarding,
risk/recommendation views, approval queue, policy editor, capability management, executions,
audit trail, user administration) are built in their corresponding phases —
see `specs/001-smart-procurement/tasks.md`.

## Project layout

```
src/
├── app/         store, router, typed hooks
├── api/         baseApi (RTK Query) + authApi; generated schema.d.ts (git-ignored)
├── features/    auth/ (login, bootstrap, slice); business features land here per phase
├── components/  AppLayout, ProtectedRoute, ToastHost, Placeholder
└── lib/         authToken (in-memory), errorToast, errorMiddleware
```
