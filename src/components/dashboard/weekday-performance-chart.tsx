
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
        <CardTitle className="font-headline">Weekday Performance</CardTitle>
        <CardDescription>Your total profit and loss for each day of the week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              <Bar dataKey="pnl" radius={4}>
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
