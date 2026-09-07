import type { ReactNode, SVGProps } from "react";

/**
 * Small in-house icon set. Deliberately hand-rolled (no icon-library dependency)
 * and kept geometric / abstract — no procurement clichés (carts, gears, brains).
 * All icons share a 24px grid, 1.75 stroke, `currentColor`, round joins.
 */

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconOverview(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </Svg>
  );
}

export function IconRisk(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function IconApprovals(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 19.5 6v5.4c0 4.6-3 7.7-7.5 9.1-4.5-1.4-7.5-4.5-7.5-9.1V6L12 3.5Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </Svg>
  );
}

export function IconPolicies(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 19 6v6c0 4.4-2.9 7.6-7 8.9-4.1-1.3-7-4.5-7-8.9V6l7-2.5Z" />
      <path d="M12 8.5v7" />
      <path d="M8.5 12h7" />
    </Svg>
  );
}

export function IconCapabilities(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2.1" />
      <path d="M4 17h4" />
      <path d="M12 17h8" />
      <circle cx="10" cy="17" r="2.1" />
    </Svg>
  );
}

export function IconDataSources(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
      <path d="M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" />
    </Svg>
  );
}

export function IconExecutions(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 12h4l2.5-6 5 15 2.5-9H21" />
    </Svg>
  );
}

export function IconAudit(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3.5h8.5L19 8v12.5H6V3.5Z" />
      <path d="M14 3.5V8h5" />
      <path d="m8.6 13.4 1.6 1.6 3.2-3.4" />
      <path d="M8.5 17.5h5" />
    </Svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.8 19.2c.7-3 2.8-4.7 5.2-4.7s4.5 1.7 5.2 4.7" />
      <path d="M16 5.4a3 3 0 0 1 0 6.2" />
      <path d="M17.4 14.8c1.9.5 3.3 2 3.8 4.4" />
    </Svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </Svg>
  );
}

export function IconSignOut(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14 5.5H6.5A1.5 1.5 0 0 0 5 7v10a1.5 1.5 0 0 0 1.5 1.5H14" />
      <path d="M16 8.5 19.5 12 16 15.5" />
      <path d="M19 12h-9" />
    </Svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </Svg>
  );
}

export function IconSuccess(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </Svg>
  );
}

export function IconWarning(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function IconDanger(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </Svg>
  );
}

export function IconInbox(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 13.5 6.5 5h11L20 13.5V19H4v-5.5Z" />
      <path d="M4 13.5h4.5l1.5 2.5h4l1.5-2.5H20" />
    </Svg>
  );
}

export function IconRoute(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <path d="M8.4 18h5.6a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-7h1.6" />
    </Svg>
  );
}
