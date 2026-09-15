"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIncident } from "@/actions/incidents";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function NewIncidentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  
  // Telemetry state
  const [sourceIp, setSourceIp] = useState("");
  const [destinationIp, setDestinationIp] = useState("");
  const [sourcePort, setSourcePort] = useState("");
  const [destinationPort, setDestinationPort] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const userId = (session?.user as any)?.id;
    if (!userId) {
      toast.error("You must be logged in to post an incident.");
      return;
    }

    try {
      setIsSubmitting(true);
      const incident = await createIncident({
        title,
        description,
        priority,
        reporterId: userId,
        sourceIp: sourceIp || undefined,
        destinationIp: destinationIp || undefined,
        sourcePort: sourcePort ? parseInt(sourcePort) : undefined,
        destinationPort: destinationPort ? parseInt(destinationPort) : undefined,
      });
      toast.success("Incident posted successfully!");
      router.push(`/incidents/${incident.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to post incident.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-headline-xl font-headline-xl text-on-surface tracking-tight font-bold mb-2">
          Post an Incident
        </h1>
        <p className="text-on-surface-variant text-body-md">
          Report a new security event or system anomaly to the SOC team.
        </p>
      </div>

      <div className="bg-surface-container-low/70 rounded-2xl border border-outline-variant/30 p-8 shadow-2xl backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6 pb-6 border-b border-outline-variant/20">
            <h2 className="text-headline-sm font-semibold text-primary">Core Details</h2>
            <div>
              <label htmlFor="title" className="block text-body-sm font-semibold text-on-surface mb-2">
                Incident Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Suspicious Login Activity from Unknown IP"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-body-sm font-semibold text-on-surface mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-4">
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => {
                  let colorClasses = "border-outline-variant/40 bg-surface-container hover:bg-surface-container-high text-on-surface-variant";
                  if (priority === p) {
                    if (p === "LOW") colorClasses = "border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
                    if (p === "MEDIUM") colorClasses = "border-blue-500 bg-blue-500/20 text-blue-600 dark:text-blue-400";
                    if (p === "HIGH") colorClasses = "border-orange-500 bg-orange-500/20 text-orange-600 dark:text-orange-400";
                    if (p === "CRITICAL") colorClasses = "border-red-500 bg-red-500/20 text-red-600 dark:text-red-400";
                  }
                  
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p as any)}
                      className={`py-3 px-4 rounded-xl border text-body-sm font-semibold transition-all ${colorClasses}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="space-y-6 pb-6 border-b border-outline-variant/20">
            <h2 className="text-headline-sm font-semibold text-primary">Network Telemetry (Optional)</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-2">Source IP</label>
                <input
                  type="text"
                  value={sourceIp}
                  onChange={(e) => setSourceIp(e.target.value)}
                  placeholder="e.g. 192.168.1.100"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-2">Source Port</label>
                <input
                  type="number"
                  value={sourcePort}
                  onChange={(e) => setSourcePort(e.target.value)}
                  placeholder="e.g. 443"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-2">Destination IP</label>
                <input
                  type="text"
                  value={destinationIp}
                  onChange={(e) => setDestinationIp(e.target.value)}
                  placeholder="e.g. 10.0.0.5"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-on-surface mb-2">Destination Port</label>
                <input
                  type="number"
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  placeholder="e.g. 8080"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-body-sm font-semibold text-on-surface mb-2">
              Detailed Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide all relevant logs, IPs, and observations..."
              className="w-full min-h-[200px] bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-y"
              required
            />
          </div>

          <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Posting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">add_alert</span>
                  Submit Incident
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
