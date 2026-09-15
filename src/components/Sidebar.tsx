"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 z-50 bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border-r border-outline-variant/30 shadow-2xl flex flex-col justify-between px-4 py-5">
      <div>
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container border border-primary/40 shadow-[0_0_15px_-2px_rgba(6,182,212,0.4)]">
            <span
              className="material-symbols-outlined text-primary"
              data-icon="shield"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              shield
            </span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          </div>
          <div>
            <div className="text-headline-sm font-headline-sm font-bold tracking-widest text-primary dark:text-primary">
              AEGIS // IRCC
            </div>
            <div className="text-label-caps font-label-caps text-on-surface-variant tracking-wider">
              SOC Command Center
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${
              pathname === "/"
                ? "bg-primary-container/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: '"FILL" 0' }}
            >
              dashboard
            </span>
            <span className="text-body-md font-body-md tracking-wide">
              Overview
            </span>
          </Link>
          <Link
            href="/incidents"
            className={`flex items-center justify-between px-3 py-2.5 rounded-md transition-all duration-200 group ${
              pathname?.startsWith("/incidents")
                ? "bg-primary-container/10 text-primary border border-primary/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: '"FILL" 0' }}
              >
                gavel
              </span>
              <span className="text-body-md font-body-md tracking-wide">
                Active Incidents
              </span>
            </div>
            <span className="bg-error/10 text-error border border-error/20 text-telemetry-sm font-telemetry-sm px-1.5 py-0.5 rounded-sm animate-pulse">
              3
            </span>
          </Link>

          <Link
            href="/incidents/new"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group mt-2 ${
              pathname === "/incidents/new"
                ? "bg-primary text-on-primary shadow-lg"
                : "bg-surface-container-high text-on-surface hover:bg-primary/90 hover:text-on-primary shadow-sm"
            }`}
          >
            <span
              className="material-symbols-outlined group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              add_circle
            </span>
            <span className="text-body-md font-body-md font-semibold tracking-wide">
              Post an Incident
            </span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group mt-4 border-t border-outline-variant/20 pt-4 ${
                pathname?.startsWith("/admin")
                  ? "bg-tertiary-container/10 text-tertiary border border-tertiary/20 shadow-[inset_0_0_10px_rgba(255,127,139,0.1)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: '"FILL" 0' }}
              >
                admin_panel_settings
              </span>
              <span className="text-body-md font-body-md tracking-wide">
                Admin Panel
              </span>
            </Link>
          )}
        </nav>
      </div>
      <div>
        <div className="px-3 py-3 mb-2 rounded-md bg-surface-container/50 border border-outline-variant/20">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-secondary text-sm"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              dns
            </span>
            <span className="text-telemetry-sm font-telemetry-sm text-secondary">
              SYSTEM STATUS
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-telemetry-sm font-telemetry-sm text-on-surface-variant">
              Node 01 [Core]
            </span>
            <span className="text-telemetry-sm font-telemetry-sm text-primary">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
