"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const performanceData = [
  { month: "Jan", portfolio: 10000, benchmark: 9800 },
  { month: "Feb", portfolio: 10200, benchmark: 9950 },
  { month: "Mar", portfolio: 10500, benchmark: 10100 },
  { month: "Apr", portfolio: 10750, benchmark: 10300 },
]

const chartConfig = {
  portfolio: { label: "Portfolio", color: "hsl(142, 71%, 45%)" },
  benchmark: { label: "Benchmark", color: "hsl(220, 9%, 65%)" },
}

export function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="portfolio" stroke="var(--color-portfolio)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="benchmark" stroke="var(--color-benchmark)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
