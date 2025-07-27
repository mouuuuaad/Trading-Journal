
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type StatsCardsProps = {
  stats: {
    totalPnl: number;
    winRate: number;
    winningTrades: number;
    losingTrades: number;
    totalTrades: number;
    bestTradePnl: number;
    worstTradePnl: number;
    avgTradePnl: number;
  }
};


const StatRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex items-center justify-between text-sm">
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export function StatsCards({ stats }: StatsCardsProps) {
  const { 
    totalPnl, winRate, winningTrades, losingTrades, 
    totalTrades, bestTradePnl, worstTradePnl, avgTradePnl
  } = stats;

  const lossRate = totalTrades > 0 ? (losingTrades / totalTrades) * 100 : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Statistics</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-primary">W {winRate.toFixed(0)}%</div>
                <div className="text-sm font-semibold text-destructive">L {lossRate.toFixed(0)}%</div>
            </div>
            <Progress value={winRate} className="h-2" />
        </div>
        
        <div className="space-y-2">
            <StatRow label="Number of Winners" value={winningTrades} />
            <StatRow label="Number of Losers" value={losingTrades} />
            <StatRow label="Largest Win" value={`$${bestTradePnl.toFixed(2)}`} />
            <StatRow label="Largest Loss" value={`$(${Math.abs(worstTradePnl).toFixed(2)})`} />
            <StatRow label="Average Gain/Loss" value={`$${avgTradePnl.toFixed(2)}`} />
        </div>

        <div className="space-y-2 border-t pt-4">
            <StatRow label="Realized P&L" value={`$${totalPnl.toFixed(2)}`} />
            <StatRow label="Unrealized P&L" value={"$0.00"} />
            <StatRow label="Total P&L" value={`$${totalPnl.toFixed(2)}`} />
        </div>

      </CardContent>
    </Card>
  );
}
