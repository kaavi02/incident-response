import { getIncidents } from "@/actions/incidents";
import Link from "next/link";

export default async function IncidentsPage() {
  const incidents = await getIncidents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight font-bold mb-2">
          Incidents Hub
        </h1>
        <p className="text-on-surface-variant text-body-md">
          Browse and manage all historical and active incidents.
        </p>
      </div>

      <section className="bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 text-telemetry-sm font-label-caps text-on-surface-variant bg-surface-container/10">
                <th className="px-5 py-3 font-semibold">Incident ID</th>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Tier</th>
                <th className="px-5 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {incidents.map((incident) => {
                const priorityColor =
                  incident.priority === "CRITICAL"
                    ? "text-tertiary border-tertiary/40 bg-tertiary-container/20"
                    : incident.priority === "HIGH"
                    ? "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/20"
                    : incident.priority === "MEDIUM"
                    ? "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/20"
                    : "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/20";

                return (
                  <tr
                    key={incident.id}
                    className="hover:bg-surface-container-low/50 transition-colors group cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <Link href={`/incidents/${incident.id}`} className="block">
                        <span className="text-telemetry-sm font-mono text-outline-variant group-hover:text-primary transition-colors">
                          #{incident.id.slice(0, 8)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-body-md font-semibold text-on-surface">
                      <Link href={`/incidents/${incident.id}`} className="block group-hover:text-primary transition-colors">
                        {incident.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border font-semibold ${priorityColor}`}>
                        {incident.priority}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border border-primary/40 bg-primary-container/20 text-primary font-semibold">
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border border-[#8b5cf6]/40 bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">
                        {incident.tier}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-body-sm text-on-surface-variant" suppressHydrationWarning>
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-on-surface-variant">
                    No incidents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
