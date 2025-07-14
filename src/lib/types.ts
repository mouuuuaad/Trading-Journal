export type Trade = {
  id: string;
  date: string;
  asset: string;
  direction: 'Buy' | 'Sell';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  result: 'Win' | 'Loss' | 'BE';
  pnl: number;
  notes?: string;
  userId: string;
};
