"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type Holding = {
  symbol: string
  type: string
  value: number
  gain: string
  allocation: string
}

export function TopHoldingsTable({ data }: { data: Holding[] }) {
  if (!data?.length)
    return (
      <Card className="border-none bg-muted/30 text-center py-12">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            Top Holdings
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          No holdings data available.
        </CardContent>
      </Card>
    )

  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/20 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Top Holdings
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg overflow-hidden border border-muted/40">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="text-left font-semibold text-foreground">
                  Asset
                </TableHead>
                <TableHead className="text-left font-semibold text-foreground">
                  Type
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Value
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Gain / Loss
                </TableHead>
                <TableHead className="text-right font-semibold text-foreground">
                  Allocation
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((h, i) => {
                const isLoss = h.gain.startsWith("-")
                const isGain = h.gain.startsWith("+") || (!isLoss && h.gain !== "0%")

                const gainColor = isGain
                  ? "text-green-600"
                  : isLoss
                  ? "text-red-500"
                  : "text-muted-foreground"

                const gainIcon = isGain ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : isLoss ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : null

                

                return (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/25 transition-all border-b border-muted/20"
                  >
                    {/* Symbol */}
                    <TableCell className="font-semibold text-foreground">
                      {h.symbol}
                    </TableCell>

                    {/* Type */}
                    <TableCell className="text-muted-foreground">
                      {h.type}
                    </TableCell>

                    {/* Value */}
                    <TableCell className="text-right text-foreground font-medium">
                      ${h.value.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* Gain / Loss */}
                    <TableCell
                      className={`text-right font-semibold flex items-center justify-end gap-1 ${gainColor}`}
                    >
                      {gainIcon}
                      {h.gain}
                    </TableCell>

                    {/* Allocation + bar */}
                    <TableCell className="text-right font-medium text-foreground w-[20%]">
                      <div className="flex flex-col items-end">
                        <span>{h.allocation}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
