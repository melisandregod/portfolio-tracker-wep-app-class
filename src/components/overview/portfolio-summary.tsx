"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type SummaryData = {
  totalValue: number
  totalCost: number
  gainLossPercent: number
}

export function PortfolioSummary({ data }: { data: SummaryData }) {
  const gainColor =
    data.gainLossPercent > 0
      ? "text-green-500"
      : data.gainLossPercent < 0
      ? "text-red-500"
      : "text-muted-foreground"

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          ${data.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent className={`text-2xl font-bold ${gainColor}`}>
          {data.gainLossPercent.toFixed(2)}%
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Basis</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          ${data.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </CardContent>
      </Card>
    </section>
  )
}
