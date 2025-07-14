import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownLeft, ArrowUpRight, Calendar, Target, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";


type StatsCardsProps = {
  totalPnl: number;
  winRate: number;
  winningTrades: number;
  totalTrades: number;
  rrRatio: number;
};

export function StatsCards({ totalPnl, winRate, winningTrades, totalTrades, rrRatio }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          <span className={cn(totalPnl >= 0 ? "text-accent" : "text-destructive")}>
            {totalPnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </span>
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", totalPnl >= 0 ? "text-accent" : "text-destructive")}>
            {totalPnl >= 0 ? "+" : "-"} ${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{winRate.toFixed(1)} %</div>
          <p className="text-xs text-muted-foreground">{winningTrades} wins out of {totalTrades} trades</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average R:R</CardTitle>
          <span className="text-primary flex">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <ArrowDownLeft className="h-4 w-4 text-primary" />
          </span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1 : {rrRatio.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Risk vs Reward ratio</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Date Range</CardTitle>
           <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                All Time
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
              <DropdownMenuItem>This Month</DropdownMenuItem>
              <DropdownMenuItem>This Year</DropdownMenuItem>
               <DropdownMenuItem>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    </div>
  );
}
