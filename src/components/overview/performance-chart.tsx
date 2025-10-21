"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
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
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Performance</CardTitle>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <Button
              key={r.key}
              size="sm"
              variant={range === r.key ? "default" : "ghost"}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-50 pb-2">
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[360px] w-full">
            <ChartContainer
              config={{
                portfolio: { label: "Portfolio", color: "#16a34a" },
              }}
              className="h-full w-full"
            >
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
