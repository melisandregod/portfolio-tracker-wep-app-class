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

const pieData = [
  { name: "Stocks", value: 45 },
  { name: "ETFs", value: 25 },
  { name: "Crypto", value: 20 },
  { name: "Gold", value: 10 },
]

const chartConfig = {
  Stocks: { label: "Stocks", color: "hsl(142, 71%, 45%)" }, // green
  ETFs: { label: "ETFs", color: "hsl(217, 91%, 60%)" },     // blue
  Crypto: { label: "Crypto", color: "hsl(45, 93%, 60%)" },  // yellow
  Gold: { label: "Gold", color: "hsl(30, 90%, 60%)" },      // orange
}

export function AssetAllocationChart() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={90}
              label
            >
              {pieData.map((entry, index) => (
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
