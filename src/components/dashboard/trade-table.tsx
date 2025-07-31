
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";
import { TradeDetailsModal } from "./trade-details-modal";
import { AddTradeModal } from "./add-trade-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TradeTableProps {
    trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  const [selectedTradeDetails, setSelectedTradeDetails] = React.useState<Trade | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  const [tradeToEdit, setTradeToEdit] = React.useState<Trade | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const [tradeToDelete, setTradeToDelete] = React.useState<Trade | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);

  const { toast } = useToast();

  const handleViewDetails = (trade: Trade) => {
    setSelectedTradeDetails(trade);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (trade: Trade) => {
    setTradeToEdit(trade);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (trade: Trade) => {
    setTradeToDelete(trade);
    setIsDeleteAlertOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!tradeToDelete) return;
    try {
        await deleteDoc(doc(db, "trades", tradeToDelete.id));
        toast({
            title: "Trade Deleted",
            description: `The trade for ${tradeToDelete.asset} has been successfully deleted.`,
        });
    } catch (error: any) {
        toast({
            title: "Error Deleting Trade",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setIsDeleteAlertOpen(false);
        setTradeToDelete(null);
    }
  };


  React.useEffect(() => {
    if (!isEditModalOpen) {
        setTradeToEdit(null);
    }
  }, [isEditModalOpen])

  return (
    <>
    <div className="space-y-4">
  <h2 className="text-base font-semibold text-foreground">الصفقات</h2>
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="border-border/40 hover:bg-transparent">
          <TableHead>الرمز</TableHead>
          <TableHead>الوقت</TableHead>
          <TableHead className="text-center">النتيجة</TableHead>
          <TableHead className="text-right">الأرباح/الخسائر المحققة</TableHead>
          <TableHead>
            <span className="sr-only">إجراءات</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="h-8">
        {trades.length > 0 ? (
          trades.map((trade) => (
            <TableRow key={trade.id} className="border-border/40 hover:bg-muted/40">
              <TableCell>
                <div className="font-medium text-foreground">{trade.asset}</div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      trade.direction === "Buy" ? "text-primary" : "text-destructive"
                    )}
                  >
                    {trade.direction === "Buy" ? "شراء" : "بيع"}
                  </div>
                  <span className="text-xs text-muted-foreground">({trade.lotSize})</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-foreground">{format(trade.date, "dd MMMM yyyy")}</div>
                <div className="text-sm text-muted-foreground">{formatDistanceToNow(trade.date, { addSuffix: true })}</div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    trade.result === "Win"
                      ? "default"
                      : trade.result === "Loss"
                      ? "destructive"
                      : "secondary"
                  }
                  className={cn("w-[50px] justify-center",  trade.result === 'Win' ? 'bg-primary text-primary-foreground hover:bg-primary/80' : '')}
                >
                  {trade.result === "Win" ? "ربح" : trade.result === "Loss" ? "خسارة" : "بدون نتيجة"}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-medium",
                  trade.pnl >= 0 ? "text-primary" : "text-destructive"
                )}
              >
                {trade.pnl >= 0 ? "+" : ""}${Math.abs(trade.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 float-right">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">تبديل القائمة</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(trade)}>عرض التفاصيل</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(trade)}>تعديل</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={() => handleDeleteClick(trade)}>حذف</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">لا توجد صفقات في الفترة المحددة.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>

    {selectedTradeDetails && (
        <TradeDetailsModal
            isOpen={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            trade={selectedTradeDetails}
        />
    )}
    {isEditModalOpen && (
        <AddTradeModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            tradeToEdit={tradeToEdit}
        />
    )}
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
      <AlertDialogDescription>
        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الصفقة الخاصة بـ <span className="font-semibold">{tradeToDelete?.asset}</span> بشكل نهائي بتاريخ <span className="font-semibold">{tradeToDelete ? format(tradeToDelete.date, 'PPP') : ''}</span>.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>إلغاء</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
        نعم، احذف الصفقة
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


    </>
  );
}
