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
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          No holdings data available.
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Gain/Loss</TableHead>
              <TableHead>Allocation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((h, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{h.symbol}</TableCell>
                <TableCell>{h.type}</TableCell>
                <TableCell>
                  ${h.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell
                  className={
                    h.gain.startsWith("-")
                      ? "text-red-500"
                      : h.gain.startsWith("+") || !h.gain.startsWith("-")
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }
                >
                  {h.gain}
                </TableCell>
                <TableCell>{h.allocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
