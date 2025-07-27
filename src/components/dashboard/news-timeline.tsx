
"use client";

import React, { useEffect, useRef, memo } from 'react';
import { useTheme } from 'next-themes';

function NewsTimelineWidget() {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (container.current && container.current.children.length === 0) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;

      const widgetConfig = {
          "feedMode": "all_symbols",
          "isTransparent": true,
          "displayMode": "regular",
          "width": "100%",
          "height": "100%",
          "colorTheme": theme === 'light' ? 'light' : 'dark',
          "locale": "en"
      };

      script.innerHTML = JSON.stringify(widgetConfig);
      container.current.appendChild(script);
    }
  }, [theme]);

  return (
    <div className="tradingview-widget-container h-full w-full" ref={container}>
      <div className="tradingview-widget-container__widget h-full"></div>
    </div>
  );
}

export const NewsTimeline = memo(NewsTimelineWidget);
