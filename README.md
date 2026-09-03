# SmartProcurement-Frontend

Web UI for Smart Procurement (Administrator / Buyer / Approver). React 18 · TypeScript · Vite ·
Redux Toolkit + RTK Query · Tailwind CSS.

Spec, plan, and tasks live in the top-level **SmartProcurement** repository
(`specs/001-smart-procurement/`). The frontend talks to the backend only through the
REST/OpenAPI contract and holds no trusted authorization logic.

## Quick start

```sh
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle
npm run lint
npm run gen:api    # regenerate src/api/schema.d.ts from the running backend's /openapi.json
```

## Status

Phase 1 (scaffolding) complete: Vite + React + TS + Tailwind, Redux store, router shell,
RTK Query base API with bearer-token auth and unified-error normalisation, ESLint + Prettier,
OpenAPI type-gen script. Feature areas per `specs/001-smart-procurement/tasks.md`.
