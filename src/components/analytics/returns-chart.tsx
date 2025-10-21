"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", returns: 2.5 },
  { month: "Feb", returns: 1.2 },
  { month: "Mar", returns: -0.8 },
  { month: "Apr", returns: 3.1 },
  { month: "May", returns: 1.9 },
]

const chartConfig = {
  returns: { label: "Monthly Returns", color: "hsl(142, 71%, 45%)" },
}

export function ReturnsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="returns" fill="var(--color-returns)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
