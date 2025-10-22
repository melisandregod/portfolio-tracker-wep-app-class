"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { ProjectionChart } from "@/components/analytics/projection-chart";
import { TopAssetsTable } from "@/components/analytics/top-assets-table";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AnalyticsPage() {
  const { data, error, isLoading } = useSWR("/api/analytics", fetcher);

  if (isLoading)
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading analytics...
      </div>
    );

  if (error || !data)
    return (
      <Card className="m-6 text-center border-none bg-muted/30 py-12">
        <CardContent>Failed to load analytics data.</CardContent>
      </Card>
    );

  const { metrics, projection, topAssets, worstAssets } = data;

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Portfolio Analytics
      </h1>

      {/*  Performance Overview */}
      <PerformanceMetrics data={metrics} />

      {/*  Projection for next 5 years */}
      <ProjectionChart data={projection} />

      {/*  Top / Worst Assets */}
      <TopAssetsTable top={topAssets} worst={worstAssets} />
    </div>
  );
}
