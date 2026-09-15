"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { toast } from "react-hot-toast";

export default function ExportPdfButton({ targetId, filename }: { targetId: string, filename: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      toast.error("Error: Report container not found.");
      return;
    }

    try {
      setIsExporting(true);
      
      // Temporarily modify styles for better PDF rendering if needed
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = "#1a1c1e"; // match dark mode surface

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#1a1c1e",
      });

      element.style.backgroundColor = originalBg;

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
      toast.success("PDF Generated successfully!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container border border-outline-variant/40 rounded-lg font-semibold transition-colors disabled:opacity-50 shadow-sm"
    >
      <span className="material-symbols-outlined text-[18px]">
        {isExporting ? "hourglass_empty" : "picture_as_pdf"}
      </span>
      {isExporting ? "Generating PDF..." : "Export Report (PDF)"}
    </button>
  );
}
