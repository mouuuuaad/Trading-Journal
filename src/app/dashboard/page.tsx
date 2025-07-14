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
import { TradeTable } from "@/components/dashboard/trade-table";
import { Trade } from "@/lib/types";

function calculateStats(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      winningTrades: 0,
      totalTrades: 0,
      rrRatio: 0,
      performanceData: [],
      winLossData: [
        { name: 'Wins', value: 0, fill: "hsl(var(--accent))" },
        { name: 'Losses', value: 0, fill: "hsl(var(--destructive))" },
        { name: 'Break Even', value: 0, fill: "hsl(var(--muted-foreground))" },
      ],
    };
  }

  const totalPnl = trades.reduce((acc, trade) => acc + (trade.pnl || 0), 0);
  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => trade.result === "Win").length;
  const losingTrades = trades.filter((trade) => trade.result === "Loss").length;
  const beTrades = trades.filter((trade) => trade.result === "BE").length;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const totalReward = trades.reduce((acc, trade) => {
    if (trade.direction === 'Buy') {
      return acc + (trade.takeProfit - trade.entryPrice);
    } else {
      return acc + (trade.entryPrice - trade.takeProfit);
    }
  }, 0);

  const totalRisk = trades.reduce((acc, trade) => {
    if (trade.direction === 'Buy') {
      return acc + (trade.entryPrice - trade.stopLoss);
    } else {
      return acc + (trade.stopLoss - trade.entryPrice);
    }
  }, 0);

  const averageRisk = totalTrades > 0 ? totalRisk / totalTrades : 0;
  const averageReward = totalTrades > 0 ? totalReward / totalTrades : 0;

  const rrRatio = averageRisk > 0 ? Math.abs(averageReward / averageRisk) : 0;

  const performanceData = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const cumulativePnl = (acc[index - 1]?.pnl || 0) + (trade.pnl || 0);
      acc.push({ date: `Trade #${index + 1}`, pnl: cumulativePnl });
      return acc;
    }, [] as { date: string; pnl: number }[]);

  const winLossData = [
    { name: 'Wins', value: winningTrades, fill: "hsl(var(--accent))" },
    { name: 'Losses', value: losingTrades, fill: "hsl(var(--destructive))" },
    { name: 'Break Even', value: beTrades, fill: "hsl(var(--muted-foreground))" },
  ];

  return {
    totalPnl,
    winRate,
    winningTrades,
    totalTrades,
    rrRatio,
    performanceData,
    winLossData
  };
}


export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [trades, setTrades] = useState<Trade[]>([]);

  const tradesQuery = useMemo(() => {
    if (user) {
      return query(collection(db, "trades"), where("userId", "==", user.uid));
    }
    return null;
  }, [user]);

  const [tradesSnapshot] = useCollection(tradesQuery);

  useEffect(() => {
    if (tradesSnapshot) {
      const tradesData = tradesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Trade));
      setTrades(tradesData);
    } else {
      setTrades([]);
    }
  }, [tradesSnapshot]);
  
  const stats = calculateStats(trades);

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <StatsCards 
          totalPnl={stats.totalPnl}
          winRate={stats.winRate}
          winningTrades={stats.winningTrades}
          totalTrades={stats.totalTrades}
          rrRatio={stats.rrRatio}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <PerformanceChart data={stats.performanceData} />
          </div>
          <div className="lg:col-span-3">
            <WinLossChart data={stats.winLossData} />
          </div>
        </div>
        <TradeTable trades={trades} />
      </main>
    </>
  );
}
