
export type OverviewResponse = {
  summary: {
    totalValue: number
    totalCost: number
    gainLossPercent: number
  }
  categories: { name: string; value: number; gain: number }[]
  allocation: { name: string; value: number }[]
  topHoldings: {
    symbol: string
    type: string
    value: number
    gain: string
    allocation: string
  }[]
  performance: { date: string; portfolio: number; benchmark: number }[]
}
