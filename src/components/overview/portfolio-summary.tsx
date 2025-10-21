"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet } from "lucide-react"

type SummaryData = {
  totalValue: number
  totalCost: number
  gainLossPercent: number
}

export function PortfolioSummary({ data }: { data: SummaryData }) {
  // คำนวณ gain/loss มูลค่าเงิน (USD)
  const gainLossValue = data.totalValue - data.totalCost

  const isGain = gainLossValue > 0
  const isLoss = gainLossValue < 0

  const gainColor = isGain
    ? "text-green-600"
    : isLoss
    ? "text-red-500"
    : "text-muted-foreground"

  const gainIcon = isGain ? (
    <ArrowUpRight className="h-5 w-5 text-green-600" />
  ) : isLoss ? (
    <ArrowDownRight className="h-5 w-5 text-red-500" />
  ) : (
    <TrendingUp className="h-5 w-5 text-muted-foreground" />
  )

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Portfolio Value */}
      <Card className="border-none bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/5 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-600" />
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
          ${data.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </CardContent>
      </Card>

      {/* Gain / Loss */}
      <Card className="border-none bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/40 dark:to-gray-800/20 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {gainIcon}
            Total Gain / Loss
          </CardTitle>
        </CardHeader>
        <CardContent className={`text-3xl font-bold ${gainColor}`}>
          {isGain && "+"}${Math.abs(gainLossValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
          <span className="text-lg font-semibold ml-1">
            ({data.gainLossPercent.toFixed(2)}%)
          </span>
        </CardContent>
      </Card>

      {/* Cost Basis */}
      <Card className="border-none bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/5 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-600" />
            Cost Basis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
          ${data.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </CardContent>
      </Card>
    </section>
  )
}
