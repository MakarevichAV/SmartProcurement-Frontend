import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { Placeholder } from "@/components/Placeholder";

/**
 * Route table. The shell + auth land in Phase 2; feature pages are filled in per user story
 * (see specs/001-smart-procurement/tasks.md).
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Placeholder title="Dashboard" /> },
      { path: "risks", element: <Placeholder title="Risks / Recommendations" /> },
      { path: "approvals", element: <Placeholder title="Approvals" /> },
      { path: "policies", element: <Placeholder title="Autopilot / Policies" /> },
      { path: "capabilities", element: <Placeholder title="Capabilities" /> },
      { path: "data-sources", element: <Placeholder title="Data Sources" /> },
      { path: "executions", element: <Placeholder title="Executions / Orders" /> },
      { path: "audit", element: <Placeholder title="Audit" /> },
      { path: "users", element: <Placeholder title="Users & Roles" /> },
    ],
  },
]);
