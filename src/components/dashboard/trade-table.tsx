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
import { MoreHorizontal, MoveVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/types";

interface TradeTableProps {
    trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Trades</CardTitle>
        <CardDescription>A log of your most recent trades.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px] hidden sm:table-cell"></TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="hidden md:table-cell">Entry Price</TableHead>
              <TableHead className="hidden md:table-cell">P/L</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length > 0 ? (
                trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="hidden sm:table-cell">
                      <MoveVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell className="font-medium">{trade.asset}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-semibold",
                          trade.direction === "Buy" ? "text-accent" : "text-destructive"
                        )}
                      >
                        {trade.direction}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          trade.result === "Win"
                            ? "default"
                            : trade.result === "Loss"
                            ? "destructive"
                            : "secondary"
                        }
                        className={trade.result === 'Win' ? 'bg-accent text-accent-foreground' : ''}
                      >
                        {trade.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {trade.entryPrice.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "hidden md:table-cell font-mono",
                        trade.pnl >= 0 ? "text-accent" : "text-destructive"
                      )}
                    >
                      {trade.pnl >= 0 ? "+" : ""}${Math.abs(trade.pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{trade.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">No trades yet. Add one to get started!</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
