import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import IncidentCard from "@/components/IncidentCard";
import { getIncidents } from "@/actions/incidents";
import Link from "next/link";
import ExportDashboardCsvButton from "@/components/ExportDashboardCsvButton";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const timeFilter = resolvedParams.time;
  
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let incidents = await getIncidents();
  
  // Apply time filter
  if (timeFilter === "24h") {
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    incidents = incidents.filter(i => new Date(i.createdAt) > yesterday);
  }
  
  // Calculate dynamic metrics
  const openIncidentsCount = incidents.filter(i => i.status !== "CLOSED" && i.status !== "RESOLVED").length;
  const criticalCount = incidents.filter(i => i.priority === "CRITICAL" && i.status !== "RESOLVED" && i.status !== "CLOSED").length;
  const escalatedCount = incidents.filter(i => i.tier !== "L1" && i.status !== "RESOLVED" && i.status !== "CLOSED").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-caps font-label-caps text-primary mb-1">
            <span className="material-symbols-outlined text-[14px]">radar</span>
            <span>SITUATION REPORT // LIVE FEED</span>
            <span className="text-outline-variant">•</span>
            <span className="text-on-surface-variant">AUTO-REFRESH: REALTIME</span>
          </div>
          <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight font-bold">
            Incident Response Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-surface-container border border-outline-variant/40 p-1">
            <Link 
              href="/"
              className={`px-3 py-1 rounded text-body-sm font-body-sm font-medium shadow-sm transition-colors ${!timeFilter ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Realtime
            </Link>
            <Link 
              href="/?time=24h"
              className={`px-3 py-1 rounded text-body-sm font-body-sm font-medium shadow-sm transition-colors ${timeFilter === '24h' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Past 24h
            </Link>
          </div>
          <ExportDashboardCsvButton incidents={incidents} />
        </div>
      </div>

      <section
        aria-label="Incident Overview Metrics"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase">
              Open Incidents
            </span>
            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-caps font-label-caps bg-tertiary-container/20 text-tertiary border border-tertiary/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tertiary"></span>
                </span>
                CRITICAL P0
              </span>
            )}
          </div>
          <div className="text-metric-display font-metric-display text-on-surface">
            {openIncidentsCount}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase">
              Resolved (24h)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-caps font-label-caps bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              99.2% SLA
            </span>
          </div>
          <div className="text-metric-display font-metric-display text-on-surface">
            {incidents.length - openIncidentsCount}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-surface-container-low/70 backdrop-blur-xl border border-outline-variant/30 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-wider uppercase">
              Escalated
            </span>
            {escalatedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-caps font-label-caps bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
                <span className="material-symbols-outlined text-[14px]">
                  crisis_alert
                </span>
                WAR ROOM ON
              </span>
            )}
          </div>
          <div className="text-metric-display font-metric-display text-on-surface">
            {escalatedCount}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="border-b border-outline-variant/30 bg-surface-container/30 px-5 py-4 flex items-center justify-between">
          <h2 className="text-headline-md font-headline-md font-semibold text-on-surface">
            Active Incidents Stream
          </h2>
          <div className="flex gap-2">
             <span className="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20">All</span>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {incidents.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant">
              No active incidents found.
            </div>
          ) : (
            incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident as any}
                userId={(session?.user as any)?.id}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
