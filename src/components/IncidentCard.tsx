"use client";

import { useState } from "react";
import { escalateIncident, updateIncidentStatus } from "@/actions/incidents";
import { Incident, Priority, Status, EscalationTier, User } from "@prisma/client";
import { toast } from "react-hot-toast";

type PopulatedIncident = Incident & {
  reporter: User;
  assignee: User | null;
  comments: any[];
  escalations: any[];
};

export default function IncidentCard({
  incident,
  userId,
}: {
  incident: PopulatedIncident;
  userId: string;
}) {
  const [isEscalating, setIsEscalating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const priorityColor =
    incident.priority === "CRITICAL"
      ? "text-tertiary border-tertiary/40 bg-tertiary-container/20"
      : incident.priority === "HIGH"
      ? "text-[#f59e0b] border-[#f59e0b]/40 bg-[#f59e0b]/20"
      : incident.priority === "MEDIUM"
      ? "text-[#3b82f6] border-[#3b82f6]/40 bg-[#3b82f6]/20"
      : "text-[#10b981] border-[#10b981]/40 bg-[#10b981]/20";

  const handleEscalate = async (newTier: EscalationTier) => {
    try {
      setIsEscalating(true);
      await escalateIncident(incident.id, userId, newTier, "Manual escalation");
      toast.success(`Escalated to ${newTier}`);
    } catch (e: any) {
      toast.error("Error escalating: " + e.message);
    } finally {
      setIsEscalating(false);
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    try {
      setIsUpdating(true);
      await updateIncidentStatus(incident.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (e: any) {
      toast.error("Error updating status: " + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="group rounded-xl border border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low transition-all p-4">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div className="flex-1 flex gap-4">
          <div className="mt-1">
            <span
              className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              report
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-telemetry-sm font-telemetry-sm text-outline-variant font-mono">
                #{incident.id.slice(0, 8)}
              </span>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border font-semibold ${priorityColor}`}
              >
                {incident.priority}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border border-primary/40 bg-primary-container/20 text-primary font-semibold">
                {incident.status}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-label-caps border border-[#8b5cf6]/40 bg-[#8b5cf6]/20 text-[#8b5cf6] font-semibold">
                {incident.tier}
              </span>
            </div>
            <h3 className="text-body-lg font-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
              {incident.title}
            </h3>
            <p className="text-body-sm text-on-surface-variant line-clamp-2 mt-1">
              {incident.description}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-telemetry-sm font-telemetry-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">
                  person
                </span>
                <span>Reporter: {incident.reporter.name || incident.reporter.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-telemetry-sm font-telemetry-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px]">
                  schedule
                </span>
                <span suppressHydrationWarning>{new Date(incident.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row xl:flex-col gap-2 shrink-0">
          <div className="flex gap-2">
            {incident.status !== "CLOSED" && (
              <button
                onClick={() => handleStatusChange("RESOLVED")}
                disabled={isUpdating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-body-sm font-semibold text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                  check_circle
                </span>
                Resolve
              </button>
            )}
            
            {incident.tier === "L1" && (
              <button
                onClick={() => handleEscalate("L2")}
                disabled={isEscalating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/50 text-body-sm font-semibold text-[#f59e0b] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  keyboard_double_arrow_up
                </span>
                Escalate L2
              </button>
            )}
            {incident.tier === "L2" && (
              <button
                onClick={() => handleEscalate("L3")}
                disabled={isEscalating}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-body-sm font-semibold text-[#8b5cf6] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  rocket_launch
                </span>
                Escalate L3
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
