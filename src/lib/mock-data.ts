import type { Trade } from './types';

export const mockTrades: Trade[] = [
  { id: '1', date: '2024-07-22', asset: 'EUR/USD', direction: 'Buy', entryPrice: 1.085, stopLoss: 1.082, takeProfit: 1.09, result: 'Win', pnl: 500 },
  { id: '2', date: '2024-07-21', asset: 'GBP/JPY', direction: 'Sell', entryPrice: 201.5, stopLoss: 202, takeProfit: 200, result: 'Win', pnl: 1500 },
  { id: '3', date: '2024-07-20', asset: 'BTC/USD', direction: 'Buy', entryPrice: 65000, stopLoss: 64000, takeProfit: 68000, result: 'Loss', pnl: -1000 },
  { id: '4', date: '2024-07-19', asset: 'ETH/USD', direction: 'Buy', entryPrice: 3400, stopLoss: 3350, takeProfit: 3500, result: 'Win', pnl: 1000 },
  { id: '5', date: '2024-07-18', asset: 'USD/CAD', direction: 'Sell', entryPrice: 1.37, stopLoss: 1.375, takeProfit: 1.36, result: 'Win', pnl: 1000 },
  { id: '6', date: '2024-07-17', asset: 'AUD/USD', direction: 'Buy', entryPrice: 0.665, stopLoss: 0.66, takeProfit: 0.675, result: 'Loss', pnl: -500 },
  { id: '7', date: '2024-07-16', asset: 'GOLD', direction: 'Buy', entryPrice: 2330, stopLoss: 2320, takeProfit: 2360, result: 'Win', pnl: 3000 },
  { id: '8', date: '2024-07-15', asset: 'SPX500', direction: 'Sell', entryPrice: 5500, stopLoss: 5520, takeProfit: 5450, result: 'BE', pnl: 0 },
];
