"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { year: 2025, value: 12450 },
  { year: 2026, value: 14800 },
  { year: 2027, value: 17600 },
  { year: 2028, value: 21100 },
  { year: 2029, value: 25300 },
]

const chartConfig = {
  value: { label: "Projected Value", color: "hsl(142, 71%, 45%)" },
}

export function ProjectionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projected Portfolio Value (5 Years)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey="year" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
