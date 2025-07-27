
"use client";

import { useEffect, useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
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

type Candlestick = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

// Generates some pseudo-realistic looking candlestick data
function generateCandlestickData(count = 100): Candlestick[] {
  const data: Candlestick[] = [];
  let lastClose = 2330 + Math.random() * 40 - 20; // Start around 2330

  for (let i = 0; i < count; i++) {
    const time = new Date();
    time.setMinutes(time.getMinutes() + i * 15); // 15-minute intervals

    const open = lastClose;
    const close = open + (Math.random() - 0.5) * 10;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
    });
    
    lastClose = close;
  }
  return data;
}

export function GoldChart() {
  const [data, setData] = useState<Candlestick[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const initialData = generateCandlestickData();
    setData(initialData);
    if(initialData.length > 0) {
      setCurrentPrice(initialData[initialData.length-1].close);
    }

    const interval = setInterval(() => {
        setData(prevData => {
            const newData = [...prevData];
            const lastCandle = newData[newData.length - 1];
            
            const open = lastCandle.close;
            const close = open + (Math.random() - 0.5) * 2;
            const high = Math.max(open, close) + Math.random();
            const low = Math.min(open, close) - Math.random();
            const time = new Date();
            
            // Simple logic to keep the chart moving
            const updatedLastCandle = { ...lastCandle, high: Math.max(lastCandle.high, high), low: Math.min(lastCandle.low, low), close };
            newData[newData.length-1] = updatedLastCandle;
            
            setCurrentPrice(close);

            // If new 15-min interval, add new candle
            // This part is simplified. A real chart would have more complex time logic.
            if(new Date().getMinutes() % 15 === 0) {
              return [...newData.slice(1), {
                  time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  open: lastCandle.close,
                  high: close + Math.random(),
                  low: close - Math.random(),
                  close: close,
              }];
            }
            
            return newData;
        });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);

  }, []);

  const chartConfig = {
    price: { label: 'Price', color: 'hsl(var(--chart-2))' },
  };

  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 0];
    const prices = data.flatMap(d => [d.low, d.high]);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle className="text-base font-semibold">Gold (XAU/USD)</CardTitle>
                <CardDescription>15-minute simulated price chart</CardDescription>
            </div>
            <div className="text-right">
                 <p className="text-2xl font-bold text-foreground">${currentPrice.toFixed(2)}</p>
                 <p className="text-sm font-medium text-primary">+0.12 (+0.01%)</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="h-[250px] w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
             <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
            <YAxis orientation="right" domain={yDomain} tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value.toFixed(2)}`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if(active && payload && payload.length) {
                    const candle = payload[0].payload as Candlestick;
                    return (
                        <div className="p-2 bg-background/80 border rounded-md shadow-lg text-sm">
                            <p className="font-bold">{label}</p>
                            <p><span className="text-muted-foreground">Open:</span> ${candle.open.toFixed(2)}</p>
                            <p><span className="text-muted-foreground">High:</span> ${candle.high.toFixed(2)}</p>
                            <p><span className="text-muted-foreground">Low:</span> ${candle.low.toFixed(2)}</p>
                            <p><span className="text-muted-foreground">Close:</span> ${candle.close.toFixed(2)}</p>
                        </div>
                    )
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              fill="url(#colorPrice)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine y={currentPrice} stroke="hsl(var(--primary))" strokeDasharray="3 3">
            </ReferenceLine>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
