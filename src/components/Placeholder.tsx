import type { ComponentType } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type { IconProps } from "@/components/ui/icons";
import { IconRoute } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";

/**
 * Stand-in for a business screen that is scoped for a later phase. It states
 * plainly what the screen will do (from the nav config) rather than pretending
 * to be under construction.
 */
export function Placeholder({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: ComponentType<IconProps>;
}) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        meta={<Badge tone="neutral">Planned for a later phase</Badge>}
      />
      <Card>
        <EmptyState
          icon={Icon ? <Icon size={20} /> : <IconRoute size={20} />}
          title="Not built yet"
          description="This screen arrives in a later delivery phase. The navigation, roles and access checks around it are already in place."
        />
      </Card>
    </>
  );
}
