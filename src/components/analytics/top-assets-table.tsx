"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"

const topAssets = [
  { asset: "NVDA", gain: "+24.5%", value: "$2,340" },
  { asset: "BTC", gain: "+19.8%", value: "$2,900" },
  { asset: "AAPL", gain: "+8.4%", value: "$1,780" },
]

const worstAssets = [
  { asset: "TSLA", gain: "-4.5%", value: "$950" },
  { asset: "GLD", gain: "-2.1%", value: "$1,050" },
]

export function TopAssetsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top / Worst Performing Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-green-600">Top Performers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Gain</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAssets.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell>{a.asset}</TableCell>
                    <TableCell className="text-green-500">{a.gain}</TableCell>
                    <TableCell>{a.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-red-600">Worst Performers</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Loss</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worstAssets.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell>{a.asset}</TableCell>
                    <TableCell className="text-red-500">{a.gain}</TableCell>
                    <TableCell>{a.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
