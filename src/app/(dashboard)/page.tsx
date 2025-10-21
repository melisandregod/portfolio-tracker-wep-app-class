"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCcw } from "lucide-react";
import { PortfolioSummary } from "@/components/overview/portfolio-summary";
import { AssetAllocationChart } from "@/components/overview/asset-allocation-chart";
import { CategorySummaryTable } from "@/components/overview/category-summary-table";
import { PerformanceChart } from "@/components/overview/performance-chart";
import { TopHoldingsTable } from "@/components/overview/top-holdings-table";
import { OverviewResponse } from "@/types/overview";

export default function OverviewPage() {
  const { data, error, isLoading, mutate } = useSWR<OverviewResponse>(
    "/api/overview",
    fetcher,
    {
      refreshInterval: 0, // ไม่ refetch อัตโนมัติ
      revalidateOnFocus: false,
    }
  );

  // 🧠 Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-8 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-[250px] w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-[250px] w-full" />
          </Card>
        </div>

        <Card className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </Card>

        <Card className="p-6">
          <Skeleton className="h-[250px] w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }

  if (!data) return null;

  // 🕒 แสดงเวลาที่ดึงข้อมูล
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    hour12: false,
  });

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header + timestamp */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Portfolio Overview</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Last updated: {timestamp}</span>
          <button
            onClick={() => mutate()}
            className="text-muted-foreground hover:text-foreground transition"
            title="Refresh data"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 1️⃣ Summary */}
      <PortfolioSummary data={data.summary} />

      {/* 2️⃣ Middle: Pie Chart + Category Table */}
      <div className="grid md:grid-cols-2 gap-6">
        <AssetAllocationChart data={data.allocation} />
        <CategorySummaryTable data={data.categories} />
      </div>

      {/* 3️⃣ Performance Chart */}
      <PerformanceChart data={data.performance} />

      {/* 4️⃣ Top Holdings */}
      <TopHoldingsTable data={data.topHoldings} />
    </div>
  );
}
