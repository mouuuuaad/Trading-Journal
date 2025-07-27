
"use client";

import { Area, AreaChart, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Info } from "lucide-react";

type PerformanceChartProps = {
  data: { date: string; pnl: number }[];
  totalPnl: number;
};

export function PerformanceChart({ data, totalPnl }: PerformanceChartProps) {
  const chartConfig = {
    pnl: {
      label: "P/L",
      color: "hsl(var(--chart-2))",
    },
  };

  const totalPnlFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalPnl);


  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Realized P&L</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalPnlFormatted}</p>
        </div>
      </CardHeader>
      <CardContent className="h-[250px] w-full p-0">
        <ChartContainer config={chartConfig}>
           <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="pnl"
                type="natural"
                fill="url(#colorPnl)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
