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

type Category = {
  name: string
  value: number
  gain: number
}

export function CategorySummaryTable({ data }: { data: Category[] }) {
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
            {data.map((c, i) => (
              <TableRow key={i}>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  ${c.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell
                  className={
                    c.gain > 0
                      ? "text-green-500"
                      : c.gain < 0
                      ? "text-red-500"
                      : "text-muted-foreground"
                  }
                >
                  {c.gain.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
