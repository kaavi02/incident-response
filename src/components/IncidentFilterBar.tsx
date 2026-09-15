"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function IncidentFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [tier, setTier] = useState(searchParams.get("tier") || "");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/incidents?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/incidents");
    setStatus("");
    setPriority("");
    setTier("");
    setQ("");
  };

  const hasFilters = status || priority || tier || q;

  return (
    <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-xl p-4 backdrop-blur-md flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">filter_list</span>
          <span className="text-body-sm font-semibold text-on-surface">Filters:</span>
        </div>
        
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange("status", e.target.value);
          }}
          className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="MITIGATING">Mitigating</option>
          <option value="MONITORING">Monitoring</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            handleFilterChange("priority", e.target.value);
          }}
          className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            handleFilterChange("tier", e.target.value);
          }}
          className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-1.5 text-body-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="">All Tiers</option>
          <option value="L1">L1 Triage</option>
          <option value="L2">L2 Responder</option>
          <option value="L3">L3 Analyst</option>
        </select>
      </div>
      
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-body-sm font-semibold text-primary hover:text-primary-fixed transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
          Clear Filters
        </button>
      )}
    </div>
  );
}
