import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { NAV_ITEMS } from "@/components/nav";
import { Placeholder } from "@/components/Placeholder";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { DataSourceDetailPage } from "@/features/datasources/DataSourceDetailPage";
import { DataSourcesPage } from "@/features/datasources/DataSourcesPage";
import { DomainEntityPage } from "@/features/domain/DomainEntityPage";
import { DomainMapPage } from "@/features/domain/DomainMapPage";

/**
 * Route table. The shell + auth land in Phase 2; feature pages are filled in per
 * user story (see specs/001-smart-procurement/tasks.md). Screens still scoped
 * for a later phase fall back to `Placeholder` from the shared nav config.
 */
const BUILT_PATHS = new Set(["/", "/data-sources", "/domain"]);

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
      ...placeholderRoutes,
    ],
  },
]);
