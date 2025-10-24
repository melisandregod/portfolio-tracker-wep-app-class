"use client"

import { useTranslations } from "next-intl"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"

export type Allocation = { name: string; value: number }

export function AssetAllocationChart({ data }: { data: Allocation[] }) {
  const t = useTranslations("overview.allocation")

  const chartConfig: ChartConfig = {
    CRYPTO: { label: t("labels.CRYPTO"), color: "#2563eb" },
    STOCK: { label: t("labels.STOCK"), color: "#16a34a" },
    ETF: { label: t("labels.ETF"), color: "#facc15" },
    GOLD: { label: t("labels.GOLD"), color: "#f97316" }
  }

  if (!data?.length)
    return (
      <Card className="border-none bg-muted/30 text-center py-12">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">{t("noData")}</CardContent>
      </Card>
    )

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center p-6">
        <ResponsiveContainer>
          <ChartContainer config={chartConfig}>
            <PieChart width={260} height={260}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={3}
                stroke="#fff"
                strokeWidth={2}
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                isAnimationActive
              >
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={chartConfig[entry.name]?.color || "#999"}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
