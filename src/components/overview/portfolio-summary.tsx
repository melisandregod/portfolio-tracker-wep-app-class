"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function PortfolioSummary() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">$12,450</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold text-green-500">+8.3%</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Basis</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">$11,500</CardContent>
      </Card>
    </section>
  )
}
