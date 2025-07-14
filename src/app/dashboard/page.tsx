import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { WinLossChart } from "@/components/dashboard/win-loss-chart";
import { TradeTable } from "@/components/dashboard/trade-table";
import { mockTrades } from "@/lib/mock-data";
import { Trade } from "@/lib/types";

function calculateStats(trades: Trade[]) {
  const totalPnl = trades.reduce((acc, trade) => acc + trade.pnl, 0);
  const totalTrades = trades.length;
  const winningTrades = trades.filter((trade) => trade.result === "Win").length;
  const losingTrades = trades.filter((trade) => trade.result === "Loss").length;
  const beTrades = trades.filter((trade) => trade.result === "BE").length;

  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  const totalRisk = trades.reduce((acc, trade) => {
    if (trade.direction === 'Buy') {
      return acc + (trade.entryPrice - trade.stopLoss);
    } else {
      return acc + (trade.stopLoss - trade.entryPrice);
    }
  }, 0);
  
  const totalReward = trades.reduce((acc, trade) => {
    if (trade.direction === 'Buy') {
      return acc + (trade.takeProfit - trade.entryPrice);
    } else {
      return acc + (trade.entryPrice - trade.takeProfit);
    }
  }, 0);

  const averageRisk = totalRisk / totalTrades;
  const averageReward = totalReward / totalTrades;
  const rrRatio = averageRisk > 0 ? averageReward / averageRisk : 0;


  const performanceData = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade, index) => {
      const cumulativePnl = (acc[index - 1]?.pnl || 0) + trade.pnl;
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
  const stats = calculateStats(mockTrades);

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
        <TradeTable />
      </main>
    </>
  );
}
