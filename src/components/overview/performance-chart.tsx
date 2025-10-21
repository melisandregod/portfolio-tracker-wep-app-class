"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { PerformancePoint } from "@/types/overview";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data?: PerformancePoint[];
  isLoading?: boolean;
  range: "day" | "month" | "year" | "max";
  setRange: (r: "day" | "month" | "year" | "max") => void;
}

export function PerformanceChart({ data, isLoading, range, setRange }: Props) {
  const ranges: { key: typeof range; label: string }[] = [
    { key: "day", label: "1D" },
    { key: "month", label: "1M" },
    { key: "year", label: "1Y" },
    { key: "max", label: "MAX" },
  ];

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">
          Portfolio Performance
        </CardTitle>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <Button
              key={r.key}
              size="sm"
              variant={range === r.key ? "default" : "ghost"}
              className={`rounded-full ${
                range === r.key
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "text-muted-foreground"
              }`}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-50 pb-6">
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full rounded-xl" />
        ) : (
          <div className="h-[340px] w-full">
            <ChartContainer
              config={{
                portfolio: { label: "Portfolio", color: "#16a34a" },
              }}
              className="h-full w-full"
            >
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                {/* Gradient Background */}
                <defs>
                  <linearGradient
                    id="colorPortfolio"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                   
                  tickLine={true}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    // ตัวอย่าง: "Oct 21"
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  
                />
                <YAxis
                  tickLine={true}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => {
                    if (value >= 1_000_000)
                      return `${(value / 1_000_000).toFixed(1)}M`;
                    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
                    return value.toFixed(0);
                  }}
                />
                <Tooltip content={<ChartTooltipContent />} />

                <Area
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPortfolio)"
                  animationDuration={800}
                />

                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
