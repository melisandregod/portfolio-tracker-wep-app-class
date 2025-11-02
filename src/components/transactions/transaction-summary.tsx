"use client"

import useSWR from "swr"
import type { Transaction } from "@/types/transaction"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

export function TransactionSummary() {
  const { data, error, isLoading } = useSWR<Transaction[]>("/api/transactions")
  const t = useTranslations("transactions.summary")

  // ---------- Loading ----------
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

  // ---------- Error ----------
  if (error || !data)
    return <p className="text-sm text-destructive">{t("error")}</p>

  // ---------- แยกธุรกรรมซื้อขาย ----------
  const buyTx = data.filter((t) => t.type === "BUY")
  const sellTx = data.filter((t) => t.type === "SELL")

  // ---------- ยอดซื้อขายรวม ----------
  const totalBuy = buyTx.reduce(
    (sum, t) => sum + Number(t.quantity) * Number(t.price),
    0
  )
  const totalBuyQty = buyTx.reduce((sum, t) => sum + Number(t.quantity), 0)
  const totalSell = sellTx.reduce(
    (sum, t) => sum + Number(t.quantity) * Number(t.price),
    0
  )
  const totalSellQty = sellTx.reduce((sum, t) => sum + Number(t.quantity), 0)

  // ---------- คำนวณต้นทุนเฉลี่ย ----------
  const avgCost = totalBuyQty > 0 ? totalBuy / totalBuyQty : 0

  // ---------- คำนวณกำไรแบบ FIFO / partial sell ----------
  let remainingQty = totalBuyQty
  let profit = 0

  for (const sell of sellTx) {
    if (remainingQty <= 0) break
    const sellQty = Math.min(sell.quantity, remainingQty)
    const sellRevenue = sell.price * sellQty
    const sellCost = avgCost * sellQty
    profit += sellRevenue - sellCost
    remainingQty -= sellQty
  }

  // ---------- UI ----------
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Buy */}
      <Card className="border-none bg-gradient-to-br from-emerald-500/10 via-background to-background shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("totalBuy")}
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
            {t("totalSell")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-sky-500">
            ${totalSell.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </CardContent>
      </Card>

      {/* Net Profit / Loss */}
      <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("net")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              profit > 0
                ? "text-green-500"
                : profit < 0
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {profit === 0
              ? "–"
              : `$${Math.abs(profit).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
          </p>

          {/* แสดงเปอร์เซ็นต์กำไรถ้ามี */}
          {profit !== 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              ({((profit / (totalSellQty * avgCost)) * 100).toFixed(2)}%)
            </p>
          )}

          <p className="text-xs mt-1 text-muted-foreground">
            {profit > 0
              ? t("profit")
              : profit < 0
              ? t("loss")
              : t("noGains")}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
