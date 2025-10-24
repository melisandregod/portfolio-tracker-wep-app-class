"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { useTranslations } from "next-intl";

type ProjectionPoint = { year: number; value: number }[];

export function ProjectionChart({ data }: { data: ProjectionPoint }) {
  const tr = useTranslations('analytics.projection');
  return (
    <Card className="border-none bg-gradient-to-br from-background/80 to-muted/30 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="pb-2 px-6">
        <CardTitle className="text-lg font-semibold tracking-tight flex items-end gap-2">
          {tr('title')}
          <span className="text-muted-foreground text-sm font-normal">
            {tr('subtitle')}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-6 pt-2 flex justify-center">
        <ResponsiveContainer>
          <ChartContainer
            config={{
              value: { label: "Projected Value", color: "#16a34a" },
            }}
            className="h-full"
          >
            
              <LineChart
                data={data}
                margin={{ top: 30, right: 40, left: 10, bottom: 20 }}
              >
                {/* เส้นตาราง */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

                {/* แกน X */}
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={true}
                  axisLine={true}
                  interval={0}
                  padding={{ left: 10, right: 10 }}
                />

                {/* แกน Y */}
                <YAxis
                  width={70}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={true}
                  axisLine={true}
                  tickFormatter={(v) => `$${v.toLocaleString()}`}
                />

                {/* Tooltip */}
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 0.75rem",
                  }}
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  labelFormatter={(label) => `Year ${label}`}
                />

                {/* เส้นกราฟ */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{
                    r: 6,
                    fill: "#16a34a",
                    stroke: "white",
                    strokeWidth: 2,
                  }}
                  name="Projected Value"
                />
              </LineChart>
            
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
