import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconApprovals, IconCapabilities, IconExecutions, IconRisk } from "@/components/ui/icons";
import { PageHeader, SectionHeader } from "@/components/ui/PageHeader";
import { StatTile } from "@/components/ui/StatTile";

const TILES = [
  {
    label: "Capabilities in autopilot",
    note: "L4–L5 capabilities acting without prompt",
    icon: <IconCapabilities size={16} />,
  },
  {
    label: "Approvals awaiting you",
    note: "Actions and policies pending a decision",
    icon: <IconApprovals size={16} />,
  },
  {
    label: "Executions in last 24h",
    note: "Dispatched actions and their outcomes",
    icon: <IconExecutions size={16} />,
  },
  {
    label: "Open risks",
    note: "Diagnosed supply risks not yet resolved",
    icon: <IconRisk size={16} />,
  },
];

export function DashboardPage() {
  const me = useAppSelector((s) => s.auth.me);
  const firstName = me?.full_name?.trim().split(/\s+/)[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
        description="Once data sources and execution are connected, this is where autonomy levels, the decisions waiting on you, and recent system activity come together."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {TILES.map((t) => (
          <StatTile key={t.label} label={t.label} value="—" note={t.note} icon={t.icon} />
        ))}
      </div>

      <div className="mt-8">
        <SectionHeader
          title="Recent activity"
          description="Executions, approvals and audit entries, newest first."
        />
        <Card className="mt-3">
          <EmptyState
            title="Nothing to show yet"
            description="Activity will appear here after Phase 3 connects live procurement data and turns on the decision pipeline."
          />
        </Card>
      </div>
    </>
  );
}
