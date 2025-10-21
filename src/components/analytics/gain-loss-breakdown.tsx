"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell } from "recharts"

const data = [
  { name: "Stocks", value: 5400 },
  { name: "ETFs", value: 2100 },
  { name: "Crypto", value: 3500 },
  { name: "Gold", value: 900 },
]

const chartConfig = {
  Stocks: { label: "Stocks", color: "hsl(142, 71%, 45%)" },
  ETFs: { label: "ETFs", color: "hsl(217, 91%, 60%)" },
  Crypto: { label: "Crypto", color: "hsl(45, 93%, 60%)" },
  Gold: { label: "Gold", color: "hsl(30, 90%, 60%)" },
}

export function GainLossBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gain / Loss by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} >
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={index} fill={Object.values(chartConfig)[index].color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
