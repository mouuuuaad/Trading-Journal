
"use client";

import { Bar, BarChart, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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

type WeekdayPerformanceChartProps = {
  data: { name: string; pnl: number }[];
};

export function WeekdayPerformanceChart({ data }: WeekdayPerformanceChartProps) {
  const chartConfig = {
    pnl: {
      label: "P/L",
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Daily Performance</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="h-[250px] w-full p-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" formatter={(value, name) => <div>{name}: <span className={cn("font-bold", Number(value) >= 0 ? "text-primary": "text-destructive")}>${Number(value).toFixed(2)}</span></div>}/>}
              />
              <Bar dataKey="pnl" radius={2}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
