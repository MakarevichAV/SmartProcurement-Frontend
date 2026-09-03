import { createBrowserRouter } from "react-router-dom";

import { App } from "@/App";

/**
 * Application route table. Phase 1 ships the shell + a placeholder landing route;
 * feature routes (dashboard, risks, approvals, policies, …) are added per user story.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <p className="p-4">Smart Procurement — shell ready.</p> }],
  },
]);
