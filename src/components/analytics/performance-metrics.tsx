"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function PerformanceMetrics() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Compound Annual Growth Rate (CAGR)</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold text-green-500">+18.4%</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sharpe Ratio</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">1.25</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Max Drawdown</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold text-red-500">-12.3%</CardContent>
      </Card>
    </section>
  )
}
