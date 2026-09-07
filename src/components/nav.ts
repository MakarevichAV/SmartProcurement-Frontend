import type { ComponentType } from "react";

import type { IconProps } from "@/components/ui/icons";
import {
  IconApprovals,
  IconAudit,
  IconCapabilities,
  IconDataSources,
  IconExecutions,
  IconOverview,
  IconPolicies,
  IconRisk,
  IconUsers,
} from "@/components/ui/icons";

export interface NavItem {
  /** Router path. "/" is the index route. */
  path: string;
  /** Short label for the sidebar. */
  label: string;
  /** Full page title (PageHeader / document context). */
  title: string;
  /** One line describing what the screen does — used by the planned-screen state. */
  description: string;
  icon: ComponentType<IconProps>;
}

export interface NavGroup {
  /** Mirrors the constitution's operational layers. */
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        path: "/",
        label: "Dashboard",
        title: "Dashboard",
        description:
          "An at-a-glance view of autonomy levels, decisions waiting on you, and recent system activity.",
        icon: IconOverview,
      },
    ],
  },
  {
    label: "Decisioning",
    items: [
      {
        path: "/risks",
        label: "Risks & recommendations",
        title: "Risks & recommendations",
        description:
          "Diagnosed supply risks and the ordering recommendations the system proposes in response.",
        icon: IconRisk,
      },
      {
        path: "/approvals",
        label: "Approvals",
        title: "Approvals",
        description:
          "The review queue for actions and policies that need a human decision before they take effect.",
        icon: IconApprovals,
      },
    ],
  },
  {
    label: "Autonomy",
    items: [
      {
        path: "/policies",
        label: "Policies",
        title: "Autopilot & policies",
        description:
          "Machine-readable policies that set the bounds within which the system may act on its own.",
        icon: IconPolicies,
      },
      {
        path: "/capabilities",
        label: "Capabilities",
        title: "Capabilities",
        description:
          "The eight procurement capabilities and the autonomy level (L0–L5) each one currently holds.",
        icon: IconCapabilities,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        path: "/data-sources",
        label: "Data sources",
        title: "Data sources",
        description:
          "Connected systems of record — inventory, demand, suppliers — and how their fields map to the domain model.",
        icon: IconDataSources,
      },
      {
        path: "/executions",
        label: "Executions",
        title: "Executions & orders",
        description:
          "Every dispatched action and its outcome, from simulated runs to live purchase orders.",
        icon: IconExecutions,
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        path: "/audit",
        label: "Audit",
        title: "Audit",
        description:
          "The append-only record of every L4 and L5 action, kept with its full decision context.",
        icon: IconAudit,
      },
      {
        path: "/users",
        label: "Users & roles",
        title: "Users & roles",
        description:
          "People with access to Smart Procurement and the roles that grant their permissions.",
        icon: IconUsers,
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
