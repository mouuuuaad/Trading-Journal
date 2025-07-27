
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
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
import { AddTradeModal } from "@/components/dashboard/add-trade-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExportButton } from "@/components/dashboard/export-button";

type DateRange = "all" | "today" | "this-week" | "this-month" | "this-year";

function filterTrades(
    trades: Trade[],
    dateRange: DateRange,
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
      return trades;
  }

  return trades.filter(trade => {
    const tradeDate = typeof trade.date === 'string' ? parseISO(trade.date) : trade.date;
    return tradeDate >= startDate;
  });
}

function calculateStats(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalTrades: 0,
      bestTradePnl: 0,
      worstTradePnl: 0,
      avgTradePnl: 0,
      performanceData: [],
      weekdayPerformance: [],
      beTrades: 0,
      rrRatio: 0,
    };
  }

  const totalPnl = trades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => trade.result === "Win").length;
  const losingTrades = trades.filter((trade) => trade.result === "Loss").length;
  const beTrades = trades.filter((trade) => trade.result === "BE").length;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const avgTradePnl = totalTrades > 0 ? totalPnl / totalTrades : 0;

  const bestTradePnl = trades.length > 0 ? Math.max(...trades.map(t => t.pnl)) : 0;
  const worstTradePnl = trades.length > 0 ? Math.min(...trades.map(t => t.pnl)) : 0;

    const totalReward = trades.filter(t => t.result === 'Win').reduce((acc, trade) => acc + Math.abs(trade.takeProfit - trade.entryPrice), 0);
    const totalRisk = trades.filter(t => t.result === 'Loss').reduce((acc, trade) => acc + Math.abs(trade.entryPrice - trade.stopLoss), 0);
    const averageReward = winningTrades > 0 ? totalReward / winningTrades : 0;
    const averageRisk = losingTrades > 0 ? totalRisk / losingTrades : 0;
    const rrRatio = averageRisk > 0 ? averageReward / averageRisk : 0;


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
    totalTrades,
    bestTradePnl,
    worstTradePnl,
    avgTradePnl,
    performanceData,
    weekdayPerformance: weekdayPnl,
    beTrades,
    rrRatio,
  };
}


export default function DashboardPage() {
  const [user, loadingUser] = useAuthState(auth);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("all");
  
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
      // Sort by date descending (newest first) for the table
      tradesData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setAllTrades(tradesData);
    } else {
        setAllTrades([]);
    }
  }, [tradesSnapshot]);

  if (error) {
    console.error("Error fetching trades:", error);
  }

  const filteredTrades = useMemo(() => filterTrades(allTrades, dateRange), [allTrades, dateRange]);
  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);
  
  const isLoading = loadingUser || loadingTrades;

  return (
    <>
      <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-foreground">Trade Journal</h1>
            <div className="flex items-center gap-2">
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Select Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                    </SelectContent>
                </Select>
                <ExportButton trades={filteredTrades} stats={stats} user={user} />
                <AddTradeModal />
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isLoading ? (
                <>
                   <Skeleton className="lg:col-span-2 h-[382px]" />
                   <Skeleton className="lg:col-span-1 h-[382px]" />
                   <Skeleton className="lg:col-span-3 h-[302px]" />
                   <Skeleton className="lg:col-span-3 h-[400px]" />
                </>
            ) : (
                <>
                    {/* Main charts and stats */}
                    <div className="lg:col-span-2">
                        <PerformanceChart data={stats.performanceData} totalPnl={stats.totalPnl} />
                    </div>
                    <div className="lg:col-span-1">
                        <StatsCards stats={stats} />
                    </div>
                    {/* Daily Performance */}
                    <div className="lg:col-span-3">
                         <WeekdayPerformanceChart data={stats.weekdayPerformance} />
                    </div>
                    {/* Trade Table */}
                    <div className="lg:col-span-3">
                        <TradeTable trades={filteredTrades} />
                    </div>
                </>
            )}
        </div>
      </main>
    </>
  );
}
