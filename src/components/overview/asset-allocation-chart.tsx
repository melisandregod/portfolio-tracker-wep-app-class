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
import { Pie, PieChart, Cell } from "recharts";

// Type ของข้อมูล Allocation ที่มาจาก API
export type Allocation = {
  name: string;
  value: number;
};

// Chart config ใช้กำหนดสีและ label ของ chart (ตาม type ChartConfig)
const chartConfig: ChartConfig = {
  CRYPTO: { label: "Crypto", color: "#2563eb" },
  STOCK: { label: "Stock", color: "#16a34a" },
  ETF: { label: "ETF", color: "#facc15" },
  GOLD: { label: "Gold", color: "#f97316" },
};

export function AssetAllocationChart({ data }: { data: Allocation[] }) {
  if (!data?.length)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          No data available
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ChartContainer ต้องมี config ที่ type ตรงกับ ChartConfig */}
        <ChartContainer config={chartConfig}>
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, value }) => `${name} ${value}%`}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={chartConfig[entry.name]?.color || "#999"} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
