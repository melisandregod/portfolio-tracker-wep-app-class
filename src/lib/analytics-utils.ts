// lib/analytics-utils.ts
export type Transaction = {
  date: Date
  amount: number
  category: "Stock" | "ETF" | "Crypto" | "Gold"
  asset: string
  gainLoss: number // เช่น +100 หรือ -50
  value: number    // มูลค่าปัจจุบัน
}

export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0
  return Math.pow(endValue / startValue, 1 / years) - 1
}

export function calculateSharpeRatio(returns: number[], riskFreeRate = 0.02): number {
  if (returns.length === 0) return 0
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  )
  return stdDev === 0 ? 0 : (avgReturn - riskFreeRate) / stdDev
}

export function calculateMaxDrawdown(values: number[]): number {
  let peak = values[0]
  let maxDrawdown = 0
  for (const value of values) {
    if (value > peak) peak = value
    const drawdown = (value - peak) / peak
    if (drawdown < maxDrawdown) maxDrawdown = drawdown
  }
  return maxDrawdown
}

