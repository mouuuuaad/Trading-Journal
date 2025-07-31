
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  <div className="flex items-baseline justify-between text-sm">
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
      <CardTitle className="text-base font-semibold">الإحصائيات</CardTitle>
      <Info className="h-4 w-4 text-muted-foreground" />
    </div>
  </CardHeader>
  
  <CardContent className="space-y-4">
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-primary">رابحة {winRate.toFixed(0)}%</div>
        <div className="text-sm font-semibold text-destructive">خاسرة {lossRate.toFixed(0)}%</div>
      </div>
      <Progress value={winRate} className="h-1.5" />
    </div>
    
    <div className="space-y-2 text-sm">
      <StatRow label="عدد الصفقات الرابحة" value={winningTrades} />
      <StatRow label="عدد الصفقات الخاسرة" value={losingTrades} />
      <StatRow label="أكبر ربح" value={`$${bestTradePnl.toFixed(2)}`} />
      <StatRow label="أكبر خسارة" value={`$(${Math.abs(worstTradePnl).toFixed(2)})`} />
      <StatRow label="متوسط الربح/الخسارة" value={`$${avgTradePnl.toFixed(2)}`} />
    </div>

    <Separator />

    <div className="space-y-2 text-sm">
      <StatRow label="الأرباح والخسائر المحققة" value={`$${totalPnl.toFixed(2)}`} />
      <StatRow label="الأرباح والخسائر غير المحققة" value={"$0.00"} />
      <StatRow label="إجمالي الأرباح والخسائر" value={`$${totalPnl.toFixed(2)}`} />
    </div>
  </CardContent>
</Card>

  );
}
