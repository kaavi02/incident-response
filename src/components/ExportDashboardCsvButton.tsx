"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ExportDashboardCsvButton({ incidents }: { incidents: any[] }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    try {
      setIsExporting(true);
      
      const headers = ["ID", "Title", "Priority", "Status", "Tier", "Created At", "Reporter"];
      
      const csvContent = [
        headers.join(","),
        ...incidents.map(inc => {
          const reporter = inc.reporter?.name || inc.reporter?.email || "Unknown";
          return [
            `"${inc.id}"`,
            `"${inc.title.replace(/"/g, '""')}"`,
            `"${inc.priority}"`,
            `"${inc.status}"`,
            `"${inc.tier}"`,
            `"${new Date(inc.createdAt).toISOString()}"`,
            `"${reporter}"`
          ].join(",");
        })
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `Aegis_WarLog_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("War Log Exported to CSV!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export War Log");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high text-body-sm font-body-sm text-on-surface transition-all disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[18px]">
        {isExporting ? "hourglass_empty" : "file_download"}
      </span>
      <span>{isExporting ? "Exporting..." : "Export War Log"}</span>
    </button>
  );
}
