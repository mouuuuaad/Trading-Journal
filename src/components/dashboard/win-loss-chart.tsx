"use client";

import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

type WinLossChartProps = {
  data: { name: string; value: number; fill: string; }[];
};

export function WinLossChart({ data }: WinLossChartProps) {
  const chartConfig = {
    value: {
      label: "Trades",
    },
    wins: {
      label: "Wins",
      color: "hsl(var(--accent))",
    },
    losses: {
      label: "Losses",
      color: "hsl(var(--destructive))",
    },
    breakEven: {
      label: "Break Even",
      color: "hsl(var(--muted-foreground))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Trade Outcomes</CardTitle>
        <CardDescription>A breakdown of your trading results.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              >
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="name" />}
                className="-mt-4"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
