export type OverviewResponse = {
  summary: {
    totalValue: number;
    totalCost: number;
    gainLossPercent: number;
  };
  categories: { name: string; value: number; gain: number }[];
  allocation: { name: string; value: number }[];
  holdingList: {
    symbol: string;
    category: string;
    quantity: string;
    avgCost: number;
    currentPrice: number;
    currentValue: number;
    gainPercent: number;
  }[];
};
export type PerformancePoint = { date: string; portfolio: number };
