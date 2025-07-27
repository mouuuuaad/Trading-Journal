
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { WinLossChart } from "@/components/dashboard/win-loss-chart";
import { WeekdayPerformanceChart } from "@/components/dashboard/weekday-performance-chart";
import { TradeTable } from "@/components/dashboard/trade-table";
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
import { ExportButton } from "@/components/dashboard/export-button";
import { TradeFilters } from "@/components/dashboard/trade-filters";
import { AddTradeModal } from "@/components/dashboard/add-trade-modal";

type DateRange = "all" | "today" | "this-week" | "this-month" | "this-year";
type FilterType = "asset" | "result" | "direction";

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
    // Date Range Filter
    if (dateRange !== 'all') {
        const tradeDate = typeof trade.date === 'string' ? parseISO(trade.date) : trade.date;
        if (tradeDate < startDate) {
            return false;
        }
    }

    // Asset Filter
    if (filters.asset !== 'all' && trade.asset !== filters.asset) {
        return false;
    }

    // Result Filter
    if (filters.result !== 'all' && trade.result !== filters.result) {
        return false;
    }

    // Direction Filter
    if (filters.direction !== 'all' && trade.direction !== filters.direction) {
        return false;
    }

    return true;
  });
}

function calculateStats(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      winningTrades: 0,
      losingTrades: 0,
      beTrades: 0,
      totalTrades: 0,
      rrRatio: 0,
      avgPnl: 0,
      bestTrade: null,
      worstTrade: null,
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

  const totalReward = trades.filter(t => t.result === 'Win').reduce((acc, trade) => {
      const reward = Math.abs(trade.takeProfit - trade.entryPrice);
      return acc + reward;
  }, 0);

  const totalRisk = trades.filter(t => t.result === 'Loss').reduce((acc, trade) => {
      const risk = Math.abs(trade.entryPrice - trade.stopLoss);
      return acc + risk;
  }, 0);

  const averageReward = winningTrades > 0 ? totalReward / winningTrades : 0;
  const averageRisk = losingTrades > 0 ? totalRisk / losingTrades : 0;

  const rrRatio = averageRisk > 0 ? averageReward / averageRisk : 0;
  const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;

  const bestTrade = trades.reduce((max, trade) => (trade.pnl > (max.pnl ?? -Infinity)) ? trade : max, trades[0]);
  const worstTrade = trades.reduce((min, trade) => (trade.pnl < (min.pnl ?? Infinity)) ? trade : min, trades[0]);


  const performanceData = trades
    .slice() 
    .sort((a, b) => {
        const dateA = typeof a.date === 'string' ? new Date(a.date).getTime() : a.date.getTime();
        const dateB = typeof b.date === 'string' ? new Date(b.date).getTime() : b.date.getTime();
        return dateA - dateB;
    })
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
  
  const weekdayPnl = [
    { name: 'Mon', pnl: 0 },
    { name: 'Tue', pnl: 0 },
    { name: 'Wed', pnl: 0 },
    { name: 'Thu', pnl: 0 },
    { name: 'Fri', pnl: 0 },
  ];

  trades.forEach(trade => {
    const tradeDate = typeof trade.date === 'string' ? parseISO(trade.date) : trade.date;
    const dayIndex = getDay(tradeDate); // 0 (Sunday) to 6 (Saturday)
    if (dayIndex >= 1 && dayIndex <= 5) { // Monday to Friday
        weekdayPnl[dayIndex - 1].pnl += trade.pnl;
    }
  });


  return {
    totalPnl,
    winRate,
    winningTrades,
    losingTrades,
    beTrades,
    totalTrades,
    rrRatio,
    avgPnl,
    bestTrade,
    worstTrade,
    performanceData,
    winLossData,
    weekdayPerformance: weekdayPnl
  };
}


export default function DashboardPage() {
  const [user, loadingUser] = useAuthState(auth);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [filters, setFilters] = useState({
    asset: "all",
    result: "all",
    direction: "all",
  });

  const tradesQuery = useMemo(() => {
    if (user) {
      return query(collection(db, "trades"), where("userId", "==", user.uid));
    }
    return null;
  }, [user]);

  const [tradesSnapshot, loadingTrades, error] = useCollection(tradesQuery);

  useEffect(() => {
    if (tradesSnapshot) {
      const tradesData = tradesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
        } as Trade;
      });
      tradesData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setAllTrades(tradesData);
    } else {
        setAllTrades([]);
    }
  }, [tradesSnapshot]);

  if (error) {
    console.error("Error fetching trades:", error);
  }
  
  const handleFilterChange = (filterType: FilterType, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredTrades = useMemo(() => filterTrades(allTrades, dateRange, filters), [allTrades, dateRange, filters]);
  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);
  
  const uniqueAssets = useMemo(() => {
    const assets = new Set(allTrades.map(t => t.asset));
    return Array.from(assets);
  }, [allTrades]);


  const isLoading = loadingUser || loadingTrades;

  return (
    <>
      <Header>
        <AddTradeModal />
        <ExportButton trades={filteredTrades} stats={stats} user={user} />
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8" id="dashboard-content">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
          </div>
        ) : (
            <StatsCards
              totalPnl={stats.totalPnl}
              winRate={stats.winRate}
              winningTrades={stats.winningTrades}
              totalTrades={stats.totalTrades}
              rrRatio={stats.rrRatio}
              dateRange={dateRange}
              setDateRange={setDateRange}
              avgPnl={stats.avgPnl}
              bestTrade={stats.bestTrade}
              worstTrade={stats.worstTrade}
            />
        )}

        <div className="grid gap-4 md:gap-8">
          {isLoading ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[325px]" />
                <Skeleton className="lg:col-span-3 h-[325px]" />
              </div>
              <Skeleton className="h-[325px]" />
              <Skeleton className="h-96" />
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 md:gap-8">
                <div className="lg:col-span-4">
                    <PerformanceChart data={stats.performanceData} />
                </div>
                <div className="lg:col-span-3">
                    <WinLossChart data={stats.winLossData} />
                </div>
              </div>
              <div className="grid gap-4 md:gap-8">
                <WeekdayPerformanceChart data={stats.weekdayPerformance} />
              </div>
              <div>
                <TradeFilters 
                    uniqueAssets={uniqueAssets}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <TradeTable trades={filteredTrades} />
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

    