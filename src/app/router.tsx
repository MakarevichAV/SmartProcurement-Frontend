import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { NAV_ITEMS } from "@/components/nav";
import { Placeholder } from "@/components/Placeholder";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { DataSourceDetailPage } from "@/features/datasources/DataSourceDetailPage";
import { DataSourcesPage } from "@/features/datasources/DataSourcesPage";
import { DomainEntityPage } from "@/features/domain/DomainEntityPage";
import { DomainMapPage } from "@/features/domain/DomainMapPage";
import { RiskDetailPage } from "@/features/risks/RiskDetailPage";
import { RisksPage } from "@/features/risks/RisksPage";

/**
 * Route table. The shell + auth land in Phase 2; feature pages are filled in per
 * user story (see specs/001-smart-procurement/tasks.md). Screens still scoped
 * for a later phase fall back to `Placeholder` from the shared nav config.
 *
 * `/risks` is built as of Phase 4/T076, but only the L1/L2 slice: observing risks,
 * their evidence and AI explanation, and dismissing them. The sidebar label stays
 * "Risks & recommendations" (kept, not renamed — see tasks.md T076) since US3 adds
 * recommendations to this same screen; the label already describes the full area,
 * consistent with how "Approvals"/"Policies" already name their eventual scope.
 */
const BUILT_PATHS = new Set(["/", "/data-sources", "/domain", "/risks"]);

const placeholderRoutes = NAV_ITEMS.filter((item) => !BUILT_PATHS.has(item.path)).map((item) => ({
  path: item.path.replace(/^\//, ""),
  element: <Placeholder title={item.title} description={item.description} icon={item.icon} />,
}));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "data-sources", element: <DataSourcesPage /> },
      { path: "data-sources/:id", element: <DataSourceDetailPage /> },
      { path: "domain", element: <DomainMapPage /> },
      { path: "domain/:entity", element: <DomainEntityPage /> },
      { path: "risks", element: <RisksPage /> },
      { path: "risks/:id", element: <RiskDetailPage /> },
      ...placeholderRoutes,
    ],
  },
]);
