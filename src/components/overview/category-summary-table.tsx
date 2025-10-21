"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CategorySummaryTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Gain/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Stocks</TableCell>
              <TableCell>$5,600</TableCell>
              <TableCell className="text-green-500">+9.1%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ETFs</TableCell>
              <TableCell>$3,200</TableCell>
              <TableCell className="text-green-500">+7.4%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Crypto</TableCell>
              <TableCell>$2,900</TableCell>
              <TableCell className="text-green-500">+25.5%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gold</TableCell>
              <TableCell>$1,150</TableCell>
              <TableCell className="text-green-500">+3.2%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
