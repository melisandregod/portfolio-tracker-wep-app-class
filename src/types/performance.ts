export type PortfolioPerformancePoint = {
  date: string
  portfolio: number
}

export type BenchmarkSeries = {
  name: "sp500" | "nasdaq" | "btc" | "gold"
  data: { date: string; value: number }[]
}

export type MergedPerformancePoint = {
  date: string
  portfolio?: number
  sp500?: number
  nasdaq?: number
  btc?: number
  gold?: number
}
