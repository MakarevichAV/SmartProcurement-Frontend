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

Visual foundation: semantic design tokens as CSS custom properties (light + dark, wired to
Tailwind via `@theme inline`) and IBM Plex Sans / IBM Plex Mono loaded from Google Fonts. No
component or icon library — the UI primitives and icon set are in-repo.

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
  the backend's unified error model. The silent session probe on load is exempt — a `401`
  there just means "not signed in yet" and stays quiet.

## Current UI (Phase 2 shell + Phase 3 / US1)

Phase 2 delivered the authenticated shell and a UI/design pass that established a reusable
visual foundation. **Phase 3 / User Story 1** then added the first two working business
screens — **Data sources** and **Domain map** — on top of that foundation (one new shared
primitive, `Select`). Everything else remains an intentional placeholder.

Visual foundation:

- **Design tokens** in `src/index.css` — navy structural frame, a rationed green accent, and
  semantic amber/red mirroring LORM's `allow | ask | deny`. Full dark-mode token set,
  activated by `prefers-color-scheme` (no app state). Global `:focus-visible` ring and
  `prefers-reduced-motion` handling.
- **Reusable primitives** in `src/components/ui/` — Button, TextField, **Select**, Card,
  Badge, Alert, Spinner, Skeleton, EmptyState, PageHeader / SectionHeader, StatTile, Table
  set, a hand-rolled geometric icon set, and a `cn()` class joiner. `src/components/brand/`
  holds the "SP" monogram (LogoMark / LogoLockup).

Screens:

- **Login** — navy split-screen brand panel + form; `type="email"` / `required` fields and an
  inline error alert. The auth flow itself is unchanged.
- **Authenticated app shell** (`AppLayout`) — navy sidebar, sticky header, max-width
  workspace. **Responsive**: the sidebar is a persistent rail from the `lg` breakpoint and an
  overlay drawer below it, closing on navigation, `Escape`, or a scrim click.
- **Sidebar** — the nine nav targets grouped by the constitution's operational layers, with a
  green active-edge indicator and hover / active / focus states.
- **Header** — current section title, an initials avatar, the signed-in user's name and role
  label(s), and **Sign out**.
- **Dashboard shell** (`src/features/dashboard/`) — page header, four stat tiles rendering
  `—` placeholders, and an empty "Recent activity" panel. Structure only, no data yet.
- Protected routing (session-restore splash → login → shell) and a toast host for API errors.
- The generated API-types workflow (`npm run gen:api` → `src/api/schema.d.ts`, git-ignored and
  regenerated on demand).

### US1 screens

- **Data sources** (`src/features/datasources/`, `src/api/dataSourcesApi.ts`) — list with
  health badges; a Connect form (file / REST / SQL, with client-side file read); a per-source
  page that runs **Test connection**, **Introspect schema**, **Suggest mappings** and
  **Upload file**; a **mapping-review table** with per-row Confirm / Edit / Reject / Retire
  and an "add mapping by hand" form; an observability panel (current health + recorded gaps).
- **Domain map** (`src/features/domain/`, `src/api/domainApi.ts`) — a grid of entity cards
  (row count, `fresh` / `stale` / `lost` breakdown, source count), a relationship list, and
  an entity-detail table showing each row's columns, observability badge and source
  provenance. Empty states are honest ("no rows", "the domain map is empty — connect a
  source").

**Screens after US1 are still placeholders.** Each remaining nav target (Risks &
recommendations, Approvals, Policies, Capabilities, Executions, Audit, Users & roles) renders
a "Planned for a later phase" page; those are built in their corresponding phases — see
`specs/001-smart-procurement/tasks.md`.

## Project layout

```
src/
├── app/         store, router, typed hooks
├── api/         baseApi (RTK Query) + authApi; generated schema.d.ts (git-ignored)
├── features/    auth/ (login, bootstrap, slice); dashboard/ (dashboard shell);
│                other business features land here per phase
├── components/  AppLayout, Header, Sidebar, ProtectedRoute, ToastHost, Placeholder,
│                nav (nav config); brand/ (SP monogram); ui/ (design-system primitives)
├── index.css    design tokens (light + dark) + Tailwind wiring
└── lib/         authToken (in-memory), cn (class joiner), errorToast, errorMiddleware
```
