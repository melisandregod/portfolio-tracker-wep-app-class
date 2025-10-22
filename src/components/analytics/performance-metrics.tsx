// components/analytics/performance-metrics.tsx
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Metrics = { cagr: number; sharpe: number; drawdown: number };

export function PerformanceMetrics({ data }: { data: Metrics }) {
  const cagrColor = data.cagr >= 0 ? "text-green-600" : "text-red-500";
  const ddColor = data.drawdown <= 0 ? "text-red-500" : "text-green-600";

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader><CardTitle>CAGR</CardTitle></CardHeader>
        <CardContent className={`text-xl font-semibold ${cagrColor}`}>
          {(data.cagr * 100).toFixed(2)}%
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sharpe Ratio</CardTitle></CardHeader>
        <CardContent className="text-xl font-semibold">
          {data.sharpe.toFixed(2)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Max Drawdown</CardTitle></CardHeader>
        <CardContent className={`text-xl font-semibold ${ddColor}`}>
          {(data.drawdown * 100).toFixed(2)}%
        </CardContent>
      </Card>
    </section>
  );
}
