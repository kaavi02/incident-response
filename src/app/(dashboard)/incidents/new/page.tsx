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
  const [otherInfo, setOtherInfo] = useState("");

  // Log file upload state
  const [logFile, setLogFile] = useState<{ name: string; size: string; content: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Log file must be less than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || "";
      const sizeStr = file.size < 1024 
        ? `${file.size} B` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      setLogFile({
        name: file.name,
        size: sizeStr,
        content
      });
      toast.success(`Attached ${file.name}`);
    };
    reader.onerror = () => {
      toast.error("Failed to read log file.");
    };
    reader.readAsText(file);
  };

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
        otherInfo: otherInfo || undefined,
        logFileName: logFile?.name,
        logContent: logFile?.content,
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

              <div className="col-span-2">
                <label className="block text-body-sm font-semibold text-on-surface mb-2">Other Information</label>
                <input
                  type="text"
                  value={otherInfo}
                  onChange={(e) => setOtherInfo(e.target.value)}
                  placeholder="e.g. Protocol: HTTPS, User Agent, Hostname: srv-db-01, Process: winword.exe"
                  className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-body-md text-on-surface font-mono placeholder-on-surface-variant/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-6 border-b border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm font-semibold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                Attach Log File (Optional)
              </h2>
              {logFile && (
                <button
                  type="button"
                  onClick={() => setLogFile(null)}
                  className="text-body-sm text-error hover:text-error/80 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Remove File
                </button>
              )}
            </div>

            {!logFile ? (
              <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDragging 
                    ? "border-primary bg-primary/10" 
                    : "border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container/30"
                }`}
              >
                <input
                  type="file"
                  accept=".log,.txt,.json,.csv,.xml,.pcap"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />
                <span className="material-symbols-outlined text-primary text-3xl mb-2">upload_file</span>
                <p className="text-body-md font-semibold text-on-surface">Click to upload or drag & drop log file</p>
                <p className="text-telemetry-sm text-on-surface-variant mt-1 font-mono">Supports .log, .txt, .json, .csv (Max 2MB)</p>
              </label>
            ) : (
              <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div>
                    <div className="text-body-md font-semibold text-on-surface">{logFile.name}</div>
                    <div className="text-telemetry-sm text-on-surface-variant font-mono">{logFile.size} • Ready for analysis</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[14px]">check</span> Attached
                </span>
              </div>
            )}
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
