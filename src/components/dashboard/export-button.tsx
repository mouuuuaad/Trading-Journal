
"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export function ExportButton() {
  const handleExport = () => {
    // This triggers the browser's print dialog, which can be used to save as PDF.
    // We now rely on CSS @media print rules to style the output.
    window.print();
  }

  return (
    <Button size="sm" variant="outline" className="h-9 no-print" onClick={handleExport}>
      <FileDown className="h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Export</span>
    </Button>
  )
}
