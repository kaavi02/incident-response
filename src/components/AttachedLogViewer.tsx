"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AttachedLogViewer({
  logFile,
}: {
  logFile: { name: string; content: string };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logFile.content);
    setCopied(true);
    toast.success("Log content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([logFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = logFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${logFile.name}`);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-headline-sm font-headline-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">description</span>
          Attached Log File: <span className="font-mono text-primary text-body-md">{logFile.name}</span>
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-body-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Copied" : "Copy Log"}
          </button>
          <button
            onClick={handleDownload}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-body-sm font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-outline-variant/30 bg-[#0d1117] text-slate-200">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>{logFile.name}</span>
          <span>{logFile.content.split("\n").length} lines</span>
        </div>
        <pre className="p-4 text-xs font-mono overflow-x-auto max-h-80 custom-scrollbar whitespace-pre leading-relaxed select-text">
          {logFile.content}
        </pre>
      </div>
    </div>
  );
}
