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
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as any)}
                  className={`py-3 px-4 rounded-xl border text-body-sm font-semibold transition-all ${
                    priority === p
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-outline-variant/40 bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {p}
                </button>
              ))}
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
