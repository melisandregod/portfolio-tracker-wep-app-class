"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

// Type ของข้อมูล Allocation ที่มาจาก API
export type Allocation = {
  name: string;
  value: number;
};

// Chart config ใช้กำหนดสีและ label ของ chart
const chartConfig: ChartConfig = {
  CRYPTO: { label: "Crypto", color: "#2563eb" },
  STOCK: { label: "Stock", color: "#16a34a" },
  ETF: { label: "ETF", color: "#facc15" },
  GOLD: { label: "Gold", color: "#f97316" },
};

export function AssetAllocationChart({ data }: { data: Allocation[] }) {
  if (!data?.length)
    return (
      <Card className="border-none bg-muted/30 text-center py-12">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Asset Allocation
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center p-6">
        {/* Chart Section */}
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
  );
}
