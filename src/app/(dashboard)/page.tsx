"use client"

import { PortfolioSummary } from "@/components/overview/portfolio-summary"
import { AssetAllocationChart } from "@/components/overview/asset-allocation-chart"
import { CategorySummaryTable } from "@/components/overview/category-summary-table"
import { PerformanceChart } from "@/components/overview/performance-chart"
import { TopHoldingsTable } from "@/components/overview/top-holdings-table"

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Portfolio Summary */}
      <PortfolioSummary />

      {/* Asset Allocation + Category Summary */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssetAllocationChart />
        <CategorySummaryTable />
      </section>

      {/* Performance Overview */}
      <PerformanceChart />

      {/* Mini Table - Top Holdings */}
      <TopHoldingsTable />
    </div>
  )
}
