
"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export function ExportButton() {
  const handleExport = () => {
    // This triggers the browser's print dialog, which can be used to save as PDF.
    const printContents = document.getElementById("dashboard-content")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = `<div class="print-container">${printContents}</div>`;
    }
    
    window.print();
    
    if (printContents) {
      document.body.innerHTML = originalContents;
      // Re-initialize any event listeners if needed after restoring content
      // This is a simple implementation, complex apps might need a more robust solution
    }
  }

  return (
    <Button size="sm" variant="outline" className="h-9 no-print" onClick={handleExport}>
      <FileDown className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Export</span>
    </Button>
  )
}
