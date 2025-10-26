"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { PerformancePoint } from "@/types/overview";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from "next-intl";

interface Props {
  data?: PerformancePoint[];
  isLoading?: boolean;
  range: "day" | "week" | "month" | "year" | "max"; // เพิ่ม "week"
  setRange: (r: "day" | "week" | "month" | "year" | "max") => void; // ✅
}

export function PerformanceChart({ data, isLoading, range, setRange }: Props) {
  const t = useTranslations("overview.performance");

  // เพิ่ม week ในปุ่มเลือกช่วงเวลา
  const ranges: { key: typeof range; label: string }[] = [
    { key: "day", label: t("ranges.day") },
    { key: "week", label: t("ranges.week") },
    { key: "month", label: t("ranges.month") },
    { key: "year", label: t("ranges.year") },
    { key: "max", label: t("ranges.max") },
  ];

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
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

      <CardContent className="px-1 py-4">
        {isLoading || !data ? (
          <Skeleton className="h-[300px] rounded-xl" />
        ) : (
          <div className="h-[300px] w-full flex justify-center items-center">
            <ChartContainer
              config={{
                portfolio: { label: "Portfolio", color: "#16a34a" },
              }}
              className="h-full"
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
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(value) => {
                    const d = new Date(value);
                    return d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
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
