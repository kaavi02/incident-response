"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "next-themes";

export default function TopNav({ recentActivity = [] }: { recentActivity?: any[] }) {
  const { data: session } = useSession();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div
          className={`relative group flex items-center transition-all duration-300 ${
            isSearchFocused ? "shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]" : ""
          }`}
        >
          <span
            className="material-symbols-outlined absolute left-4 text-on-surface-variant group-hover:text-primary transition-colors"
            style={{ fontVariationSettings: '"FILL" 0' }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search incident ID, hostname, IP..."
            className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-full py-2.5 pl-12 pr-12 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          <div className="absolute right-4 flex items-center gap-1">
            <span className="text-telemetry-sm font-telemetry-sm text-on-surface-variant/50 border border-outline-variant/30 rounded px-1.5 py-0.5">
              ⌘
            </span>
            <span className="text-telemetry-sm font-telemetry-sm text-on-surface-variant/50 border border-outline-variant/30 rounded px-1.5 py-0.5">
              K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-6">
        <div className="flex items-center gap-4 border-r border-outline-variant/30 pr-6">
          
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative text-on-surface-variant hover:text-primary transition-colors ${isNotificationsOpen ? 'text-primary' : ''}`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 0' }}
              >
                notifications
              </span>
              {recentActivity.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-error animate-pulse"></span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface-container">
                  <h3 className="text-body-md font-semibold text-on-surface">Recent Activity</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, i) => (
                      <Link 
                        key={activity.id + i} 
                        href={`/incidents/${activity.id}`}
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-body-sm font-semibold text-on-surface truncate pr-2">
                            {activity.title}
                          </span>
                          <span className="text-telemetry-sm text-on-surface-variant whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">
                            {activity.status}
                          </span>
                          <span className="text-telemetry-sm font-mono text-on-surface-variant opacity-70">
                            {activity.id.slice(0, 8)}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-on-surface-variant text-body-sm">
                      No recent activity.
                    </div>
                  )}
                </div>
                <Link 
                  href="/incidents" 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="block px-4 py-3 text-center text-body-sm font-semibold text-primary hover:bg-surface-container transition-colors border-t border-outline-variant/30"
                >
                  View All Incidents
                </Link>
              </div>
            )}
          </div>
          {(session?.user as any)?.role === "ADMIN" && (
            <Link href="/admin" className="text-on-surface-variant hover:text-primary transition-colors flex items-center">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 0' }}
              >
                settings
              </span>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-body-md font-headline-sm font-semibold text-on-surface leading-none truncate max-w-[150px]">
              {session?.user?.name || session?.user?.email?.split('@')[0] || "User"}
            </div>
            <div className="text-telemetry-sm font-telemetry-sm text-primary tracking-wide">
              {(session?.user as any)?.role || "RESPONDER"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-surface-container border border-primary/30 flex items-center justify-center overflow-hidden">
              <span className="text-body-md font-bold text-primary uppercase">
                {(session?.user?.name || session?.user?.email || "U").substring(0, 2)}
              </span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors flex items-center justify-center"
              title="Log out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
