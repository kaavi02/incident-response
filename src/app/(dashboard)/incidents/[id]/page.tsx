import { getIncidentById } from "@/actions/incidents";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import Link from "next/link";
import CommentsSection from "@/components/CommentsSection";
import ExportPdfButton from "@/components/ExportPdfButton";
import PrintableReport from "@/components/PrintableReport";

export default async function IncidentWarRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const incident = await getIncidentById(id);

  if (!incident) {
    notFound();
  }

  const priorityColor =
    incident.priority === "CRITICAL"
      ? "text-tertiary border-tertiary/40 bg-tertiary-container/20"
      : incident.priority === "HIGH"
      ? "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/20"
      : incident.priority === "MEDIUM"
      ? "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/20"
      : "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/20";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/incidents" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-body-md font-semibold">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Hub
        </Link>
        <ExportPdfButton targetId="printable-report" filename={`Incident_${incident.id.slice(0,8)}`} />
      </div>

      <div id="pdf-report-container" className="bg-surface-container-low/70 rounded-2xl border border-outline-variant/30 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header Section */}
        <div className="border-b border-outline-variant/30 pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
              {incident.title}
            </h1>
            <div className="flex gap-2">
              <span className={`px-2.5 py-1 rounded-md text-label-caps font-semibold border ${priorityColor}`}>
                {incident.priority}
              </span>
              <span className="px-2.5 py-1 rounded-md text-label-caps font-semibold border border-[#8b5cf6]/40 bg-[#8b5cf6]/20 text-[#8b5cf6]">
                {incident.tier}
              </span>
              <span className="px-2.5 py-1 rounded-md text-label-caps font-semibold border border-primary/40 bg-primary-container/20 text-primary">
                {incident.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-telemetry-sm text-on-surface-variant">
            <div>
              <span className="block font-label-caps mb-1 opacity-70">Incident ID</span>
              <span className="font-mono text-on-surface">{incident.id}</span>
            </div>
            <div>
              <span className="block font-label-caps mb-1 opacity-70">Reported By</span>
              <span className="text-on-surface">{incident.reporter.name || incident.reporter.email}</span>
            </div>
            <div>
              <span className="block font-label-caps mb-1 opacity-70">Timestamp</span>
              <span className="text-on-surface" suppressHydrationWarning>
                {new Date(incident.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface mb-3">Description</h3>
          <p className="text-body-lg text-on-surface-variant leading-relaxed whitespace-pre-wrap bg-surface-container/30 p-4 rounded-xl border border-outline-variant/20">
            {incident.description}
          </p>
        </div>

        {/* Escalation Timeline */}
        {incident.escalations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface mb-4">Escalation Timeline</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
              {incident.escalations.map((esc) => (
                <div key={esc.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/50 bg-surface-container text-[#f59e0b] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_up</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant/30 bg-surface-container/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-on-surface">Escalated to {esc.newTier}</span>
                      <span className="text-telemetry-sm text-on-surface-variant font-mono" suppressHydrationWarning>
                        {new Date(esc.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">By {esc.escalatedBy.name || esc.escalatedBy.email}</p>
                    {esc.reason && <p className="text-body-sm text-on-surface mt-2 italic">"{esc.reason}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentsSection 
          incidentId={incident.id} 
          userId={(session?.user as any)?.id}
          comments={incident.comments} 
        />
        
      </div>
      
      {/* Hidden Printable Report */}
      <PrintableReport incident={incident} />
    </div>
  );
}
