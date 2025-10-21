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
          <Card key={i}>
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

  // คำนวณยอดรวมแบบง่าย
  const totalBuy = data
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.quantity * t.price, 0)

  const totalSell = data
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.quantity * t.price, 0)

  // ถ้ายังไม่มี SELL เลย → ไม่มีกำไร
  const hasSell = data.some((t) => t.type === "SELL")
  const net = hasSell ? totalSell - totalBuy : 0

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Buy</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold text-muted-foreground">
          ${totalBuy.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Sell</CardTitle>
        </CardHeader>
        <CardContent className="text-xl font-semibold text-muted-foreground">
          ${totalSell.toLocaleString()}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Profit/Loss</CardTitle>
        </CardHeader>
        <CardContent
          className={`text-xl font-semibold ${
            net > 0 ? "text-green-500" : net < 0 ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {net === 0 ? "–" : `${net > 0 ? "+" : "-"}$${Math.abs(net).toLocaleString()}`}
        </CardContent>
      </Card>
    </section>
  )
}
