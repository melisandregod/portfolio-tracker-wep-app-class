"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function TransactionSummary() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Buy</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">$8,400</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Sell</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold">$5,200</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold text-green-500">
          +$1,230
        </CardContent>
      </Card>
    </section>
  )
}
