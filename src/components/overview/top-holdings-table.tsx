"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const holdings = [
  { asset: "NVDA", type: "Stock", value: "$2,340", gain: "+14.2%", allocation: "18%" },
  { asset: "AAPL", type: "Stock", value: "$1,780", gain: "+6.8%", allocation: "12%" },
  { asset: "BTC", type: "Crypto", value: "$2,900", gain: "+25.5%", allocation: "20%" },
  { asset: "GLD", type: "ETF (Gold)", value: "$1,050", gain: "+3.2%", allocation: "7%" },
]

export function TopHoldingsTable() {
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
            {holdings.map((h, i) => (
              <TableRow key={i}>
                <TableCell>{h.asset}</TableCell>
                <TableCell>{h.type}</TableCell>
                <TableCell>{h.value}</TableCell>
                <TableCell className="text-green-500">{h.gain}</TableCell>
                <TableCell>{h.allocation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
