
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trade } from "@/lib/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface TradeDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  trade: Trade;
}

const DetailRow = ({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) => (
    <div className="flex justify-between border-b py-2 text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-medium text-right", valueClassName)}>{value}</span>
    </div>
);


export function TradeDetailsModal({ isOpen, onOpenChange, trade }: TradeDetailsModalProps) {
  if (!trade) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="font-headline">تفاصيل {trade.asset}</DialogTitle>
      <DialogDescription>
         {format(trade.date, "eeee, MMMM d, yyyy")}
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-2">
      <DetailRow label="الاتجاه" value={trade.direction === "Buy" ? "شراء" : "بيع"} valueClassName={trade.direction === "Buy" ? "text-primary" : "text-destructive"} />
      <DetailRow label="حجم اللوت" value={trade.lotSize} />
      <DetailRow label="سعر الدخول" value={trade.entryPrice.toFixed(4)} />
      <DetailRow label="وقف الخسارة" value={trade.stopLoss?.toFixed(4) ?? "غير متوفر"} />
      <DetailRow label="جني الأرباح" value={trade.takeProfit?.toFixed(4) ?? "غير متوفر"} />
      <DetailRow
        label="النتيجة"
        value={
          <Badge
            variant={trade.result === "Win" ? "default" : trade.result === "Loss" ? "destructive" : "secondary"}
            className={cn("w-[50px] justify-center", trade.result === 'Win' ? 'bg-primary text-primary-foreground hover:bg-primary/80' : '')}
          >
            {trade.result === "Win" ? "ربح" : trade.result === "Loss" ? "خسارة" : "بدون"}
          </Badge>
        }
      />
      <DetailRow label="الربح/الخسارة" value={`$${trade.pnl.toFixed(2)}`} valueClassName={trade.pnl >= 0 ? "text-primary" : "text-destructive"} />

      {trade.screenshotUrl && (
        <div className="space-y-2 pt-4">
          <h4 className="font-medium text-sm text-foreground">لقطة شاشة</h4>
          <div className="p-2 border rounded-md">
            <img src={trade.screenshotUrl} alt={`لقطة شاشة لصفقة ${trade.asset}`} className="w-full h-auto rounded-md object-contain" />
          </div>
        </div>
      )}

      {trade.notes && (
        <div className="space-y-2 pt-4">
          <h4 className="font-medium text-sm text-foreground">ملاحظات شخصية</h4>
          <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground whitespace-pre-wrap">
            {trade.notes}
          </div>
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>

  );
}
