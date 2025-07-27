
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from 'next/navigation';
import { Trade } from "@/lib/types";
import {
  startOfToday,
  startOfWeek,
  startOfMonth,
  startOfYear,
  parseISO,
  getDay,
} from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { WinLossChart } from "@/components/dashboard/win-loss-chart";
import { WeekdayPerformanceChart } from "@/components/dashboard/weekday-performance-chart";
import { TradeTable } from "@/components/dashboard/trade-table";
import { TradeFilters } from "@/components/dashboard/trade-filters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";
import { TradeVisionIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type DateRange = "all" | "today" | "this-week" | "this-month" | "this-year";
type FilterType = "asset" | "result" | "direction";
type User = {
    displayName?: string;
    photoURL?: string;
}

function filterTrades(
    trades: Trade[],
    dateRange: DateRange,
    filters: { asset: string; result: string; direction: string }
): Trade[] {
  const now = new Date();
  let startDate: Date;

  switch (dateRange) {
    case 'today':
      startDate = startOfToday();
      break;
    case 'this-week':
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'this-month':
      startDate = startOfMonth(now);
      break;
    case 'this-year':
      startDate = startOfYear(now);
      break;
    case 'all':
    default:
      // No date filtering
      break;
  }

  return trades.filter(trade => {
    if (dateRange !== 'all') {
        const tradeDate = typeof trade.date === 'string' ? parseISO(trade.date) : trade.date;
        if (tradeDate < startDate) {
            return false;
        }
    }
    if (filters.asset !== 'all' && trade.asset !== filters.asset) {
        return false;
    }
    if (filters.result !== 'all' && trade.result !== filters.result) {
        return false;
    }
    if (filters.direction !== 'all' && trade.direction !== filters.direction) {
        return false;
    }
    return true;
  });
}

function calculateStats(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0, winRate: 0, winningTrades: 0, losingTrades: 0, beTrades: 0,
      totalTrades: 0, rrRatio: 0, avgPnl: 0, bestTrade: null, worstTrade: null,
      performanceData: [],
      winLossData: [
        { name: 'Wins', value: 0, fill: "hsl(var(--chart-2))" },
        { name: 'Losses', value: 0, fill: "hsl(var(--destructive))" },
        { name: 'Break Even', value: 0, fill: "hsl(var(--muted-foreground))" },
      ],
      weekdayPerformance: [],
    };
  }

  const totalPnl = trades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => trade.result === "Win").length;
  const losingTrades = trades.filter((trade) => trade.result === "Loss").length;
  const beTrades = trades.filter((trade) => trade.result === "BE").length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  const totalReward = trades.filter(t => t.result === 'Win').reduce((acc, trade) => acc + Math.abs(trade.takeProfit - trade.entryPrice), 0);
  const totalRisk = trades.filter(t => t.result === 'Loss').reduce((acc, trade) => acc + Math.abs(trade.entryPrice - trade.stopLoss), 0);
  const averageReward = winningTrades > 0 ? totalReward / winningTrades : 0;
  const averageRisk = losingTrades > 0 ? totalRisk / losingTrades : 0;
  const rrRatio = averageRisk > 0 ? averageReward / averageRisk : 0;
  const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;
  const bestTrade = trades.reduce((max, trade) => (trade.pnl > (max.pnl ?? -Infinity)) ? trade : max, trades[0]);
  const worstTrade = trades.reduce((min, trade) => (trade.pnl < (min.pnl ?? Infinity)) ? trade : min, trades[0]);

  const performanceData = trades.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const cumulativePnl = (acc[index - 1]?.pnl || 0) + (trade.pnl || 0);
      acc.push({ date: `Trade #${index + 1}`, pnl: cumulativePnl });
      return acc;
    }, [] as { date: string; pnl: number }[]);

  const winLossData = [
    { name: 'Wins', value: winningTrades, fill: "hsl(var(--chart-2))" },
    { name: 'Losses', value: losingTrades, fill: "hsl(var(--destructive))" },
    { name: 'Break Even', value: beTrades, fill: "hsl(var(--muted-foreground))" },
  ];
  
  const weekdayPnl = [{ name: 'Mon', pnl: 0 }, { name: 'Tue', pnl: 0 }, { name: 'Wed', pnl: 0 }, { name: 'Thu', pnl: 0 }, { name: 'Fri', pnl: 0 }];
  trades.forEach(trade => {
    const dayIndex = getDay(parseISO(trade.date as any));
    if (dayIndex >= 1 && dayIndex <= 5) {
        weekdayPnl[dayIndex - 1].pnl += trade.pnl;
    }
  });

  return {
    totalPnl, winRate, winningTrades, losingTrades, beTrades, totalTrades, rrRatio,
    avgPnl, bestTrade, worstTrade, performanceData, winLossData, weekdayPerformance: weekdayPnl
  };
}

