
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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

  const pnlMin = Math.min(...data.map(d => d.pnl), 0) * 1.1;
  const pnlMax = Math.max(...data.map(d => d.pnl), 0) * 1.1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Daily Performance</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="h-[250px] w-full p-0">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
                domain={[pnlMin, pnlMax]}
              />
              <Tooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="pnl" radius={2}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
