"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface PerformanceCompareResponse {
  portfolio: { date: string; value: number }[];
  benchmarks: {
    name: string;
    data: { date: string; value: number }[];
  }[];
}

interface MergedPerformancePoint {
  date: string;
  portfolio?: number;
  [key: string]: number | string | undefined;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function PerformanceBenchmarks() {
  type RangeType = "day" | "month" | "year" | "max";
  const [range, setRange] = useState<RangeType>("year");
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>([
    "sp500",
    "nasdaq",
  ]);

  // ใช้ API เดียวรวมทั้ง portfolio + benchmarks
  const { data, isLoading } = useSWR<PerformanceCompareResponse>(
    `/api/analytics/benchmarks?range=${range}`,
    fetcher
  );

  // ถ้าไม่มี data ยังโหลดอยู่
  if (!data || isLoading) {
    return (
      <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle>Portfolio vs Benchmarks (% Growth)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const { portfolio, benchmarks } = data;

  // Merge portfolio + selected benchmarks เพื่อ plot พร้อมกัน
  const merged: MergedPerformancePoint[] = (() => {
    // เตรียม map เก็บค่าล่าสุดของแต่ละ benchmark
    const lastSeen: Record<string, number> = {};

    return portfolio.map((p) => {
      const entry: MergedPerformancePoint = {
        date: p.date,
        portfolio: p.value,
      };

      for (const b of benchmarks) {
        // หา data ใน benchmark ที่ตรงกับวัน portfolio
        const match = b.data.find((x) => x.date === p.date);
        if (match) {
          entry[b.name] = match.value;
          lastSeen[b.name] = match.value;
        } else if (lastSeen[b.name] !== undefined) {
          // ไม่มีข้อมูลวันนั้น → ใช้ค่าก่อนหน้าแทน
          entry[b.name] = lastSeen[b.name];
        } else {
          // ยังไม่มีค่าเลย → เริ่มต้นที่ 0
          entry[b.name] = 0;
        }
      }

      return entry;
    });
  })();

  const ranges: { key: RangeType; label: string }[] = [
    { key: "day", label: "1D" },
    { key: "month", label: "1M" },
    { key: "year", label: "1Y" },
    { key: "max", label: "MAX" },
  ];

  const benchmarksList = [
    { key: "sp500", label: "S&P 500", color: "#3b82f6" },
    { key: "nasdaq", label: "NASDAQ 100", color: "#a855f7" },
    { key: "btc", label: "Bitcoin", color: "#f59e0b" },
    { key: "gold", label: "Gold", color: "#eab308" },
  ];

  const toggleBenchmark = (key: string) => {
    setSelectedBenchmarks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <CardTitle className="text-lg font-semibold">
          Portfolio vs Benchmarks (% Growth)
        </CardTitle>

        <div className="flex flex-wrap gap-2">
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

      <CardContent>
        <div className="flex gap-2 flex-wrap mb-4">
          {benchmarksList.map((b) => (
            <Button
              key={b.key}
              size="sm"
              variant={
                selectedBenchmarks.includes(b.key) ? "default" : "outline"
              }
              style={{
                borderColor: b.color,
                color: selectedBenchmarks.includes(b.key) ? "white" : b.color,
                backgroundColor: selectedBenchmarks.includes(b.key)
                  ? b.color
                  : "transparent",
              }}
              onClick={() => toggleBenchmark(b.key)}
            >
              {b.label}
            </Button>
          ))}
        </div>

        <div className="h-[300px] w-full flex justify-center items-center">
          <LineChart
            data={merged}
            width={900}
            height={300}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(v) => `${v.toFixed(0)}%`}
            />
            <Tooltip
              formatter={(v: number) => `${v.toFixed(2)}%`}
              labelFormatter={(v) =>
                new Date(v).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <Legend />

            {/* Portfolio Line */}
            <Line
              type="monotone"
              dataKey="portfolio"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={false}
              name="Portfolio"
            />

            {/* Dynamic Benchmarks */}
            {benchmarksList
              .filter((b) => selectedBenchmarks.includes(b.key))
              .map((b) => (
                <Line
                  key={b.key}
                  type="monotone"
                  dataKey={b.key}
                  stroke={b.color}
                  strokeWidth={1.8}
                  dot={false}
                  name={b.label}
                />
              ))}
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
}
