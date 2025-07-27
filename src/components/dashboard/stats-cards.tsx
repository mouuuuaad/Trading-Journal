
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownLeft, ArrowUpRight, Calendar, Target, TrendingUp, TrendingDown, Minus, Trophy, ThumbsDown, ListOrdered, Divide } from "lucide-react";
import { cn } from "@/lib/utils";
import { Trade } from "@/lib/types";


type StatsCardsProps = {
  totalPnl: number;
  winRate: number;
  winningTrades: number;
  totalTrades: number;
  rrRatio: number;
  dateRange: string;
  setDateRange: (range: "all" | "today" | "this-week" | "this-month" | "this-year") => void;
  avgPnl: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
};

const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
];

export function StatsCards({ totalPnl, winRate, winningTrades, totalTrades, rrRatio, dateRange, setDateRange, avgPnl, bestTrade, worstTrade }: StatsCardsProps) {
  const selectedLabel = dateRangeOptions.find(opt => opt.value === dateRange)?.label || "All Time";
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {/* Date Range */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Date Range</CardTitle>
           <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-base font-bold">
                <span>{selectedLabel}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                 {dateRangeOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                    </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
      {/* Total P/L */}
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
        </CardContent>
      </Card>
      {/* Win Rate */}
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
      {/* R:R Ratio */}
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
      {/* Total Trades */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <ListOrdered className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTrades}</div>
           <p className="text-xs text-muted-foreground">Total trades executed</p>
        </CardContent>
      </Card>
      {/* Average P/L */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average P/L</CardTitle>
          <Divide className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
           <div className={cn("text-2xl font-bold", avgPnl >= 0 ? "text-accent" : "text-destructive")}>
             {avgPnl >= 0 ? "+" : "-"} ${Math.abs(avgPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">per trade</p>
        </CardContent>
      </Card>
      {/* Best Trade */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Trade</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
            {bestTrade ? (
                <>
                <div className="text-2xl font-bold text-accent">
                    +${bestTrade.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{bestTrade.asset}</p>
                </>
            ) : (
                 <div className="text-2xl font-bold text-muted-foreground">-</div>
            )}
        </CardContent>
      </Card>
      {/* Worst Trade */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Worst Trade</CardTitle>
          <ThumbsDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
            {worstTrade ? (
                <>
                <div className="text-2xl font-bold text-destructive">
                    -${Math.abs(worstTrade.pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                 <p className="text-xs text-muted-foreground">{worstTrade.asset}</p>
                </>
            ) : (
                <div className="text-2xl font-bold text-muted-foreground">-</div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
