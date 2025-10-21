"use client"

import useSWR from "swr"
import type { Transaction } from "@/types/transaction"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TransactionSummary() {
  const { data, error, isLoading } = useSWR<Transaction[]>("/api/transactions")

  if (isLoading)
    return (
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm"
          >
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-24" />
            </CardContent>
          </Card>
        ))}
      </section>
    )

  if (error || !data)
    return (
      <p className="text-sm text-destructive">
        Failed to load summary data. Please try again later.
      </p>
    )

  // คำนวณยอดรวม
  const totalBuy = data
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.quantity * t.price, 0)

  const totalSell = data
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.quantity * t.price, 0)

  const hasSell = data.some((t) => t.type === "SELL")
  const net = hasSell ? totalSell - totalBuy : 0

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/*  Total Buy */}
      <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-background to-background shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Buy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-emerald-500">
            ${totalBuy.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      {/* Total Sell */}
      <Card className="border-none bg-gradient-to-br from-sky-500/10 via-background to-background shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Sell
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-sky-500">
            ${totalSell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      {/*  Net Profit/Loss */}
      <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Profit / Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              net > 0
                ? "text-green-500"
                : net < 0
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {net === 0
              ? "–"
              : `$${Math.abs(net).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            {net > 0
              ? "Profit"
              : net < 0
              ? "Loss"
              : "No realized gains yet"}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
