
"use client"

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) {
      console.error("Dashboard content element not found!");
      setIsExporting(false);
      return;
    }

    try {
      // Use html2canvas to render the dashboard content to a canvas
      const canvas = await html2canvas(dashboardContent, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Important for external images if any
        onclone: (document) => {
            // This function runs on a clone of the document before rendering.
            // We can make temporary changes here that only affect the PDF output.
            const clonedContent = document.getElementById('dashboard-content');
            if(clonedContent) {
                // Remove the max-width for the PDF to use full page width
                clonedContent.style.maxWidth = 'none';
            }
        }
      });

      const imgData = canvas.toDataURL('image/png');

      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height] // Use canvas dimensions for page size
      });

      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      // Download the PDF
      pdf.save('tradevision-report.pdf');

    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button size="sm" variant="outline" className="h-9" onClick={handleExport} disabled={isExporting}>
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
      ) : (
        <FileDown className="h-4 w-4 sm:mr-2" />
      )}
      <span className="hidden sm:inline">
        {isExporting ? "Exporting..." : "Export"}
      </span>
    </Button>
  )
}