const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const names = name.split(" ");
    return names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
};

export default function SharePage() {
  const params = useParams();
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [filters, setFilters] = useState({ asset: "all", result: "all", direction: "all" });

  useEffect(() => {
    const token = params.userId as string; // userId is the token in the new URL structure
    if (!token) {
        setError("Share link is missing a token.");
        setIsLoading(false);
        return;
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/share/${token}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || `Failed to fetch data: ${res.statusText}`);
            }
            setUser(data.user);
            const tradesWithDates = data.trades.map((t: any) => ({ ...t, date: parseISO(t.date) }));
            setAllTrades(tradesWithDates);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [params.userId]);

  const handleFilterChange = (filterType: FilterType, value: string) => setFilters(prev => ({ ...prev, [filterType]: value }));
  const filteredTrades = useMemo(() => filterTrades(allTrades, dateRange, filters), [allTrades, dateRange, filters]);
  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);
  const uniqueAssets = useMemo(() => Array.from(new Set(allTrades.map(t => t.asset))), [allTrades]);

  if (isLoading) {
      return (
         <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
                {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-28" />)}
            </div>
             <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[325px]" />
                <Skeleton className="lg:col-span-3 h-[325px]" />
              </div>
              <Skeleton className="mt-8 h-[325px]" />
              <Skeleton className="mt-8 h-96" />
         </main>
      )
  }

  if (error) {
    const isExpired = error.includes("expired") || error.includes("invalid");
    return (
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                    {isExpired ? <Clock className="mx-auto h-12 w-12 text-destructive" /> : <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />}
                    <CardTitle className="mt-4">{isExpired ? "Link Invalid or Expired" : "Could Not Load Profile"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        </main>
    )
  }
  
  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2"><TradeVisionIcon className="h-6 w-6" /><h1 className="font-headline text-xl text-foreground">TradeVision</h1></div>
        <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Viewing public profile of</span>
             <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8"><AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} /><AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback></Avatar>
                <span className="font-semibold text-foreground">{user?.displayName}</span>
            </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8" id="dashboard-content">
        <StatsCards {...stats} dateRange={dateRange} setDateRange={setDateRange} />
        <div className="grid gap-4 md:gap-8">
          {allTrades.length === 0 ? (
            <Card><CardHeader><CardTitle>No Trades Logged</CardTitle><CardDescription>This user hasn't logged any trades yet.</CardDescription></CardHeader></Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 md:gap-8">
                <div className="lg:col-span-4"><PerformanceChart data={stats.performanceData} /></div>
                <div className="lg:col-span-3"><WinLossChart data={stats.winLossData} /></div>
              </div>
              <div className="grid gap-4 md:gap-8"><WeekdayPerformanceChart data={stats.weekdayPerformance} /></div>
              <div>
                <TradeFilters uniqueAssets={uniqueAssets} filters={filters} onFilterChange={handleFilterChange} />
                <TradeTable trades={filteredTrades} />
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="mt-auto flex items-center justify-center p-4">
             <Link href="https://www.instagram.com/mouuuuaad_dev" target="_blank" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <TradeVisionIcon className="h-5 w-5" />
                <span>Created by Mouaad Idoufkir</span>
            </Link>
      </footer>
    </>
  );
}

    