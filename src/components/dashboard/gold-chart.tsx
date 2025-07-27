
"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';
import { Card } from "@/components/ui/card";


function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (container.current) {
        container.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const currentTheme = theme;

    const widgetConfig = {
      "symbols": [
        ["Gold", "OANDA:XAUUSD|1D"],
        ["EUR/USD", "OANDA:EURUSD|1D"],
        ["GBP/USD", "OANDA:GBPUSD|1D"],
        ["Nasdaq 100", "OANDA:NAS100USD|1D"]
      ],
      "chartOnly": false,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "colorTheme": currentTheme === 'light' ? 'light' : 'dark',
      "isTransparent": false,
      "backgroundColor": "#000000",
      "autosize": true,
      "showVolume": true,
      "showMA": false,
      "hideDateRanges": false,
      "hideMarketStatus": false,
      "hideSymbolLogo": false,
      "scalePosition": "right",
      "scaleMode": "Normal",
      "fontFamily": "Inter, sans-serif",
      "fontSize": "10",
      "noTimeScale": false,
      "valuesTracking": "1",
      "changeMode": "price-and-percent",
      "chartType": "area",
      "maLineColor": "#2962FF",
      "maLineWidth": 1,
      "maLength": 9,
      "lineWidth": 2,
      "lineType": 0,
      "dateRanges": ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
      "upColor": "hsl(var(--primary))",
      "downColor": "hsl(var(--destructive))",
      "borderUpColor": "hsl(var(--primary))",
      "borderDownColor": "hsl(var(--destructive))",
      "wickUpColor": "hsl(var(--primary))",
      "wickDownColor": "hsl(var(--destructive))",
    };
    
    script.innerHTML = JSON.stringify(widgetConfig);

    if (container.current) {
      container.current.appendChild(script);
    }
  }, [theme]);

  return (
    <Card className='h-[380px] w-full p-0 overflow-hidden'>
        <div className="tradingview-widget-container h-full" ref={container}>
             <div className="tradingview-widget-container__widget h-full"></div>
        </div>
    </Card>
  );
}

const MemoizedTradingViewWidget = memo(TradingViewWidget);


export function GoldChart() {
    return <MemoizedTradingViewWidget />
}
