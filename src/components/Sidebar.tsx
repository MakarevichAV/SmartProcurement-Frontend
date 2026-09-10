import { NavLink } from "react-router-dom";

import { LogoLockup } from "@/components/brand/Logo";
import { NAV_GROUPS } from "@/components/nav";
import { IconClose } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/**
 * Primary navigation. Persistent rail on desktop; an overlay drawer under lg,
 * controlled by `open` / `onClose` from the layout.
 *
 * Items are grouped by the constitution's operational layers so the information
 * architecture itself tells you how the system is organised.
 */
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Scrim — mobile only */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-navy/50 transition-opacity duration-150 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-navy-line bg-navy",
          "transition-transform duration-200 ease-out lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-navy-line px-4">
          <NavLink to="/" onClick={onClose} className="rounded-[var(--radius-sm)]">
            <LogoLockup tone="on-navy" descriptor={false} />
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="-mr-1 inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <IconClose size={18} />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.04em] text-white/35">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            "group relative flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-[13px] transition-colors",
                            isActive
                              ? "bg-white/10 font-medium text-white"
                              : "text-white/62 hover:bg-white/5 hover:text-white",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={cn(
                                "absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-brand transition-opacity",
                                isActive ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <Icon
                              size={16}
                              className={cn(
                                "shrink-0 transition-colors",
                                isActive ? "text-brand" : "text-white/45 group-hover:text-white/75",
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-navy-line px-5 py-3">
          <p className="font-mono text-[11px] text-white/35">Smart Procurement</p>
        </div>
      </aside>
    </>
  );
}
