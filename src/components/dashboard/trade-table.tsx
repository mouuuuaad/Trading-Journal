
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="font-semibold text-foreground text-base">Positions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead>Symbol</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-right">Realized P&L</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length > 0 ? (
                  trades.map((trade) => (
                    <TableRow key={trade.id} className="border-border/40">
                      <TableCell>
                        <div className="font-medium text-foreground">{trade.asset}</div>
                        <div
                          className={cn(
                            "text-sm text-muted-foreground",
                            trade.direction === "Buy" ? "text-primary" : "text-destructive"
                          )}
                        >
                          {trade.direction}
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
                          className="w-[50px] justify-center"
                        >
                          {trade.result}
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
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(trade)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(trade)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={() => handleDeleteClick(trade)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">No trades logged yet.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the trade for <span className="font-semibold">{tradeToDelete?.asset}</span> on <span className="font-semibold">{tradeToDelete ? format(tradeToDelete.date, 'PPP') : ''}</span>.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, delete trade
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

    </>
  );
}
