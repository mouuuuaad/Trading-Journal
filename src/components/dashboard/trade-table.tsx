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
  CardDescription,
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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/types";

interface TradeTableProps {
    trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  return (
    <Card>
      <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
        <CardTitle className="font-headline">Recent Trades</CardTitle>
        <CardDescription>A log of your most recent trades.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-right hidden sm:table-cell">P/L</TableHead>
                <TableHead className="text-right hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length > 0 ? (
                  trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        <div className="font-medium">{trade.asset}</div>
                        <div
                          className={cn(
                            "text-sm text-muted-foreground",
                            trade.direction === "Buy" ? "text-accent" : "text-destructive"
                          )}
                        >
                          {trade.direction}
                        </div>
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
                          className={cn(
                            "w-[50px] justify-center",
                            trade.result === 'Win' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''
                          )}
                        >
                          {trade.result}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "hidden sm:table-cell text-right font-mono",
                          trade.pnl >= 0 ? "text-accent" : "text-destructive"
                        )}
                      >
                        {trade.pnl >= 0 ? "+" : ""}${Math.abs(trade.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">{trade.date}</TableCell>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">No trades yet. Add one to get started!</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
