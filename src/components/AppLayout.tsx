import { NavLink, Outlet } from "react-router-dom";

import { useLogoutMutation } from "@/api/authApi";
import { useAppSelector } from "@/app/hooks";
import { ToastHost } from "@/components/ToastHost";

const NAV = [
  ["/", "Dashboard"],
  ["/risks", "Risks / Recommendations"],
  ["/approvals", "Approvals"],
  ["/policies", "Autopilot / Policies"],
  ["/capabilities", "Capabilities"],
  ["/data-sources", "Data Sources"],
  ["/executions", "Executions / Orders"],
  ["/audit", "Audit"],
  ["/users", "Users & Roles"],
] as const;

export function AppLayout() {
  const me = useAppSelector((s) => s.auth.me);
  const [logout] = useLogoutMutation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-semibold">Smart Procurement</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">
            {me ? `${me.full_name} · ${me.roles.join(", ")}` : ""}
          </span>
          <button className="rounded border px-2 py-1" onClick={() => logout()}>
            Sign out
          </button>
        </div>
      </header>
      <div className="flex">
        <nav className="w-56 shrink-0 border-r p-3 text-sm">
          {NAV.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `block rounded px-2 py-1 ${isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <ToastHost />
    </div>
  );
}
