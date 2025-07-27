
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
          <DialogTitle className="font-headline">{trade.asset} Details</DialogTitle>
          <DialogDescription>
             {format(trade.date, "eeee, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
            <DetailRow label="Direction" value={trade.direction} valueClassName={trade.direction === "Buy" ? "text-primary" : "text-destructive"} />
            <DetailRow label="Entry Price" value={trade.entryPrice.toFixed(4)} />
            <DetailRow label="Stop Loss" value={trade.stopLoss.toFixed(4)} />
            <DetailRow label="Take Profit" value={trade.takeProfit.toFixed(4)} />
            <DetailRow label="Result" value={<Badge variant={trade.result === "Win" ? "default" : trade.result === "Loss" ? "destructive" : "secondary"} className={cn("w-[50px] justify-center", trade.result === 'Win' ? 'bg-primary text-primary-foreground hover:bg-primary/80' : '')}>{trade.result}</Badge>} />
            <DetailRow label="P/L" value={`$${trade.pnl.toFixed(2)}`} valueClassName={trade.pnl >= 0 ? "text-primary" : "text-destructive"} />
            
            {trade.screenshotUrl && (
                 <div className="space-y-2 pt-4">
                    <h4 className="font-medium text-sm text-foreground">Screenshot</h4>
                    <div className="p-2 border rounded-md">
                       <img src={trade.screenshotUrl} alt={`Screenshot for ${trade.asset} trade`} className="w-full h-auto rounded-md object-contain" />
                    </div>
                </div>
            )}

            {trade.notes && (
                <div className="space-y-2 pt-4">
                    <h4 className="font-medium text-sm text-foreground">Personal Notes</h4>
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
