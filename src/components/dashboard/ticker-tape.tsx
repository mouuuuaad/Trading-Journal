"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

function TickerTapeWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!container.current) {
      return;
    }

    // Clear previous widget content
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;

    // Dynamically set the theme for the widget
    const currentTheme = theme === "system" 
      ? window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? "dark" 
        : "light" 
      : theme;

    const widgetConfig = {
      "symbols": [
        { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500 Index" },
        { "proName": "FOREXCOM:NSXUSD", "title": "US 100 Cash CFD" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR to USD" },
        { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
        { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
        { "proName": "CAPITALCOM:GOLD", "title": "XAU-USD" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",  // Use the dynamic theme
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    container.current.appendChild(script);
  }, [theme]);

  return (
    <div 
      className="tradingview-widget-container bg-white dark:bg-transparent" 
      ref={container} 
      style={{ height: "46px", width: "100%" }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export const TickerTape = memo(TickerTapeWidget);
