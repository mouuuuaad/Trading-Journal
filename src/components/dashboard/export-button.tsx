
"use client"

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { Trade } from "@/lib/types";
import { format } from "date-fns";
import type { User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


type ExportButtonProps = {
    trades: Trade[];
    stats: any;
    user: User | null | undefined;
};

export function ExportButton({ trades, stats, user }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [fileName, setFileName] = useState(`HsebliTrade_Report_${format(new Date(), 'yyyy-MM-dd')}`);
  const { toast } = useToast();

  const handleExport = async () => {
    if (!trades || trades.length === 0) {
        toast({
            title: "No Data to Export",
            description: "There are no trades in the selected date range to export.",
            variant: "destructive"
        });
        return;
    }

    setIsExporting(true);

    try {
        const doc = new jsPDF();

        // Add Header
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("TradeVision Trading Report", 14, 22);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated for: ${user?.displayName || user?.email || 'N/A'}`, 14, 30);
        doc.text(`Date: ${format(new Date(), "PPP")}`, 14, 36);

        // Add Summary Stats
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Performance Summary", 14, 50);
        
        const summaryY = 58;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`Total P/L:`, 14, summaryY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(stats.totalPnl >= 0 ? 40 : 255, stats.totalPnl >= 0 ? 167 : 82, stats.totalPnl >= 0 ? 69 : 82); // Green or Red
        doc.text(`${stats.totalPnl >= 0 ? '+' : '-'}$${Math.abs(stats.totalPnl).toFixed(2)}`, 50, summaryY);
        doc.setTextColor(0, 0, 0); // Reset color
        doc.setFont("helvetica", "normal");

        doc.text(`Win Rate:`, 14, summaryY + 7);
        doc.text(`${stats.winRate.toFixed(1)}%`, 50, summaryY + 7);
        
        doc.text(`Total Trades:`, 14, summaryY + 14);
        doc.text(`${stats.totalTrades} (${stats.winningTrades} W / ${stats.losingTrades} L / ${stats.beTrades} BE)`, 50, summaryY + 14);

        doc.text(`Average R:R:`, 14, summaryY + 21);
        doc.text(`1 : ${stats.rrRatio.toFixed(2)}`, 50, summaryY + 21);
        

        // Add Trade Table
        const tableColumn = ["Date", "Asset", "Direction", "Entry", "SL", "TP", "Result", "P/L ($)"];
        const tableRows = trades.map(trade => [
            format(new Date(trade.date), "yyyy-MM-dd"),
            trade.asset,
            trade.direction,
            trade.entryPrice.toFixed(4),
            trade.stopLoss.toFixed(4),
            trade.takeProfit.toFixed(4),
            trade.result,
            { content: trade.pnl.toFixed(2), styles: { textColor: trade.pnl >= 0 ? [40, 167, 69] : [220, 53, 69] } }
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: summaryY + 30,
            theme: 'striped',
            headStyles: { fillColor: [22, 163, 74] },
             didParseCell: function (data) {
                // Color rows based on result
                const row = data.row;
                const cell = data.cell;
                if (row.section === 'body') {
                    const result = (row.raw as any[])[6]; // 'Result' column
                    if (result === 'Win') {
                        cell.styles.fillColor = [237, 247, 237]; // Light green
                    } else if (result === 'Loss') {
                        cell.styles.fillColor = [253, 237, 237]; // Light red
                    }
                }
            }
        });

        // Add Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 287, { align: 'center' });
        }


        doc.save(`${fileName}.pdf`);

    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
          title: "Export Failed",
          description: "An unexpected error occurred while creating the PDF.",
          variant: "destructive"
      })
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>
     <Button size="sm" variant="outline" className="h-9" disabled={isExporting}>
         {isExporting ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <FileDown className="h-4 w-4 sm:mr-2" />}
         <span className="hidden sm:inline">
             {isExporting ? "جاري التصدير..." : "تصدير"}
         </span>
     </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>تصدير التقرير إلى ملف PDF</AlertDialogTitle>
      <AlertDialogDescription>
        الرجاء إدخال اسم الملف لتقرير PDF الخاص بك. سيتم تضمين ملخص مفصل وجدول للصفقات التي اخترتها.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="filename" className="text-right">
          اسم الملف
        </Label>
        <Input
          id="filename"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="col-span-3"
        />
      </div>
    </div>
    <AlertDialogFooter>
      <AlertDialogCancel>إلغاء</AlertDialogCancel>
      <AlertDialogAction onClick={handleExport} disabled={isExporting}>
        {isExporting ? "جارٍ الإنشاء..." : "تصدير PDF"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  )
}
