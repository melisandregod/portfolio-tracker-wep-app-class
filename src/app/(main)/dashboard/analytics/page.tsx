"use client";

import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { ProjectionChart } from "@/components/analytics/projection-chart";
import { TopAssetsTable } from "@/components/analytics/top-assets-table";
import { PerformanceBenchmarks } from "@/components/analytics/performance-chart";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AnalyticsPage() {
  const { data, error, isLoading } = useSWR("/api/analytics", fetcher);

  // Skeleton Loading Layout
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 animate-pulse">
        <h1 className="text-2xl font-semibold tracking-tight text-muted-foreground">
          Portfolio Analytics
        </h1>

        {/* Metrics Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 shadow-sm border-none bg-muted/30">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-8 w-20" />
            </Card>
          ))}
        </section>

        {/* Benchmarks Skeleton */}
        <Card className="border-none bg-muted/30 p-6">
          <Skeleton className="h-6 w-64 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </Card>

        {/* Projection + TopAssets Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-none bg-muted/30 p-6">
            <Skeleton className="h-6 w-52 mb-4" />
            <Skeleton className="h-[320px] w-full rounded-xl" />
          </Card>
          <Card className="border-none bg-muted/30 p-6">
            <Skeleton className="h-6 w-52 mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Error / No Data
  if (error || !data)
    return (
      <Card className="m-6 text-center border-none bg-muted/30 py-12">
        <CardContent>Failed to load analytics data.</CardContent>
      </Card>
    );
    if (
    !data ||
    !data.metrics ||
    !data.projection?.length ||
    (!data.topAssets?.length && !data.worstAssets?.length)
  ) {
    return (
      <Card className="m-6 text-center border-none bg-muted/30 py-16">
        <CardContent className="space-y-2">
          <h2 className="text-lg font-semibold">No portfolio data yet</h2>
          <p className="text-sm text-muted-foreground">
            Add some transactions to see your performance analytics here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Main Page (Loaded)
  const { metrics, projection, topAssets, worstAssets } = data;

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Portfolio Analytics
      </h1>

      <PerformanceMetrics data={metrics} />
      <PerformanceBenchmarks />

      <div className="grid md:grid-cols-2 gap-6">
        <ProjectionChart data={projection} />
        <TopAssetsTable top={topAssets} worst={worstAssets} />
      </div>
    </div>
  );
}
