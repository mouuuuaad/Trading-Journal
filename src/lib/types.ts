export type Trade = {
  id: string;
  date: Date; // Changed to Date for easier sorting and filtering
  asset: string;
  direction: 'Buy' | 'Sell';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  result: 'Win' | 'Loss' | 'BE';
  pnl: number;
  notes?: string;
  screenshotUrl?: string;
  userId: string;
};
