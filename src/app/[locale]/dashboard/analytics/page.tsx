"use client"

import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { ReturnsChart } from "@/components/analytics/returns-chart"
import { GainLossBreakdown } from "@/components/analytics/gain-loss-breakdown"
import { TopAssetsTable } from "@/components/analytics/top-assets-table"
import { ProjectionChart } from "@/components/analytics/projection-chart"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <PerformanceMetrics />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReturnsChart />
        <GainLossBreakdown />
      </div>

      <ProjectionChart />

      <TopAssetsTable />
    </div>
  )
}
