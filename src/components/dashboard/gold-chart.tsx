
"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Helper function to convert HSL string to RGB for the widget
  const getHSLColor = (variable: string) => {
    const style = getComputedStyle(document.documentElement);
    const hsl = style.getPropertyValue(variable).trim();
    // The widget seems to prefer hex or rgb, but we can try sending HSL values directly
    // It might depend on TradingView's library support. Let's re-evaluate if it fails.
    // For now, let's keep it simple and use hex values that match the theme.
    if (variable === '--primary') return '#22c55e'; // Green
    if (variable === '--destructive') return '#ef4444'; // Red
    if (variable === '--foreground') return '#f8fafc'; // Light Gray
    if (variable === '--muted-foreground') return '#a1a1aa';
    if (variable === '--card') return '#18181b';
    if (variable === '--border') return '#27272a';
    return '#ffffff';
  };

  useEffect(() => {
    // Clear the container on re-render to avoid duplicating widgets
    if (container.current) {
        container.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    // Use a variable for the theme to ensure it's captured in the closure
    const currentTheme = theme;

    const widgetConfig = {
      "symbols": [
        ["Gold", "OANDA:XAUUSD|1D"],
        ["EUR/USD", "OANDA:EURUSD|1D"],
        ["GBP/USD", "OANDA:GBPUSD|1D"],
        ["S&P 500", "SP:SPX|1D"],
        ["Nasdaq 100", "OANDA:NAS100USD|1D"]
      ],
      "chartOnly": false,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "colorTheme": currentTheme === 'light' ? 'light' : 'dark',
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
      "upColor": getHSLColor('--primary'),
      "downColor": getHSLColor('--destructive'),
      "borderUpColor": getHSLColor('--primary'),
      "borderDownColor": getHSLColor('--destructive'),
      "wickUpColor": getHSLColor('--primary'),
      "wickDownColor": getHSLColor('--destructive'),
    };
    
    script.innerHTML = JSON.stringify(widgetConfig);

    if (container.current) {
      container.current.appendChild(script);
    }
  }, [theme]); // Re-run the effect if the theme changes

  return (
    <Card className='h-[380px] w-full p-0'>
        <div className="tradingview-widget-container h-full" ref={container}>
             <div className="tradingview-widget-container__widget h-full"></div>
        </div>
    </Card>
  );
}

const MemoizedTradingViewWidget = memo(TradingViewWidget);

// We still need a named export for the component
// Let's rename the old component to avoid confusion
// Renaming to TradingViewWidget and keeping the file name as gold-chart for now.
// Will rename the file in a subsequent step if needed.
import {
  Card,
} from "@/components/ui/card";

export function GoldChart() {
    return <MemoizedTradingViewWidget />
}
