import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { NAV_ITEMS } from "@/components/nav";
import { Placeholder } from "@/components/Placeholder";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

/**
 * Route table. The shell + auth land in Phase 2; feature pages are filled in per
 * user story (see specs/001-smart-procurement/tasks.md). Screen titles and
 * descriptions come from the shared nav config in `components/nav`.
 */
const featureRoutes = NAV_ITEMS.filter((item) => item.path !== "/").map((item) => ({
  path: item.path.replace(/^\//, ""),
  element: <Placeholder title={item.title} description={item.description} icon={item.icon} />,
}));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <DashboardPage /> }, ...featureRoutes],
  },
]);
