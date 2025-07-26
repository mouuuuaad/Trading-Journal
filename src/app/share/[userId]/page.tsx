
"use client";

import { useState, useEffect, useMemo } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { WinLossChart } from "@/components/dashboard/win-loss-chart";
import { WeekdayPerformanceChart } from "@/components/dashboard/weekday-performance-chart";
import { TradeTable } from "@/components/dashboard/trade-table";
import { TradeVisionIcon } from "@/components/icons";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";


// NOTE: In a real app, you would fetch user profile data from Firestore
// based on the userId, not just rely on auth state.
// This is a placeholder for demonstration.
const getPublicUserProfile = async (userId: string) => {
    // This is a simplified version. In a real app, you'd query a 'users'
    // collection where you store public profile data.
    // For now, we'll try to get it from existing trades if possible,
    // or just use the ID.
    return {
        uid: userId,
        displayName: `User ${userId.substring(0, 6)}...`,
        photoURL: `https://avatar.vercel.sh/${userId}.png`,
    };
};


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
    { name: 'Mon', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Tue', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Wed', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Thu', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Fri', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Sat', pnl: 0, wins: 0, losses: 0, be: 0 },
    { name: 'Sun', pnl: 0, wins: 0, losses: 0, be: 0 },
  ];

  trades.forEach(trade => {
    const tradeDate = typeof trade.date === 'string' ? parseISO(trade.date) : trade.date;
    const dayIndex = getDay(tradeDate); // 0 (Sunday) to 6 (Saturday)
    weekdayPnl[dayIndex].pnl += trade.pnl;
  });

  const weekdayPerformance = [
      weekdayPnl[1], weekdayPnl[2], weekdayPnl[3], weekdayPnl[4], weekdayPnl[5]
  ];


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
    weekdayPerformance
  };
}


export default function SharePage({ params: { userId } }: { params: { userId: string } }) {
  const [userProfile, setUserProfile] = useState<{ uid: string; displayName: string; photoURL: string } | null>(null);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  
  const tradesQuery = useMemo(() => {
    if (userId) {
      return query(collection(db, "trades"), where("userId", "==", userId));
    }
    return null;
  }, [userId]);

  const [tradesSnapshot, loadingTrades, error] = useCollection(tradesQuery);

  useEffect(() => {
    const fetchProfile = async () => {
        if(userId) {
            const profile = await getPublicUserProfile(userId);
            setUserProfile(profile);
        }
    };
    fetchProfile();
  }, [userId])

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
    // You could show an error message to the user
  }

  const stats = useMemo(() => calculateStats(allTrades), [allTrades]);
  
  const isLoading = loadingTrades || !userProfile;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  };

  return (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
    <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        {isLoading ? (
            <div className="max-w-5xl mx-auto space-y-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        ) : allTrades.length === 0 ? (
            <Card className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center py-20">
                <CardHeader>
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                        <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-3xl">{userProfile?.displayName}</CardTitle>
                    <CardDescription>This user hasn't logged any trades yet.</CardDescription>
                </CardHeader>
            </Card>
        ) : (
        <div className="max-w-5xl mx-auto space-y-8">
            <header className="flex items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || 'User'} />
                    <AvatarFallback>{getInitials(userProfile?.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="font-headline text-4xl font-bold">{userProfile?.displayName}'s Profile</h1>
                    <p className="text-muted-foreground">Public Trading Performance</p>
                </div>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total P/L</p>
                            <p className="text-2xl font-bold">{stats.totalPnl >= 0 ? "+" : "-"} ${Math.abs(stats.totalPnl).toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Win Rate</p>
                            <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Trades</p>
                            <p className="text-2xl font-bold">{stats.totalTrades}</p>
                        </div>
                         <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Average R:R</p>
                            <p className="text-2xl font-bold">1 : {stats.rrRatio.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                <TradeTable trades={allTrades} />
             </div>
        </div>
        )}
      </main>
    </ThemeProvider>
  );
}
